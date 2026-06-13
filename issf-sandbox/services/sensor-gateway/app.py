"""
ISSF Sandbox — Sensor Gateway (Lite mode)
Simulates drone feeds, camera traps, telecom SIM data, fuel logistics.
No Kafka dependency - exposes REST API for fusion engine to poll.
"""
import json, os, time, random, threading
from datetime import datetime, timezone
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
OPA_URL = os.environ.get("OPA_URL", "http://opa.issf-sandbox.ng:8181")
SELF_WIPE_PATH = os.environ.get("SELF_WIPE_PATH", "v1/data/device/selfwipe/trigger_wipe")
SCENARIO = os.environ.get("SCENARIO", "peaceful")

FOREST_SECTORS = [
    "SAMBISA_FOREST", "MANDARA_MOUNTAINS", "GWOZA_BORDER",
    "KADUNA_ABUJA_HWY", "BIRNIN_GWARI", "KAMUKU_FOREST",
    "ZAMFARA_WOODLAND", "LAKE_CHAD_MARSH", "FOMBE_FOREST",
]

latest_data = {
    "sim_clusters": [], "fuel_surges": [], "motion_alerts": [],
    "drone_telemetry": [], "comms_intercepts": [],
    "scenario": SCENARIO, "generated_count": 0,
}


def generate_data():
    global latest_data
    while True:
        scenario_mult = {"peaceful": 0.3, "attack_prep": 2.5, "active_attack": 4.0}.get(SCENARIO, 0.3)
        sector = random.choice(FOREST_SECTORS)

        if random.random() < 0.3 * scenario_mult:
            count = int(random.randint(1, 8) * scenario_mult)
            latest_data["sim_clusters"].append({
                "type": "sim_cluster", "sector": sector,
                "unregistered_sim_count": min(count, 20),
                "network": random.choice(["MTN", "GLO", "AIRTEL", "9MOBILE"]),
                "ts": time.time(),
            })

        if random.random() < 0.25 * scenario_mult:
            surge = random.uniform(0, 30) * scenario_mult
            latest_data["fuel_surges"].append({
                "type": "fuel_surge", "sector": sector,
                "surge_percent": round(min(surge, 100), 1),
                "estimated_litres": int(surge * 200),
                "source": random.choice(["NNPC_DEPOT", "BLACK_MARKET", "BORDER_CROSSING"]),
                "ts": time.time(),
            })

        if random.random() < 0.4 * scenario_mult:
            latest_data["motion_alerts"].append({
                "type": "camera_motion", "sector": sector,
                "camera_id": f"CT-{random.randint(1,50):03d}",
                "motion_class": random.choice(["human_group", "vehicle", "unknown"]),
                "confidence": round(random.uniform(0.7, 0.99), 2),
                "ts": time.time(),
            })

        if random.random() < 0.2 * scenario_mult:
            latest_data["drone_telemetry"].append({
                "type": "drone_telemetry", "sector": sector,
                "drone_id": f"RQ-{random.randint(1,12):02d}",
                "altitude_m": random.randint(200, 1500),
                "speed_kmh": random.randint(40, 120),
                "ts": time.time(),
            })

        if random.random() < 0.15 * scenario_mult:
            latest_data["comms_intercepts"].append({
                "type": "comms_intercept", "sector": sector,
                "protocol": random.choice(["HF_RADIO", "VHF_RADIO", "SAT_PHONE"]),
                "language": random.choice(["HAUSA", "KANURI", "FULFULDE"]),
                "keywords": random.sample(["attack", "fuel", "ambush", "riders", "highway", "night"], 2),
                "ts": time.time(),
            })

        latest_data["generated_count"] += 1

        cutoff = time.time() - 300
        for key in latest_data:
            if isinstance(latest_data[key], list):
                latest_data[key] = [e for e in latest_data[key] if e.get("ts", 0) > cutoff]

        time.sleep(2)


@app.route("/simulate/selfwipe", methods=["POST"])
def simulate_selfwipe():
    data = request.get_json() or {}
    trigger = data.get("trigger", "tamper_sensor")
    opa_input = {
        "input": {
            "tamper_sensor_triggered": trigger == "tamper_sensor",
            "tamper_timestamp": int(time.time()),
            "last_heartbeat": int(time.time()) - (5 if trigger == "tamper_sensor" else 35),
            "heartbeat_lost": trigger == "heartbeat_loss",
            "seconds_since_last_heartbeat": 35,
            "gps_location_valid": trigger != "gps_mismatch",
            "unauthorized_movement_detected": trigger == "gps_mismatch",
            "consecutive_auth_failures": 4 if trigger == "brute_force" else 0,
            "remote_wipe_command": trigger == "remote_command",
            "remote_wipe_command_signed": True,
            "remote_wipe_authority": "fusion_center",
            "device_status": "sanitized" if trigger == "post_wipe" else "active",
            "storage_overwritten": trigger == "post_wipe",
            "crypto_keys_destroyed": trigger == "post_wipe",
        }
    }
    try:
        r = requests.post(f"{OPA_URL}/{SELF_WIPE_PATH}", json=opa_input, timeout=5)
        triggered = r.json().get("result", False)
    except Exception as e:
        triggered = False
    return jsonify({
        "trigger": trigger,
        "selfwipe_triggered": triggered,
        "message": "DEVICE WIPED: All data destroyed, keys revoked." if triggered else "No wipe triggered",
    })


@app.route("/scenario", methods=["POST"])
def change_scenario():
    global SCENARIO
    data = request.get_json() or {}
    s = data.get("scenario", "peaceful")
    if s in ("peaceful", "attack_prep", "active_attack"):
        SCENARIO = s
        latest_data["scenario"] = s
        return jsonify({"status": "ok", "scenario": s})
    return jsonify({"error": f"Invalid scenario: {s}"}), 400


@app.route("/scenario")
def get_scenario():
    return jsonify({"scenario": SCENARIO})


@app.route("/stats")
def get_stats():
    return jsonify({
        "scenario": SCENARIO,
        "generated_count": latest_data["generated_count"],
        "window_counts": {k: len(v) for k, v in latest_data.items() if isinstance(v, list)},
    })


@app.route("/data")
def get_data():
    return jsonify(latest_data)


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "sensor-gateway", "scenario": SCENARIO})


if __name__ == "__main__":
    t = threading.Thread(target=generate_data, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=8080, debug=False)
