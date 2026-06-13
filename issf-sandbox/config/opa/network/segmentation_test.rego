package network.segmentation

test_same_enclave_traffic_allowed {
    allow_connection with input as {
        "source_enclave": "identity_idp",
        "dest_enclave": "identity_idp"
    }
}

test_cross_enclave_allowed_outbound_higher_level {
    allow_connection with input as {
        "source_enclave": "public_registry",
        "dest_enclave": "sensor_ingestion",
        "flow_direction": "outbound",
        "authorization_token_valid": true
    }
}

test_cross_enclave_denied_inbound_lower_level {
    not allow_connection with input as {
        "source_enclave": "sensor_ingestion",
        "dest_enclave": "identity_idp",
        "flow_direction": "inbound",
        "authorization_token_valid": true
    }
}

test_cross_enclave_denied_without_token {
    not allow_connection with input as {
        "source_enclave": "public_registry",
        "dest_enclave": "sensor_ingestion",
        "flow_direction": "outbound",
        "authorization_token_valid": false
    }
}

test_emergency_override_allowed {
    allow_connection with input as {
        "emergency_override": true,
        "dual_authorization": true,
        "incident_id": "INC-2026-0042"
    }
}

test_emergency_override_denied_without_dual_auth {
    not allow_connection with input as {
        "emergency_override": true,
        "dual_authorization": false,
        "incident_id": "INC-2026-0042"
    }
}

test_emergency_override_denied_without_incident_id {
    not allow_connection with input as {
        "emergency_override": true,
        "dual_authorization": true,
        "incident_id": ""
    }
}

test_higher_enclave_to_lower_denied {
    not allow_connection with input as {
        "source_enclave": "sensor_ingestion",
        "dest_enclave": "public_registry",
        "flow_direction": "outbound",
        "authorization_token_valid": true
    }
}

test_identity_idp_to_fusion_allowed_same_level {
    allow_connection with input as {
        "source_enclave": "identity_idp",
        "dest_enclave": "fusion_center",
        "flow_direction": "outbound",
        "authorization_token_valid": true
    }
}

test_public_registry_to_identity_idp_denied_outbound_but_level_mismatch {
    not allow_connection with input as {
        "source_enclave": "public_registry",
        "dest_enclave": "identity_idp",
        "flow_direction": "outbound",
        "authorization_token_valid": true
    }
}

test_tactical_comms_to_intel_database_allowed_outbound_exact_level {
    allow_connection with input as {
        "source_enclave": "tactical_comms",
        "dest_enclave": "intel_database",
        "flow_direction": "outbound",
        "authorization_token_valid": true
    }
}
