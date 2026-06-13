package fusion.threat_scoring

test_green_threat_level_low_score {
    base_score == 0 with input as {
        "sim_cluster_count": 0,
        "fuel_surge_percent": 0,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
    threat_level == "green" with input as {
        "sim_cluster_count": 0,
        "fuel_surge_percent": 0,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
}

test_yellow_threat_level {
    threat_level == "yellow" with input as {
        "sim_cluster_count": 1,
        "fuel_surge_percent": 5,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
}

test_orange_threat_level {
    threat_level == "orange" with input as {
        "sim_cluster_count": 2,
        "fuel_surge_percent": 10,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 0
    }
}

test_red_threat_level {
    threat_level == "red" with input as {
        "sim_cluster_count": 4,
        "fuel_surge_percent": 15,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 3
    }
}

test_base_score_calculation {
    base_score == 63 with input as {
        "sim_cluster_count": 2,
        "fuel_surge_percent": 10,
        "camera_motion_alerts": 3,
        "unusual_comms_volume": 1
    }
}

test_auto_actions_green {
    auto_actions == ["log_observation"] with input as {
        "sim_cluster_count": 0,
        "fuel_surge_percent": 0,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
}

test_auto_actions_yellow {
    auto_actions == ["status_intelligence_vigilance", "log_observation"] with input as {
        "sim_cluster_count": 1,
        "fuel_surge_percent": 5,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
}

test_auto_actions_orange {
    auto_actions == ["alert_garrison_commander", "increase_sensor_polling",
                     "status_intelligence_vigilance"] with input as {
        "sim_cluster_count": 2,
        "fuel_surge_percent": 10,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 0
    }
}

test_auto_actions_red {
    auto_actions == ["dispatch_qrf", "launch_drone_sweep", "reroute_civilian_traffic",
                     "alert_garrison_commander", "activate_roadside_traps"] with input as {
        "sim_cluster_count": 4,
        "fuel_surge_percent": 15,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 3
    }
}

test_require_human_auth_for_red_actions {
    require_human_auth["dispatch_qrf"] with input as {
        "sim_cluster_count": 4,
        "fuel_surge_percent": 15,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 3,
        "human_commander_authorized": false
    }
}

test_human_auth_not_required_when_authorized {
    count(require_human_auth) == 0 with input as {
        "sim_cluster_count": 4,
        "fuel_surge_percent": 15,
        "camera_motion_alerts": 2,
        "unusual_comms_volume": 3,
        "human_commander_authorized": true
    }
}

test_human_auth_not_required_for_yellow {
    count(require_human_auth) == 0 with input as {
        "sim_cluster_count": 1,
        "fuel_surge_percent": 5,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0,
        "human_commander_authorized": false
    }
}

test_boundary_green_yellow {
    threat_level == "green" with input as {
        "sim_cluster_count": 0,
        "fuel_surge_percent": 0,
        "camera_motion_alerts": 3,
        "unusual_comms_volume": 0
    }
    threat_level == "yellow" with input as {
        "sim_cluster_count": 0,
        "fuel_surge_percent": 0,
        "camera_motion_alerts": 4,
        "unusual_comms_volume": 0
    }
}

test_boundary_orange_red {
    threat_level == "orange" with input as {
        "sim_cluster_count": 3,
        "fuel_surge_percent": 5,
        "camera_motion_alerts": 0,
        "unusual_comms_volume": 0
    }
    threat_level == "red" with input as {
        "sim_cluster_count": 3,
        "fuel_surge_percent": 5,
        "camera_motion_alerts": 1,
        "unusual_comms_volume": 0
    }
}
