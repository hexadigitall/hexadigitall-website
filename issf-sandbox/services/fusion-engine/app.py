"""
ISSF Sandbox — Fusion Engine (Lite mode)
Polls sensor gateway for data, evaluates threat via OPA, dispatches alerts.
No Kafka/ES dependency - everything over HTTP with in-memory state.
"""
import json
import os
import threading
import time
from datetime import datetime, timezone
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OPA_URL = os.environ.get("OPA_URL", "http://opa.issf-sandbox.ng:8181")
OPA_THREAT_PATH = os.environ.get("OPA_THREAT_PATH", "v1/data/fusion/threat_scoring/auto_actions")
SENSOR_URL = os.environ.get("SENSOR_URL", "http://sensors.issf-sandbox.ng:8080")
QRF_WEBHOOK = os.environ.get("QRF_WEBHOOK", "http://console.issf-sandbox.ng:9099/webhook/qrf")

sensor_window = {"sim": [], "fuel": [], "motion": [], "drone": [], "comms": []}
alert_history = []
WINDOW_SECONDS = 300


def poll_sensors():
    """Poll the sensor gateway API for current stats."""
    while True:
        try:
            r = requests.get(f"{SENSOR_URL}/stats", timeout=5)
            if r.ok:
                data = r.json()
                sensor_window["_latest_scenario"] = data.get("scenario", "unknown")
        except Exception:
            pass
        time.sleep(3)


def evaluate_threat():
    now = time.time()
    cutoff = now - WINDOW_SECONDS
    for key in sensor_window:
        if isinstance(sensor_window[key], list):
            sensor_window[key] = [e for e in sensor_window[key] if e.get("ts", 0) > cutoff]

    sim_count = sum(e.get("unregistered_sim_count", e.get("count", 1)) for e in sensor_window["sim"])
    fuel_vals = [e.get("surge_percent", 0) for e in sensor_window["fuel"]]
    fuel_surge = sum(fuel_vals) / max(len(fuel_vals), 1)
    motion_count = len(sensor_window["motion"])
    comms_count = len(sensor_window["comms"])

    opa_input = {
        "input": {
            "sim_cluster_count": sim_count,
            "fuel_surge_percent": fuel_surge,
            "camera_motion_alerts": motion_count,
            "unusual_comms_volume": comms_count,
            "human_commander_authorized": False,
        }
    }

    try:
        r = requests.post(f"{OPA_URL}/{OPA_THREAT_PATH}", json=opa_input, timeout=5)
        result = r.json()
        actions = result.get("result", [])
        denied = result.get("deny", [])
    except Exception as e:
        app.logger.error(f"OPA call failed: {e}")
        actions = ["log_observation"]
        denied = []

    score = sim_count * 10 + fuel_surge * 2 + motion_count * 5 + comms_count * 3
    if score >= 80: threat_level = "red"
    elif score >= 50: threat_level = "orange"
    elif score >= 20: threat_level = "yellow"
    else: threat_level = "green"

    return {
        "score": int(score),
        "threat_level": threat_level,
        "sim_count": sim_count,
        "fuel_surge": round(fuel_surge, 1),
        "motion_count": motion_count,
        "comms_count": comms_count,
        "actions": actions,
        "denied": denied,
        "opa_input": {k: v for k, v in opa_input["input"].items()},
    }


def simulate_sensor_feed():
    """Read sensor data from the gateway every 5 seconds."""
    sim_seq = 0
    while True:
        time.sleep(5)
        try:
            r = requests.get(f"{SENSOR_URL}/stats", timeout=3)
            if not r.ok:
                continue
        except Exception:
            continue

        now = time.time()
        import random

        scenario = sensor_window.get("_latest_scenario", "peaceful")
        intensity = {"peaceful": 0.3, "attack_prep": 2.5, "active_attack": 4.0}.get(scenario, 0.3)

        sim_seq += 1
        if sim_seq % 3 == 0:
            sensor_window["sim"].append({
                "type": "sim_cluster", "ts": now,
                "unregistered_sim_count": int(random.randint(1, 8) * intensity),
                "sector": random.choice(["SAMBISA", "MANDARA", "KADUNA_HWY"]),
            })
        if sim_seq % 4 == 0:
            sensor_window["fuel"].append({
                "type": "fuel_surge", "ts": now,
                "surge_percent": round(random.uniform(0, 30) * intensity, 1),
                "sector": random.choice(["SAMBISA", "ZAMFARA", "BIRNIN_GWARI"]),
            })
        if sim_seq % 2 == 0:
            sensor_window["motion"].append({
                "type": "camera_motion", "ts": now,
                "motion_class": random.choice(["human_group", "vehicle"]),
                "confidence": round(random.uniform(0.7, 0.99), 2),
                "sector": random.choice(["MANDARA", "GWOZA", "LAKE_CHAD"]),
            })
            sensor_window["drone"].append({
                "type": "drone_telemetry", "ts": now,
                "altitude_m": random.randint(200, 1500),
                "sector": random.choice(["SAMBISA", "KADUNA_HWY"]),
            })
        if sim_seq % 6 == 0 and random.random() < 0.3:
            sensor_window["comms"].append({
                "type": "comms_intercept", "ts": now,
                "keywords": random.sample(["attack", "fuel", "ambush", "riders", "highway"], 2),
            })

        threat = evaluate_threat()
        if threat["threat_level"] in ("red", "orange"):
            alert = {"@timestamp": datetime.now(timezone.utc).isoformat(), "type": "threat_alert", **threat}
            alert_history.append(alert)
            if len(alert_history) > 100:
                alert_history.pop(0)

            if threat["threat_level"] == "red":
                dispatch_qrf(threat)
                app.logger.warning(
                    f"RED ALERT: Score={threat['score']} | "
                    f"SIM={threat['sim_count']} Fuel={threat['fuel_surge']}% "
                    f"Motion={threat['motion_count']} Comms={threat['comms_count']} | "
                    f"Actions: {threat['actions']}"
                )
            else:
                app.logger.warning(
                    f"ORANGE ALERT: Score={threat['score']} | "
                    f"Actions: {threat['actions']}"
                )


def dispatch_qrf(threat):
    try:
        payload = {
            "incident_id": f"ISSF-SANDBOX-{int(time.time())}",
            "threat_level": "RED",
            "score": threat["score"],
            "gps_coordinates": "SIMULATED: 11.5N 13.2E",
            "actions": threat["actions"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        requests.post(QRF_WEBHOOK, json=payload, timeout=3)
        app.logger.info(f"QRF dispatch sent: {payload['incident_id']}")
    except Exception as e:
        app.logger.error(f"QRF dispatch failed: {e}")


@app.route("/threat")
def current_threat():
    return jsonify(evaluate_threat())


@app.route("/alerts")
def get_alerts():
    return jsonify(alert_history[-50:])


@app.route("/window")
def get_window():
    return jsonify({
        k: {"count": len(v) if isinstance(v, list) else v, "latest": v[-1] if isinstance(v, list) and v else None}
        for k, v in sensor_window.items()
    })


@app.route("/scenario", methods=["POST"])
def set_scenario():
    data = request.get_json() or {}
    scen = data.get("scenario", "peaceful")
    try:
        r = requests.post(f"{SENSOR_URL}/scenario", json={"scenario": scen}, timeout=3)
        return r.json()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({
        "status": "ok", "service": "fusion-engine",
        "alerts_in_window": len(alert_history),
        "sensor_window": {k: len(v) if isinstance(v, list) else "scenario" for k, v in sensor_window.items()},
    })


if __name__ == "__main__":
    t1 = threading.Thread(target=poll_sensors, daemon=True)
    t1.start()
    t2 = threading.Thread(target=simulate_sensor_feed, daemon=True)
    t2.start()
    app.run(host="0.0.0.0", port=9090, debug=False)
