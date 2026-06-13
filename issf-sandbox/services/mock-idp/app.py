"""
ISSF Sandbox — Mock Identity Provider
Simulates biometric + smart card authentication against OPA.
"""
import json
import os
import time
import uuid
from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OPA_URL = os.environ.get("OPA_URL", "http://opa.issf-sandbox.ng:8181")
OPA_AUTHZ_PATH = os.environ.get("OPA_AUTHZ_PATH", "v1/data/identity/authz/allow")
ES_URL = os.environ.get("ES_URL", "http://es.issf-sandbox.ng:9200")

OPERATORS = {
    "CDR_OKONKWO": {
        "name": "Col. Chidi Okonkwo",
        "rank": "Colonel",
        "unit": "JTF North-East",
        "clearance": "TOP_SECRET",
        "facilities": ["HQ_ABUJA", "JTF_MAIDUGURI", "FUSION_CENTER"],
        "shift_start": 6,
        "shift_end": 20,
        "enrolled_devices": ["TABLET-A001", "WS-BUNKER-3", "TABLET-C2"],
    },
    "MAJ_ADEOBA": {
        "name": "Major Funke Adeoba",
        "rank": "Major",
        "unit": "Intel Fusion Center",
        "clearance": "SECRET",
        "facilities": ["HQ_ABUJA", "FUSION_CENTER"],
        "shift_start": 8,
        "shift_end": 18,
        "enrolled_devices": ["WS-FUSION-1", "WS-FUSION-2"],
    },
    "CPT_DANJUMA": {
        "name": "Captain Ibrahim Danjuma",
        "rank": "Captain",
        "unit": "QRF Command",
        "clearance": "SECRET",
        "facilities": ["JTF_MAIDUGURI", "QRF_FOB_GOMBE", "QRF_FOB_YOLA"],
        "shift_start": 0,
        "shift_end": 24,
        "enrolled_devices": ["TABLET-QRF-1", "TABLET-QRF-2", "RADIO-TERMINAL-A"],
    },
    "LT_NWACHUKWU": {
        "name": "Lt. Amara Nwachukwu",
        "rank": "Lieutenant",
        "unit": "Sensors Platoon",
        "clearance": "RESTRICTED",
        "facilities": ["FOB_DAMATURU", "FOB_GWOZA"],
        "shift_start": 6,
        "shift_end": 22,
        "enrolled_devices": ["TABLET-S1", "DRONE-CONTROLLER-B"],
    },
    "INSIDER_MALAMA": {
        "name": "Mr. Ibrahim Malama",
        "rank": "Civilian Analyst",
        "unit": "Intel Fusion Center",
        "clearance": "SECRET",
        "facilities": ["HQ_ABUJA", "FUSION_CENTER"],
        "shift_start": 8,
        "shift_end": 17,
        "enrolled_devices": ["WS-FUSION-3"],
        "note": "INSIDER THREAT TEST: coerced by bandit syndicate",
    },
}

SESSIONS = {}


@app.route("/.well-known/openid-configuration")
def oidc_config():
    return jsonify({
        "issuer": "https://idp.issf-sandbox.ng:8443/auth/realms/issf",
        "authorization_endpoint": "http://idp.issf-sandbox.ng:8443/auth",
        "token_endpoint": "http://idp.issf-sandbox.ng:8443/token",
        "grant_types_supported": ["biometric_smartcard"],
    })


@app.route("/auth", methods=["POST"])
def authenticate():
    data = request.get_json() or {}
    operator_id = data.get("operator_id", "").upper()
    biometric_hash = data.get("biometric_hash")
    smartcard_present = data.get("smartcard_present", False)
    smartcard_signature = data.get("smartcard_signature")
    facility_id = data.get("facility_id", "")
    device_id = data.get("device_id", "")
    request_time = int(data.get("request_time", time.time()))

    if operator_id not in OPERATORS:
        return jsonify({"authenticated": False, "reason": "Unknown operator"}), 401

    op = OPERATORS[operator_id]

    opa_input = {
        "input": {
            "auth_method": "biometric_smartcard",
            "biometric_verified": biometric_hash is not None,
            "smartcard_present": smartcard_present,
            "smartcard_signature_valid": smartcard_signature is not None,
            "user": {
                "id": operator_id,
                "facilities": op["facilities"],
                "shift_start": op["shift_start"],
                "shift_end": op["shift_end"],
                "enrolled_devices": op["enrolled_devices"],
            },
            "facility_id": facility_id,
            "request_time": request_time,
            "device_id": device_id,
        }
    }

    try:
        r = requests.post(f"{OPA_URL}/{OPA_AUTHZ_PATH}", json=opa_input, timeout=5)
        result = r.json()
        allowed = result.get("result", False)
    except Exception as e:
        app.logger.error(f"OPA call failed: {e}")
        allowed = False

    if allowed:
        token = str(uuid.uuid4())
        expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
        SESSIONS[token] = {
            "operator_id": operator_id,
            "name": op["name"],
            "rank": op["rank"],
            "clearance": op["clearance"],
            "facility_id": facility_id,
            "device_id": device_id,
            "expires_at": expiry.isoformat(),
        }

        _log_to_es("auth_success", {
            "operator_id": operator_id,
            "name": op["name"],
            "facility": facility_id,
            "device": device_id,
            "clearance": op["clearance"],
        })

        return jsonify({
            "authenticated": True,
            "token": token,
            "session": SESSIONS[token],
            "message": f"{op['rank']} {op['name']} authenticated via biometric + smart card",
        })

    denied_reason = "access denied"
    if facility_id not in op["facilities"]:
        denied_reason = f"unauthorized facility: {facility_id}"
    elif device_id not in op["enrolled_devices"]:
        denied_reason = f"unenrolled device: {device_id}"
    elif smartcard_present is not True or smartcard_signature is None:
        denied_reason = "smart card missing or invalid signature"
    elif biometric_hash is None:
        denied_reason = "biometric verification failed"

    _log_to_es("auth_failure", {
        "operator_id": operator_id,
        "facility": facility_id,
        "device": device_id,
        "reason": denied_reason,
    })

    return jsonify({"authenticated": False, "reason": denied_reason}), 403


@app.route("/session/<token>", methods=["GET"])
def check_session(token):
    session = SESSIONS.get(token)
    if not session:
        return jsonify({"valid": False}), 404
    expires = datetime.fromisoformat(session["expires_at"])
    if expires < datetime.now(timezone.utc):
        del SESSIONS[token]
        return jsonify({"valid": False, "reason": "expired"}), 401
    return jsonify({"valid": True, "session": session})


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "mock-idp", "operators": len(OPERATORS), "sessions": len(SESSIONS)})


def _log_to_es(doc_type, data):
    try:
        doc = {"@timestamp": datetime.now(timezone.utc).isoformat(), "type": doc_type, **data}
        requests.post(f"{ES_URL}/issf-idp-logs/_doc", json=doc, timeout=2)
    except Exception:
        pass


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8443, debug=False)
