"""
Simulation ERP — FastAPI Application Entrypoint
Phase 3: Orchestrator management API + health endpoint + WebSocket streaming.
"""

import asyncio
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Optional

import asyncpg
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

app = FastAPI(title="Simulation ERP Engine", version="0.1.0")

DB_URL = os.environ.get("DB_URL", "postgresql://simerp:simerp@localhost:5432/sim_erp")
AUTH_SECRET = os.environ.get("AUTH_SECRET", "dev-secret-change-in-production")

db_pool: Optional[asyncpg.Pool] = None


# ── Models ────────────────────────────────────────────────────────────────

class InstanceCreate(BaseModel):
    lab_definition_id: str
    owner_id: str


class InstanceResponse(BaseModel):
    id: str
    lab_definition_id: str
    owner_id: str
    status: str
    engine_port: Optional[int] = None
    tick: int = 0
    created_at: str
    expires_at: str


class SnapshotCreate(BaseModel):
    label: Optional[str] = None
    device_tree: dict


class ApiKeyCreate(BaseModel):
    label: str = "default"


class ApiKeyResponse(BaseModel):
    id: str
    key: str  # full key returned only on creation
    label: str


class GradeSubmission(BaseModel):
    lab_definition_id: str
    earned_points: int
    total_points: int
    passed_checks: int
    total_checks: int
    details: dict


# ── Lifespan ──────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    global db_pool
    db_pool = await asyncpg.create_pool(DB_URL, min_size=2, max_size=10)
    # Run migrations
    async with db_pool.acquire() as conn:
        await conn.execute(open("migrations/001_initial.sql").read())


@app.on_event("shutdown")
async def shutdown():
    if db_pool:
        await db_pool.close()


# ── Health ─────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "simulation-engine",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── Instance CRUD ─────────────────────────────────────────────────────────

@app.post("/api/v1/instances", response_model=InstanceResponse)
async def create_instance(body: InstanceCreate):
    """Register a new simulation instance (engine process not yet spawned)."""
    instance_id = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc).replace(
        hour=23, minute=59, second=59, microsecond=0
    )

    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO sim_instances (id, lab_definition_id, owner_id, status, expires_at)
            VALUES ($1, $2, $3, 'starting', $4)
            RETURNING id, lab_definition_id, owner_id, status, engine_port, tick, created_at, expires_at
            """,
            instance_id,
            body.lab_definition_id,
            body.owner_id,
            expires_at,
        )

    return _row_to_instance(row)


@app.get("/api/v1/instances", response_model=list[InstanceResponse])
async def list_instances(owner_id: Optional[str] = None, status: Optional[str] = None):
    """List instances, optionally filtered by owner or status."""
    async with db_pool.acquire() as conn:
        if owner_id and status:
            rows = await conn.fetch(
                "SELECT * FROM sim_instances WHERE owner_id = $1 AND status = $2 ORDER BY created_at DESC",
                owner_id, status,
            )
        elif owner_id:
            rows = await conn.fetch(
                "SELECT * FROM sim_instances WHERE owner_id = $1 ORDER BY created_at DESC",
                owner_id,
            )
        else:
            rows = await conn.fetch(
                "SELECT * FROM sim_instances ORDER BY created_at DESC LIMIT 100"
            )

    return [_row_to_instance(r) for r in rows]


@app.get("/api/v1/instances/{instance_id}", response_model=InstanceResponse)
async def get_instance(instance_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM sim_instances WHERE id = $1", instance_id
        )
    if not row:
        raise HTTPException(status_code=404, detail="Instance not found")
    return _row_to_instance(row)


@app.get("/api/v1/instances/{instance_id}/state")
async def get_instance_state(instance_id: str):
    """Return the current device state for an instance (from tick data or mock)."""
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT tick FROM sim_instances WHERE id = $1", instance_id
        )
    if not row:
        raise HTTPException(status_code=404, detail="Instance not found")

    devices = _generate_mock_devices(instance_id, row["tick"])
    return {
        "instance_id": instance_id,
        "tick": row["tick"],
        "devices": devices,
    }


@app.delete("/api/v1/instances/{instance_id}")
async def delete_instance(instance_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE sim_instances SET status = 'stopped', stopped_at = now() WHERE id = $1",
            instance_id,
        )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Instance not found")
    return {"status": "stopped"}


# ── Start / Stop (lifecycle management) ──────────────────────────────────

@app.post("/api/v1/instances/{instance_id}/start")
async def start_instance(instance_id: str):
    """Transition instance from 'starting' to 'running'. In Phase 2 this will spawn the engine."""
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT status FROM sim_instances WHERE id = $1", instance_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Instance not found")
        if row["status"] == "running":
            raise HTTPException(status_code=409, detail="Already running")

        await conn.execute(
            "UPDATE sim_instances SET status = 'running', last_activity_at = now() WHERE id = $1",
            instance_id,
        )
    return {"status": "running"}


@app.post("/api/v1/instances/{instance_id}/stop")
async def stop_instance(instance_id: str):
    """Transition instance to 'stopped'."""
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT status FROM sim_instances WHERE id = $1", instance_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Instance not found")
        if row["status"] == "stopped":
            raise HTTPException(status_code=409, detail="Already stopped")

        await conn.execute(
            "UPDATE sim_instances SET status = 'stopped', stopped_at = now() WHERE id = $1",
            instance_id,
        )
    return {"status": "stopped"}


# ── Assignments (student progress) ───────────────────────────────────────

@app.get("/api/v1/assignments")
async def list_assignments(
    student_id: Optional[str] = None,
    lab_definition_id: Optional[str] = None,
    status: Optional[str] = None,
):
    """List lab assignments, optionally filtered."""
    async with db_pool.acquire() as conn:
        conditions = []
        params = []
        idx = 1
        if student_id:
            conditions.append(f"student_id = ${idx}")
            params.append(student_id)
            idx += 1
        if lab_definition_id:
            conditions.append(f"lab_definition_id = ${idx}")
            params.append(lab_definition_id)
            idx += 1
        if status:
            conditions.append(f"status = ${idx}")
            params.append(status)
            idx += 1
        where = " WHERE " + " AND ".join(conditions) if conditions else ""
        rows = await conn.fetch(
            f"SELECT * FROM sim_lab_assignments{where} ORDER BY created_at DESC",
            *params,
        )
    return [dict(r) for r in rows]


@app.get("/api/v1/assignments/{assignment_id}")
async def get_assignment(assignment_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM sim_lab_assignments WHERE id = $1", assignment_id
        )
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return dict(row)


# ── Snapshots ─────────────────────────────────────────────────────────────

@app.post("/api/v1/instances/{instance_id}/snapshots")
async def create_snapshot(instance_id: str, body: SnapshotCreate):
    async with db_pool.acquire() as conn:
        # Get current tick
        instance = await conn.fetchrow(
            "SELECT id, tick FROM sim_instances WHERE id = $1", instance_id
        )
        if not instance:
            raise HTTPException(status_code=404, detail="Instance not found")

        snapshot_id = str(uuid.uuid4())
        await conn.execute(
            """
            INSERT INTO sim_snapshots (id, instance_id, tick, device_tree, label)
            VALUES ($1, $2, $3, $4, $5)
            """,
            snapshot_id,
            instance_id,
            instance["tick"],
            body.device_tree,
            body.label,
        )

    return {"id": snapshot_id, "tick": instance["tick"]}


@app.get("/api/v1/instances/{instance_id}/snapshots")
async def list_snapshots(instance_id: str):
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, tick, label, created_at FROM sim_snapshots WHERE instance_id = $1 ORDER BY tick DESC",
            instance_id,
        )
    return [dict(r) for r in rows]


@app.delete("/api/v1/instances/{instance_id}/snapshots/{snapshot_id}")
async def delete_snapshot(instance_id: str, snapshot_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM sim_snapshots WHERE id = $1 AND instance_id = $2",
            snapshot_id, instance_id,
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return {"status": "deleted"}


# ── API Keys ──────────────────────────────────────────────────────────────

@app.post("/api/v1/instances/{instance_id}/keys", response_model=ApiKeyResponse)
async def create_api_key(instance_id: str, body: ApiKeyCreate):
    import hashlib
    import secrets

    raw_key = f"sim_{secrets.token_hex(24)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:12]

    key_id = str(uuid.uuid4())
    async with db_pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO sim_api_keys (id, instance_id, label, key_prefix, key_hash)
            VALUES ($1, $2, $3, $4, $5)
            """,
            key_id,
            instance_id,
            body.label,
            key_prefix,
            key_hash,
        )

    return ApiKeyResponse(id=key_id, key=raw_key, label=body.label)


@app.get("/api/v1/instances/{instance_id}/keys")
async def list_api_keys(instance_id: str):
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, label, key_prefix, created_at, last_used_at FROM sim_api_keys WHERE instance_id = $1 AND revoked_at IS NULL",
            instance_id,
        )
    return [dict(r) for r in rows]


@app.delete("/api/v1/instances/{instance_id}/keys/{key_id}")
async def revoke_api_key(instance_id: str, key_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE sim_api_keys SET revoked_at = now() WHERE id = $1 AND instance_id = $2",
            key_id, instance_id,
        )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Key not found")
    return {"status": "revoked"}


# ── Events ────────────────────────────────────────────────────────────────

@app.get("/api/v1/instances/{instance_id}/events")
async def list_events(
    instance_id: str,
    from_tick: int = 0,
    to_tick: Optional[int] = None,
    limit: int = 100,
):
    async with db_pool.acquire() as conn:
        if to_tick:
            rows = await conn.fetch(
                "SELECT * FROM sim_events WHERE instance_id = $1 AND tick >= $2 AND tick <= $3 ORDER BY tick ASC LIMIT $4",
                instance_id, from_tick, to_tick, limit,
            )
        else:
            rows = await conn.fetch(
                "SELECT * FROM sim_events WHERE instance_id = $1 AND tick >= $2 ORDER BY tick ASC LIMIT $3",
                instance_id, from_tick, limit,
            )
    return [dict(r) for r in rows]


# ── Grading ───────────────────────────────────────────────────────────────

class GradeResponse(BaseModel):
    grade_id: str
    instance_id: str
    earned_points: int
    total_points: int
    passed_checks: int
    total_checks: int


@app.post("/api/v1/instances/{instance_id}/grade", response_model=GradeResponse)
async def submit_grade(instance_id: str, body: GradeSubmission):
    """Store a grading result for an instance."""
    grade_id = str(uuid.uuid4())
    async with db_pool.acquire() as conn:
        # Check instance exists
        instance = await conn.fetchrow(
            "SELECT id, owner_id, lab_definition_id FROM sim_instances WHERE id = $1",
            instance_id,
        )
        if not instance:
            raise HTTPException(status_code=404, detail="Instance not found")

        # Upsert into lab_assignments
        await conn.execute(
            """
            INSERT INTO sim_lab_assignments (lab_definition_id, student_id, status, grade, grade_max, completed_at)
            VALUES ($1, $2, 'completed', $3, $4, now())
            ON CONFLICT (lab_definition_id, student_id)
            DO UPDATE SET grade = $3, grade_max = $4, status = 'completed', completed_at = now()
            """,
            body.lab_definition_id,
            instance["owner_id"],
            body.earned_points,
            body.total_points,
        )

        # Log grading event
        await conn.execute(
            """
            INSERT INTO sim_events (instance_id, tick, actor, action, target_type, target_id, new_value)
            VALUES ($1, 0, 'system', 'grading.submit', 'instance', $1, $2::jsonb)
            """,
            instance_id,
            json.dumps(body.details),
        )

    return GradeResponse(
        grade_id=grade_id,
        instance_id=instance_id,
        earned_points=body.earned_points,
        total_points=body.total_points,
        passed_checks=body.passed_checks,
        total_checks=body.total_checks,
    )


@app.get("/api/v1/instances/{instance_id}/grade")
async def get_grade(instance_id: str):
    """Retrieve the current grade for an instance's lab assignment."""
    async with db_pool.acquire() as conn:
        # Find the owner via instance, then get assignment
        instance = await conn.fetchrow(
            "SELECT owner_id, lab_definition_id FROM sim_instances WHERE id = $1",
            instance_id,
        )
        if not instance:
            raise HTTPException(status_code=404, detail="Instance not found")

        row = await conn.fetchrow(
            """
            SELECT grade, grade_max, status, completed_at
            FROM sim_lab_assignments
            WHERE lab_definition_id = $1 AND student_id = $2
            """,
            instance["lab_definition_id"],
            instance["owner_id"],
        )

    if not row or row["grade"] is None:
        return {"graded": False, "grade": None, "grade_max": None}

    return {
        "graded": True,
        "grade": row["grade"],
        "grade_max": row["grade_max"],
        "status": row["status"],
        "completed_at": row["completed_at"].isoformat() if row["completed_at"] else None,
    }


# ── WebSocket — instance state stream ────────────────────────────────────

CONNECTED_WS: dict[str, set[WebSocket]] = {}


@app.websocket("/ws/instance/{instance_id}")
async def instance_state_stream(websocket: WebSocket, instance_id: str):
    """
    Real-time device state streaming for a simulation instance.

    The server pushes JSON state deltas on each tick. The client may
    send control messages (e.g. {"action":"pause","action":"resume"}).
    """
    await websocket.accept()

    if instance_id not in CONNECTED_WS:
        CONNECTED_WS[instance_id] = set()
    CONNECTED_WS[instance_id].add(websocket)

    # Verify instance exists
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT status, tick FROM sim_instances WHERE id = $1", instance_id
        )
    if not row:
        await websocket.send_json({"type": "error", "detail": "Instance not found"})
        await websocket.close(1008)
        CONNECTED_WS[instance_id].discard(websocket)
        return

    # Send initial state snapshot
    await websocket.send_json({
        "type": "state_snapshot",
        "instance_id": instance_id,
        "status": row["status"],
        "tick": row["tick"],
        "devices": _generate_mock_devices(instance_id, row["tick"]),
    })

    streaming = True
    tick_interval = 1.0  # seconds between simulated ticks

    try:
        while streaming:
            try:
                msg = await asyncio.wait_for(
                    websocket.receive_json(), timeout=tick_interval
                )
                action = msg.get("action")
                if action == "pause":
                    streaming = False
                elif action == "resume":
                    streaming = True
                elif action == "set_interval":
                    tick_interval = max(0.1, float(msg.get("interval", 1.0)))
            except asyncio.TimeoutError:
                # No message — push a tick update if streaming
                if streaming and row["status"] == "running":
                    async with db_pool.acquire() as conn:
                        await conn.execute(
                            "UPDATE sim_instances SET tick = tick + 1 WHERE id = $1",
                            instance_id,
                        )
                        tick_row = await conn.fetchrow(
                            "SELECT tick FROM sim_instances WHERE id = $1",
                            instance_id,
                        )
                    tick = tick_row["tick"] if tick_row else row["tick"]
                    devices = _generate_mock_devices(instance_id, tick)
                    await websocket.send_json({
                        "type": "tick_update",
                        "instance_id": instance_id,
                        "tick": tick,
                        "devices": devices,
                    })
    except WebSocketDisconnect:
        pass
    finally:
        CONNECTED_WS[instance_id].discard(websocket)
        if not CONNECTED_WS[instance_id]:
            del CONNECTED_WS[instance_id]


# ── WebSocket — device console ────────────────────────────────────────────


@app.websocket("/ws/instance/{instance_id}/console/{device_id}")
async def device_console(websocket: WebSocket, instance_id: str, device_id: str):
    """
    Bidirectional serial/SSH console for a simulated device.

    Text received from the browser is echoed back with simulated
    device responses. In Phase 4+ this will pipe to a real SSH
    session or serial port inside the engine process.
    """
    await websocket.accept()

    # Verify instance
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT status FROM sim_instances WHERE id = $1", instance_id
        )
    if not row or row["status"] != "running":
        await websocket.send_text("Error: Instance not found or not running\r\n")
        await websocket.close(1008)
        return

    # Send banner
    await websocket.send_text(
        f"Connected to {device_id} (simulated)\r\n"
        f"Type 'help' for commands or 'exit' to disconnect.\r\n"
        f"{device_id}$ "
    )

    try:
        buffer = ""
        while True:
            data = await websocket.receive_text()
            buffer += data

            # Simple line-buffered echo with simulated responses
            if "\n" in data or "\r" in data:
                line = buffer.strip()
                buffer = ""
                response = _simulate_console_response(device_id, line)
                await websocket.send_text(f"{response}\r\n{device_id}$ ")
            else:
                # Echo typed characters
                await websocket.send_text(data)
    except WebSocketDisconnect:
        pass


def _simulate_console_response(device_id: str, command: str) -> str:
    """Generate a mock console response for a given command."""
    cmd = command.strip().lower()
    if cmd == "help":
        return (
            "Available commands:\r\n"
            "  show version       Device version info\r\n"
            "  show ip int brief  Interface summary\r\n"
            "  show inventory     Hardware inventory\r\n"
            "  configure terminal Enter config mode (stub)\r\n"
            "  exit               Disconnect"
        )
    elif cmd == "show version":
        return (
            "Cisco IOS Software, Linux Software (I86BI_LINUX-ADVENTERPRISEK9-M), "
            "Version 15.9(3)M\n"
            f"Device: {device_id}\n"
            "Uptime: 3 hours, 12 minutes"
        )
    elif cmd == "show ip int brief":
        return (
            "Interface              IP-Address      OK? Method Status  Protocol\n"
            "GigabitEthernet0/0     10.0.0.1        YES NVRAM  up      up\n"
            "GigabitEthernet0/1     unassigned      YES NVRAM  down   down\n"
            "GigabitEthernet0/2     10.255.0.1      YES NVRAM  up      up\n"
            "Loopback0              1.1.1.1         YES NVRAM  up      up"
        )
    elif cmd == "show inventory":
        return (
            "NAME: chassis, DESCR: CSR1000v Chassis\n"
            "PID: CSR1000V          , VID: V05, SN: 9WZGS5VM2S8\n"
            "\n"
            "NAME: module R0, DESCR: CSR1000v Route Processor\n"
            "PID: CSR1000V          , VID: V05, SN: JAF240411G4"
        )
    elif cmd == "configure terminal":
        return "Enter configuration commands, one per line. End with CNTL/Z.\n(config)#"
    elif cmd in ("exit", "quit"):
        return "Connection closed by foreign host."
    else:
        return f"Unknown command: {command}"


def _generate_mock_devices(instance_id: str, tick: int) -> list[dict]:
    """Generate mock device tree for Phase 3 demonstration.

    In Phase 4+ this reads from the engine process's actual device state.
    """
    import random
    rng = random.Random(f"{instance_id}-{tick // 5}")
    statuses = ["on", "on", "on", "on", "on", "on", "on", "on", "booting", "failure"]
    ports = [
        {"id": "p-001", "label": "Gi0/1 — 10.0.0.1/24", "type": "port", "status": "up", "rx_bytes": rng.randint(1e6, 5e8), "tx_bytes": rng.randint(5e5, 2e8)},
        {"id": "p-002", "label": "Gi0/2 — admin down", "type": "port", "status": "down", "rx_bytes": 0, "tx_bytes": 0},
        {"id": "p-003", "label": "Te0/1 — 10.255.0.1/30", "type": "port", "status": "up" if tick % 10 != 0 else "down", "rx_bytes": rng.randint(1e7, 1e9), "tx_bytes": rng.randint(5e6, 5e8)},
    ]
    return [
        {
            "id": "d-001",
            "label": "edge-router-01",
            "type": "router",
            "status": "on",
            "cpu_pct": round(rng.uniform(10, 85), 1),
            "mem_pct": round(rng.uniform(30, 70), 1),
            "uptime_ticks": tick,
            "children": ports,
        },
        {
            "id": "d-002",
            "label": "leaf-01",
            "type": "switch",
            "status": rng.choice(statuses[:8]),
            "cpu_pct": round(rng.uniform(5, 45), 1),
            "mem_pct": round(rng.uniform(20, 60), 1),
            "uptime_ticks": tick,
            "children": [
                {"id": "p-010", "label": "Eth1/1 — 100G", "type": "port", "status": "up", "rx_bytes": rng.randint(1e8, 1e10), "tx_bytes": rng.randint(5e7, 5e9)},
            ],
        },
        {
            "id": "d-003",
            "label": "fw-01",
            "type": "firewall",
            "status": "on",
            "cpu_pct": round(rng.uniform(20, 60), 1),
            "mem_pct": round(rng.uniform(40, 80), 1),
            "uptime_ticks": tick,
            "children": [
                {"id": "p-020", "label": "Eth0 — WAN", "type": "port", "status": "up", "rx_bytes": rng.randint(1e8, 2e9), "tx_bytes": rng.randint(5e7, 8e8)},
                {"id": "p-021", "label": "Eth1 — LAN", "type": "port", "status": "up", "rx_bytes": rng.randint(5e7, 1e9), "tx_bytes": rng.randint(1e8, 3e9)},
            ],
        },
        {
            "id": "t-001",
            "label": "gNB-01 (310-410)",
            "type": "gnb",
            "status": "on",
            "cpu_pct": round(rng.uniform(30, 70), 1),
            "mem_pct": round(rng.uniform(40, 65), 1),
            "uptime_ticks": tick,
        },
        {
            "id": "w-001",
            "label": "dev-station-01",
            "type": "workstation",
            "status": rng.choice(statuses[:9]),
            "cpu_pct": round(rng.uniform(5, 95), 1),
            "mem_pct": round(rng.uniform(25, 85), 1),
            "uptime_ticks": tick,
        },
    ]


# ── Helpers ───────────────────────────────────────────────────────────────

def _row_to_instance(row):
    return InstanceResponse(
        id=str(row["id"]),
        lab_definition_id=row["lab_definition_id"],
        owner_id=row["owner_id"],
        status=row["status"],
        engine_port=row["engine_port"],
        tick=row["tick"],
        created_at=row["created_at"].isoformat(),
        expires_at=row["expires_at"].isoformat(),
    )


# ── Entrypoint ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "9000"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
