-- Simulation ERP: PostgreSQL schema
-- Migration 001: Initial tables for simulation instance management
-- All statements use IF [NOT] EXISTS for idempotent re-runs.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Active simulation instances (one row = one running engine per student)
CREATE TABLE IF NOT EXISTS sim_instances (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_definition_id TEXT NOT NULL,             -- Sanity _id of simLabDefinition
    owner_id          TEXT NOT NULL,              -- Sanity user _id
    status            TEXT NOT NULL DEFAULT 'starting'
                      CHECK (status IN ('starting', 'running', 'paused', 'stopped', 'error', 'expired')),
    engine_port       INT,                       -- ephemeral port the engine listens on
    tick              BIGINT NOT NULL DEFAULT 0,
    error_message     TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at        TIMESTAMPTZ NOT NULL,
    stopped_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sim_instances_owner ON sim_instances(owner_id);
CREATE INDEX IF NOT EXISTS idx_sim_instances_status ON sim_instances(status);
CREATE INDEX IF NOT EXISTS idx_sim_instances_expires ON sim_instances(expires_at) WHERE status IN ('starting', 'running', 'paused');

-- State snapshots (serialized device trees for pause/resume/rollback)
CREATE TABLE IF NOT EXISTS sim_snapshots (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES sim_instances(id) ON DELETE CASCADE,
    tick        BIGINT NOT NULL,
    device_tree JSONB NOT NULL,
    label       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sim_snapshots_instance ON sim_snapshots(instance_id, tick);

-- Student event log (immutable audit trail)
CREATE TABLE IF NOT EXISTS sim_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES sim_instances(id) ON DELETE CASCADE,
    tick        BIGINT NOT NULL DEFAULT 0,
    timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor       TEXT NOT NULL DEFAULT 'system',
    action      TEXT NOT NULL,
    target_type TEXT,
    target_id   TEXT,
    path        TEXT,
    old_value   JSONB,
    new_value   JSONB,
    accepted    BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_sim_events_instance ON sim_events(instance_id, tick);
CREATE INDEX IF NOT EXISTS idx_sim_events_action ON sim_events(instance_id, action);

-- API keys for external access (Ansible/Terraform from student's machine)
CREATE TABLE IF NOT EXISTS sim_api_keys (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES sim_instances(id) ON DELETE CASCADE,
    label       TEXT NOT NULL DEFAULT 'default',
    key_prefix  TEXT NOT NULL,                   -- first 8 chars of key for identification
    key_hash    TEXT NOT NULL,                    -- SHA-256 hash of full key
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ,
    revoked_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sim_api_keys_instance ON sim_api_keys(instance_id);
CREATE INDEX IF NOT EXISTS idx_sim_api_keys_prefix ON sim_api_keys(key_prefix);

-- Lab assignments (linking lab definitions to students)
CREATE TABLE IF NOT EXISTS sim_lab_assignments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_definition_id TEXT NOT NULL,              -- Sanity _id
    student_id        TEXT NOT NULL,               -- Sanity user _id
    status            TEXT NOT NULL DEFAULT 'not_started'
                      CHECK (status IN ('not_started', 'in_progress', 'completed', 'expired', 'failed')),
    grade             INT,
    grade_max         INT,
    started_at        TIMESTAMPTZ,
    completed_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sim_assignments_student ON sim_lab_assignments(student_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sim_assignments_unique ON sim_lab_assignments(lab_definition_id, student_id);
