package device.selfwipe

default trigger_wipe = false

trigger_wipe {
    input.tamper_sensor_triggered == true
    input.tamper_timestamp - input.last_heartbeat < 30
}

trigger_wipe {
    input.heartbeat_lost == true
    input.seconds_since_last_heartbeat > 30
}

trigger_wipe {
    input.gps_location_valid == false
    input.unauthorized_movement_detected == true
}

trigger_wipe {
    input.consecutive_auth_failures > 3
}

trigger_wipe {
    input.remote_wipe_command == true
    input.remote_wipe_command_signed == true
    input.remote_wipe_authority == "fusion_center"
}

post_wipe_verification {
    input.device_status == "sanitized"
    input.storage_overwritten == true
    input.crypto_keys_destroyed == true
}
