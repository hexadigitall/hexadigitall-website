"""
ISSF Sandbox — Console (Lite mode)
Web dashboard, QRF webhook receiver, test runner.
"""
import json, os, time
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

OPA_URL = os.environ.get("OPA_URL", "http://opa.issf-sandbox.ng:8181")
IDP_URL = os.environ.get("IDP_URL", "http://idp.issf-sandbox.ng:8443")
SENSOR_URL = os.environ.get("SENSOR_URL", "http://sensors.issf-sandbox.ng:8080")
FUSION_URL = os.environ.get("FUSION_URL", "http://fusion.issf-sandbox.ng:9090")

qrf_dispatches = []

DASHBOARD_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ISSF Sandbox Console</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; background: #0a0e17; color: #c9d1d9; padding: 20px; }
  h1 { color: #c53030; border-bottom: 2px solid #c53030; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; }
  h2 { color: #f0e6d0; margin: 15px 0 8px 0; font-size: 14px; border-left: 3px solid #c53030; padding-left: 8px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .card { background: #111827; border: 1px solid #1f2937; border-radius: 4px; padding: 12px; }
  .card h3 { color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .value { font-size: 24px; font-weight: bold; }
  .green { color: #22c55e; } .yellow { color: #eab308; } .orange { color: #f97316; } .red { color: #ef4444; } .gray { color: #6b7280; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
  th { background: #1f2937; text-align: left; padding: 6px 8px; color: #9ca3af; font-size: 10px; text-transform: uppercase; }
  td { padding: 5px 8px; border-bottom: 1px solid #1f2937; }
  .controls { display: flex; gap: 8px; margin: 15px 0; flex-wrap: wrap; }
  button { background: #1f2937; color: #c9d1d9; border: 1px solid #374151; padding: 8px 16px; cursor: pointer; font-family: 'Courier New', monospace; font-size: 12px; border-radius: 4px; }
  button:hover { background: #374151; border-color: #c53030; }
  button.danger { border-color: #c53030; color: #ef4444; }
  button.danger:hover { background: #c53030; color: white; }
  pre { background: #000; padding: 10px; border-radius: 4px; font-size: 11px; overflow-x: auto; max-height: 200px; margin-top: 8px; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; }
  .badge.red { background: #7f1d1d; color: #fca5a5; }
  .badge.orange { background: #7c2d12; color: #fdba74; }
  .badge.green { background: #14532d; color: #86efac; }
  .section { margin-bottom: 25px; }
</style>
</head>
<body>
<h1>ISSF Sandbox Console</h1>
<p style="color:#6b7280;margin-bottom:15px;">Sovereign Integrated Security Solutions Framework &mdash; Test Environment</p>

<div class="section">
<h2>Scenario Controls</h2>
<div class="controls">
<button onclick="setScenario('peaceful')">Peaceful</button>
<button onclick="setScenario('attack_prep')">Attack Prep</button>
<button onclick="setScenario('active_attack')">Active Attack</button>
<button id="run-tests-btn" onclick="runAllTests()">Run All Tests</button>
</div>
</div>

<div class="section">
<h2>Fusion Status</h2>
<div class="grid" id="status"></div>
</div>

<div class="section">
<h2>Alerts</h2>
<div class="card" id="alerts"></div>
</div>

<div class="section">
<h2>QRF Dispatches</h2>
<div class="card" id="dispatches"></div>
</div>

<div class="section">
<h2>Identity Auth Tests</h2>
<div class="controls">
<button onclick="testAuth('CDR_OKONKWO','HQ_ABUJA','TABLET-A001',true,true)">Col Okonkwo (valid)</button>
<button onclick="testAuth('CDR_OKONKWO','HQ_ABUJA','STOLEN_TABLET',true,true)">Wrong device</button>
<button onclick="testAuth('CDR_OKONKWO','ENEMY_CAMP','TABLET-A001',true,true)">Wrong facility</button>
<button onclick="testAuth('INSIDER_MALAMA','FUSION_CENTER','WS-FUSION-3',true,true)">Insider Malama</button>
</div>
<pre id="auth-result">Click a button to test authentication.</pre>
</div>

<div class="section">
<h2>Sensor Window</h2>
<div class="card" id="window"></div>
</div>

<div class="section">
<h2>Test Results</h2>
<pre id="test-out">Ready.</pre>
</div>

<script>
function setScenario(s) {
  fetch('/api/scenario/' + s, {method:'POST'}).then(r=>r.json()).then(d=>{
    document.getElementById('test-out').textContent = JSON.stringify(d,null,2);
  });
}
function testAuth(op, fac, dev, bio, sc) {
  fetch('/api/auth/test', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      operator_id: op, facility_id: fac, device_id: dev,
      biometric_hash: bio ? 'abc123' : null,
      smartcard_present: sc,
      smartcard_signature: sc ? 'sig_' + Date.now() : null,
      request_time: Math.floor(Date.now()/1000)
    })
  }).then(r=>r.json()).then(d => {
    document.getElementById('auth-result').textContent = JSON.stringify(d, null, 2);
  });
}
function runAllTests() {
  document.getElementById('run-tests-btn').textContent = 'Running...';
  fetch('/api/test/all', {method:'POST'}).then(r=>r.json()).then(d => {
    document.getElementById('test-out').textContent = JSON.stringify(d, null, 2);
    document.getElementById('run-tests-btn').textContent = 'Run All Tests';
  }).catch(e => {
    document.getElementById('test-out').textContent = 'Error: ' + e;
    document.getElementById('run-tests-btn').textContent = 'Run All Tests';
  });
}
function update() {
  fetch('/api/status').then(r=>r.json()).then(d => {
    let threat_level = d.threat_level || 'green';
    document.getElementById('status').innerHTML = `
      <div class="card"><h3>Threat Level</h3><div class="value ${threat_level}">${threat_level.toUpperCase()}</div></div>
      <div class="card"><h3>Score</h3><div class="value ${d.score >= 80 ? 'red' : d.score >= 50 ? 'orange' : d.score >= 20 ? 'yellow' : 'green'}">${d.score||0}</div></div>
      <div class="card"><h3>Scenario</h3><div class="value">${d.scenario||'--'}</div></div>
      <div class="card"><h3>SIM Surge</h3><div class="value">${d.sim_count||0}</div></div>
      <div class="card"><h3>Fuel Surge</h3><div class="value">${(d.fuel_surge||0)+'%'}</div></div>
      <div class="card"><h3>Motion/Comms</h3><div class="value">${(d.motion_count||0)+' / '+(d.comms_count||0)}</div></div>
    `;
    let aDiv = document.getElementById('alerts');
    if (d.alerts && d.alerts.length) {
      let html = '<table><tr><th>Time</th><th>Level</th><th>Score</th><th>Actions</th></tr>';
      d.alerts.slice(-10).reverse().forEach(a => {
        html += '<tr><td>'+(a['@timestamp']||'').slice(11,19)+'</td>';
        html += '<td><span class="badge '+a.threat_level+'">'+a.threat_level.toUpperCase()+'</span></td>';
        html += '<td>'+a.score+'</td><td>'+(a.actions||[]).join(', ')+'</td></tr>';
      });
      html += '</table>';
      aDiv.innerHTML = html;
    } else { aDiv.innerHTML = '<span style="color:#6b7280;">No alerts</span>'; }

    let wDiv = document.getElementById('window');
    if (d.sensor_window) {
      let html = '<table><tr><th>Source</th><th>Count</th></tr>';
      for (const [k,v] of Object.entries(d.sensor_window)) {
        html += '<tr><td>'+k+'</td><td>'+(v.count||v)+'</td></tr>';
      }
      html += '</table>';
      wDiv.innerHTML = html;
    }
  });
  fetch('/api/dispatches').then(r=>r.json()).then(d => {
    let html = d.length ? '<table><tr><th>Time</th><th>Incident</th><th>Actions</th></tr>'+
      d.slice(-10).reverse().map(a => '<tr><td>'+(a.received_at||'').slice(11,19)+'</td><td>'+(a.payload?.incident_id||'')+'</td><td>'+(a.payload?.actions||[]).join(', ')+'</td></tr>').join('')+'</table>'
      : '<span style="color:#6b7280;">No dispatches</span>';
    document.getElementById('dispatches').innerHTML = html;
  });
}
update();
setInterval(update, 3000);
</script>
</body>
</html>"""

@app.route("/")
def dashboard():
    return render_template_string(DASHBOARD_HTML)

@app.route("/api/status")
def api_status():
    import requests as req
    s = {"scenario":"unknown","threat_level":"green","score":0,"sim_count":0,"fuel_surge":0,"motion_count":0,"comms_count":0,"alerts":[],"sensor_window":{}}
    try:
        r = req.get(f"{SENSOR_URL}/stats", timeout=3)
        if r.ok: s["scenario"] = r.json().get("scenario","unknown")
    except: pass
    try:
        r = req.get(f"{FUSION_URL}/threat", timeout=3)
        if r.ok: s.update(r.json())
    except: pass
    try:
        r = req.get(f"{FUSION_URL}/alerts", timeout=3)
        if r.ok: s["alerts"] = r.json()
    except: pass
    try:
        r = req.get(f"{FUSION_URL}/window", timeout=3)
        if r.ok: s["sensor_window"] = r.json()
    except: pass
    return jsonify(s)

@app.route("/api/scenario/<scenario>", methods=["POST"])
def set_scenario(scenario):
    import requests as req
    try:
        r = req.post(f"{SENSOR_URL}/scenario", json={"scenario":scenario}, timeout=5)
        return r.json()
    except Exception as e: return jsonify({"error":str(e)}),500

@app.route("/api/auth/test", methods=["POST"])
def test_auth():
    import requests as req
    try:
        r = req.post(f"{IDP_URL}/auth", json=request.get_json(), timeout=5)
        return r.json(), r.status_code
    except Exception as e: return jsonify({"error":str(e)}),500

@app.route("/api/selfwipe/<trigger>", methods=["POST"])
def test_selfwipe(trigger):
    import requests as req
    try:
        r = req.post(f"{SENSOR_URL}/simulate/selfwipe", json={"trigger":trigger}, timeout=5)
        return r.json()
    except Exception as e: return jsonify({"error":str(e)}),500

@app.route("/api/test/opa", methods=["POST"])
def test_opa():
    import requests as req
    results = {}
    tests = {
        "identity/authz/allow": {"input":{"auth_method":"biometric_smartcard","biometric_verified":True,"smartcard_present":True,"smartcard_signature_valid":True,
            "user":{"id":"CDR_OKONKWO","facilities":["HQ_ABUJA"],"shift_start":0,"shift_end":24,"enrolled_devices":["TABLET-A001"]},
            "facility_id":"HQ_ABUJA","request_time":36000,"device_id":"TABLET-A001"}},
        "device/selfwipe/trigger_wipe": {"input":{"tamper_sensor_triggered":True,"tamper_timestamp":1000,"last_heartbeat":985,
            "heartbeat_lost":False,"seconds_since_last_heartbeat":15,"gps_location_valid":True,"unauthorized_movement_detected":False,
            "consecutive_auth_failures":0,"remote_wipe_command":False,"remote_wipe_command_signed":False,"remote_wipe_authority":"",
            "device_status":"active","storage_overwritten":False,"crypto_keys_destroyed":False}},
        "fusion/threat_scoring/auto_actions": {"input":{"sim_cluster_count":8,"fuel_surge_percent":45,"camera_motion_alerts":12,"unusual_comms_volume":6,"human_commander_authorized":False}},
    }
    for path, inp in tests.items():
        try:
            r = req.post(f"{OPA_URL}/v1/data/{path}", json=inp, timeout=5)
            results[path] = {"status":r.status_code, "result":r.json().get("result",False)}
        except Exception as e: results[path] = {"error":str(e)}
    return jsonify(results)

@app.route("/api/test/e2e", methods=["POST"])
def test_e2e():
    import requests as req
    results = {}
    checks = [
        ("OPA health", lambda: req.get(f"{OPA_URL}/v1/health",timeout=5).ok),
        ("IdP health", lambda: req.get(f"{IDP_URL}/health",timeout=5).ok),
        ("Sensor health", lambda: req.get(f"{SENSOR_URL}/health",timeout=5).ok),
        ("Fusion health", lambda: req.get(f"{FUSION_URL}/health",timeout=5).ok),
        ("Auth: valid operator", lambda: req.post(f"{IDP_URL}/auth",json={"operator_id":"CDR_OKONKWO","biometric_hash":"abc","smartcard_present":True,"smartcard_signature":"sig","facility_id":"HQ_ABUJA","device_id":"TABLET-A001"},timeout=5).status_code==200),
        ("Auth: wrong device blocked", lambda: req.post(f"{IDP_URL}/auth",json={"operator_id":"CDR_OKONKWO","biometric_hash":"abc","smartcard_present":True,"smartcard_signature":"sig","facility_id":"HQ_ABUJA","device_id":"STOLEN_TABLET"},timeout=5).status_code==403),
        ("Auth: wrong facility blocked", lambda: req.post(f"{IDP_URL}/auth",json={"operator_id":"CDR_OKONKWO","biometric_hash":"abc","smartcard_present":True,"smartcard_signature":"sig","facility_id":"ENEMY_CAMP","device_id":"TABLET-A001"},timeout=5).status_code==403),
        ("Self-wipe trigger", lambda: req.post(f"{SENSOR_URL}/simulate/selfwipe",json={"trigger":"tamper_sensor"},timeout=5).json().get("selfwipe_triggered")==True),
        ("Self-wipe heartbeat loss", lambda: req.post(f"{SENSOR_URL}/simulate/selfwipe",json={"trigger":"heartbeat_loss"},timeout=5).json().get("selfwipe_triggered")==True),
        ("Self-wipe brute force", lambda: req.post(f"{SENSOR_URL}/simulate/selfwipe",json={"trigger":"brute_force"},timeout=5).json().get("selfwipe_triggered")==True),
    ]
    for name, check in checks:
        try: results[name] = "PASS" if check() else "FAIL"
        except Exception as e: results[name] = f"ERROR: {e}"
    return jsonify(results)

@app.route("/api/test/all", methods=["POST"])
def test_all():
    import requests as req
    results = {"timestamp":datetime.now(timezone.utc).isoformat(),"tests":{}}
    try:
        r = req.post("http://console.issf-sandbox.ng:9099/api/test/opa",timeout=15)
        results["tests"]["opa_policies"] = r.json()
    except Exception as e: results["tests"]["opa_policies"] = {"error":str(e)}
    try:
        r = req.post("http://console.issf-sandbox.ng:9099/api/test/e2e",timeout=15)
        results["tests"]["end_to_end"] = r.json()
    except Exception as e: results["tests"]["end_to_end"] = {"error":str(e)}
    return jsonify(results)

@app.route("/webhook/qrf", methods=["POST"])
def qrf_webhook():
    data = request.get_json()
    qrf_dispatches.append({"received_at":datetime.now(timezone.utc).isoformat(),"payload":data})
    if len(qrf_dispatches) > 100: qrf_dispatches.pop(0)
    return jsonify({"status":"acknowledged","incident_id":data.get("incident_id","unknown")})

@app.route("/api/dispatches")
def get_dispatches():
    return jsonify(qrf_dispatches[-20:])

@app.route("/api/health")
def health():
    return jsonify({"status":"ok","service":"console","dispatches":len(qrf_dispatches)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9099, debug=False)
