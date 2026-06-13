package identity.authz

test_allowed_valid_biometric_and_smartcard {
    allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true
    }
}

test_denied_missing_biometric {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": false,
        "smartcard_present": true,
        "smartcard_signature_valid": true
    }
}

test_denied_missing_smartcard {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": false,
        "smartcard_signature_valid": false
    }
}

test_denied_invalid_signature {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": false
    }
}

test_denied_wrong_facility {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_black_diamond",
        "request_time": 36000,
        "device_id": "device_alpha",
        "user": {
            "facilities": ["facility_maiduguri", "facility_abuja_hq"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha", "device_bravo"]
        }
    }
}

test_denied_outside_shift_hours {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_maiduguri",
        "request_time": 72000,
        "device_id": "device_alpha",
        "user": {
            "facilities": ["facility_maiduguri", "facility_abuja_hq"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha", "device_bravo"]
        }
    }
}

test_denied_unenrolled_device {
    not allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_maiduguri",
        "request_time": 36000,
        "device_id": "device_rogue",
        "user": {
            "facilities": ["facility_maiduguri", "facility_abuja_hq"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha", "device_bravo"]
        }
    }
}

test_allowed_with_full_context {
    allow with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_abuja_hq",
        "request_time": 43200,
        "device_id": "device_bravo",
        "user": {
            "facilities": ["facility_maiduguri", "facility_abuja_hq"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha", "device_bravo"]
        }
    }
}

test_deny_message_unauthorized_facility {
    deny["Access denied: unauthorized facility"] with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_unknown",
        "request_time": 36000,
        "device_id": "device_alpha",
        "user": {
            "facilities": ["facility_maiduguri"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha"]
        }
    }
}

test_deny_message_outside_shift_hours {
    deny["Access denied: outside shift hours"] with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_maiduguri",
        "request_time": 72000,
        "device_id": "device_alpha",
        "user": {
            "facilities": ["facility_maiduguri"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha"]
        }
    }
}

test_deny_message_unenrolled_device {
    deny["Access denied: unenrolled device"] with input as {
        "auth_method": "biometric_smartcard",
        "biometric_verified": true,
        "smartcard_present": true,
        "smartcard_signature_valid": true,
        "facility_id": "facility_maiduguri",
        "request_time": 36000,
        "device_id": "device_rogue",
        "user": {
            "facilities": ["facility_maiduguri"],
            "shift_start": 6,
            "shift_end": 18,
            "enrolled_devices": ["device_alpha"]
        }
    }
}
