package fusion.threat_scoring

threat_levels := {"green": 0, "yellow": 1, "orange": 2, "red": 3}

base_score = score {
    score := input.sim_cluster_count * 10 +
             input.fuel_surge_percent * 2 +
             input.camera_motion_alerts * 5 +
             input.unusual_comms_volume * 3
}

threat_level := "red" { base_score >= 80 }
threat_level := "orange" { base_score >= 50 }
threat_level := "yellow" { base_score >= 20 }
threat_level := "green" { base_score < 20 }

auto_actions := actions {
    threat_level == "red"
    actions := ["dispatch_qrf", "launch_drone_sweep", "reroute_civilian_traffic",
                "alert_garrison_commander", "activate_roadside_traps"]
}

auto_actions := actions {
    threat_level == "orange"
    actions := ["alert_garrison_commander", "increase_sensor_polling",
                "status_intelligence_vigilance"]
}

auto_actions := actions {
    threat_level == "yellow"
    actions := ["status_intelligence_vigilance", "log_observation"]
}

auto_actions := ["log_observation"] {
    threat_level == "green"
}

require_human_auth[action] {
    action := auto_actions[_]
    threat_level == "red"
    not input.human_commander_authorized == true
}
