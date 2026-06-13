"""
Simulation Engine Orchestrator

Manages the lifecycle of per-student simulation engine processes.
Phase 1: stub that registers instances in DB and tracks port allocation.
Phase 2+: spawns actual engine subprocesses, monitors health, enforces time limits.
"""

import os
import signal
import subprocess
from typing import Optional

PORT_RANGE_START = int(os.environ.get("PORT_RANGE", "9100-9200").split("-")[0])
PORT_RANGE_END = int(os.environ.get("PORT_RANGE", "9100-9200").split("-")[1])

# In-memory port tracker (use Redis in production)
_acquired_ports: set[int] = set()
_processes: dict[str, subprocess.Popen] = {}


def acquire_port() -> Optional[int]:
    """Find and reserve an available port in the configured range."""
    for port in range(PORT_RANGE_START, PORT_RANGE_END + 1):
        if port not in _acquired_ports:
            _acquired_ports.add(port)
            return port
    return None


def release_port(port: int):
    _acquired_ports.discard(port)


async def spawn_engine(
    instance_id: str,
    seed_topology: dict,
    auth_secret: str,
    db_url: str,
) -> Optional[int]:
    """
    Spawn a simulation engine subprocess.

    Returns the port the engine is listening on, or None on failure.
    """
    port = acquire_port()
    if port is None:
        return None

    cmd = [
        "python",
        "-m", "uvicorn",
        "app:app",
        "--host", "0.0.0.0",
        "--port", str(port),
    ]

    env = os.environ.copy()
    env.update({
        "PORT": str(port),
        "INSTANCE_ID": instance_id,
        "SEED_TOPOLOGY": str(seed_topology),
        "AUTH_SECRET": auth_secret,
        "DB_URL": db_url,
    })

    proc = subprocess.Popen(
        cmd,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    _processes[instance_id] = proc
    return port


async def kill_engine(instance_id: str):
    """Gracefully stop a simulation engine process."""
    proc = _processes.pop(instance_id, None)
    if proc:
        proc.send_signal(signal.SIGTERM)
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()


def get_active_count() -> int:
    return len(_processes)
