package network.segmentation

default allow_connection = false

enclaves := {
    "identity_idp": {"level": 0, "classification": "top_secret"},
    "intel_database": {"level": 0, "classification": "secret"},
    "tactical_comms": {"level": 1, "classification": "restricted"},
    "sensor_ingestion": {"level": 2, "classification": "restricted"},
    "fusion_center": {"level": 0, "classification": "top_secret"},
    "public_registry": {"level": 3, "classification": "unclassified"},
}

allow_connection {
    input.source_enclave == input.dest_enclave
}

allow_connection {
    enclaves[input.source_enclave].level <= enclaves[input.dest_enclave].level
    input.flow_direction == "outbound"
    input.authorization_token_valid == true
}

allow_connection {
    input.emergency_override == true
    input.dual_authorization == true
    input.incident_id != ""
}
