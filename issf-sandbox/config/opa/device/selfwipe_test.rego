package device.selfwipe

test_trigger_on_tamper_sensor {
    trigger_wipe with input as {
        "tamper_sensor_triggered": true,
        "tamper_timestamp": 1000,
        "last_heartbeat": 985
    }
}

test_no_trigger_tamper_but_stale_heartbeat {
    not trigger_wipe with input as {
        "tamper_sensor_triggered": true,
        "tamper_timestamp": 1000,
        "last_heartbeat": 900
    }
}

test_trigger_on_heartbeat_loss {
    trigger_wipe with input as {
        "heartbeat_lost": true,
        "seconds_since_last_heartbeat": 45
    }
}

test_no_trigger_heartbeat_within_threshold {
    not trigger_wipe with input as {
        "heartbeat_lost": true,
        "seconds_since_last_heartbeat": 25
    }
}

test_trigger_on_gps_mismatch {
    trigger_wipe with input as {
        "gps_location_valid": false,
        "unauthorized_movement_detected": true
    }
}

test_no_trigger_gps_mismatch_without_movement {
    not trigger_wipe with input as {
        "gps_location_valid": false,
        "unauthorized_movement_detected": false
    }
}

test_trigger_on_brute_force {
    trigger_wipe with input as {
        "consecutive_auth_failures": 4
    }
}

test_no_trigger_below_brute_force_threshold {
    not trigger_wipe with input as {
        "consecutive_auth_failures": 3
    }
}

test_trigger_on_remote_wipe_command {
    trigger_wipe with input as {
        "remote_wipe_command": true,
        "remote_wipe_command_signed": true,
        "remote_wipe_authority": "fusion_center"
    }
}

test_no_trigger_remote_wipe_unsigned {
    not trigger_wipe with input as {
        "remote_wipe_command": true,
        "remote_wipe_command_signed": false,
        "remote_wipe_authority": "fusion_center"
    }
}

test_no_trigger_remote_wipe_wrong_authority {
    not trigger_wipe with input as {
        "remote_wipe_command": true,
        "remote_wipe_command_signed": true,
        "remote_wipe_authority": "unauthorised_node"
    }
}

test_post_wipe_verification_passes {
    post_wipe_verification with input as {
        "device_status": "sanitized",
        "storage_overwritten": true,
        "crypto_keys_destroyed": true
    }
}

test_post_wipe_verification_fails_storage {
    not post_wipe_verification with input as {
        "device_status": "sanitized",
        "storage_overwritten": false,
        "crypto_keys_destroyed": true
    }
}

test_post_wipe_verification_fails_keys {
    not post_wipe_verification with input as {
        "device_status": "sanitized",
        "storage_overwritten": true,
        "crypto_keys_destroyed": false
    }
}
