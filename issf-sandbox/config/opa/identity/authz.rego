package identity.authz

default allow = false

allow {
    input.auth_method == "biometric_smartcard"
    input.biometric_verified == true
    input.smartcard_present == true
    input.smartcard_signature_valid == true
}

allow {
    input.auth_method == "biometric_smartcard"
    input.biometric_verified == true
    input.smartcard_present == true
    input.smartcard_signature_valid == true
    allowed_facility(input.facility_id)
    allowed_hour(input.request_time)
    allowed_device(input.device_id)
}

allowed_facility(facility) {
    input.user.facilities[_] == facility
}

allowed_hour(time) {
    hour := time / 3600 % 24
    hour >= input.user.shift_start
    hour < input.user.shift_end
}

allowed_device(device) {
    input.user.enrolled_devices[_] == device
}

deny["Access denied: unauthorized facility"] {
    not allowed_facility(input.facility_id)
}

deny["Access denied: outside shift hours"] {
    not allowed_hour(input.request_time)
}

deny["Access denied: unenrolled device"] {
    not allowed_device(input.device_id)
}
