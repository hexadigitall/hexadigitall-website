#!/usr/bin/env bash
# ============================================================================
# ISSF Sandbox — Interactive Launch & Control Script
# ============================================================================
set -euo pipefail

SANDBOX_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="${SANDBOX_DIR}/docker-compose.yml"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"; }
info() { echo -e "${CYAN}[INFO]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERROR]${NC} $*"; }
header() {
    echo ""
    echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${BOLD}  $*${NC}"
    echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

prompt_confirm() {
    echo -ne "${BOLD}$* [Y/n]: ${NC}"
    read -r resp
    [[ -z "${resp}" || "${resp}" =~ ^[Yy] ]]
}

check_deps() {
    local missing=0
    for cmd in docker docker-compose curl; do
        if ! command -v "${cmd}" &>/dev/null; then
            err "${cmd} is required but not installed."
            missing=1
        fi
    done
    if [[ "${missing}" -eq 1 ]]; then
        echo ""
        echo "Install Docker: https://docs.docker.com/engine/install/ubuntu/"
        exit 1
    fi
    log "All dependencies satisfied."
}

show_banner() {
    clear
    echo ""
    echo -e "${RED}${BOLD}"
    echo '  ╔══════════════════════════════════════════════════════╗'
    echo '  ║                                                      ║'
    echo '  ║   ISSF Sandbox — Test Environment                   ║'
    echo '  ║   Hexadigitall Sovereign Counter-Terrorism Engine   ║'
    echo '  ║                                                      ║'
    echo '  ╚══════════════════════════════════════════════════════╝'
    echo -e "${NC}"
    echo -e "  ${YELLOW}Services:${NC}"
    echo "    OPA Policy Engine        :8181"
    echo "    Mock Identity Provider   :8443"
    echo "    Elasticsearch            :9200"
    echo "    Kibana                   :5601"
    echo "    Kafka                    :9092"
    echo "    Sensor Gateway           :8081"
    echo "    Fusion Engine            :9090"
    echo "    Console Dashboard        :9099"
    echo ""
}

health_check() {
    local svc="$1" url="$2" desc="$3"
    echo -ne "  ${desc}... "
    if curl -sf "${url}" &>/dev/null; then
        echo -e "${GREEN}UP${NC}"
        return 0
    else
        echo -e "${RED}DOWN${NC}"
        return 1
    fi
}

cmd_start() {
    header "STARTING ISSF SANDBOX"
    export SCENARIO="${SCENARIO:-peaceful}"
    log "Scenario: ${SCENARIO}"
    log "Building images and starting containers..."
    cd "${SANDBOX_DIR}"
    docker compose -f "${COMPOSE_FILE}" up --build -d 2>&1
    log "Waiting for services to become healthy..."
    echo ""

    local all_healthy=true
    sleep 5

    for i in $(seq 1 30); do
        local opa_ok=false es_ok=false idp_ok=false
        local sensor_ok=false fusion_ok=false console_ok=false kafka_ok=false

        curl -sf http://localhost:8181/v1/health &>/dev/null && opa_ok=true
        curl -sf http://localhost:9200/_cluster/health &>/dev/null && es_ok=true
        curl -sf http://localhost:8443/health &>/dev/null && idp_ok=true
        curl -sf http://localhost:8081/health &>/dev/null && sensor_ok=true
        curl -sf http://localhost:9090/health &>/dev/null && fusion_ok=true
        curl -sf http://localhost:9099/health &>/dev/null && console_ok=true
        curl -sf http://localhost:9092 &>/dev/null && kafka_ok=true

        echo -ne "\r  Waiting for services... [OPA:${opa_ok} ES:${es_ok} Kafka:${kafka_ok} IdP:${idp_ok} Sensor:${sensor_ok} Fusion:${fusion_ok} Console:${console_ok}]    "

        if ${opa_ok} && ${es_ok} && ${idp_ok} && ${fusion_ok} && ${console_ok}; then
            echo ""
            log "All services healthy!"
            break
        fi
        sleep 3
    done

    echo ""
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  SANDBOX IS RUNNING                     ${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BOLD}Console Dashboard:${NC}  http://localhost:9099"
    echo -e "  ${BOLD}Kibana:${NC}             http://localhost:5601"
    echo -e "  ${BOLD}OPA API:${NC}            http://localhost:8181/v1/policies"
    echo -e "  ${BOLD}IdP API:${NC}            http://localhost:8443/auth"
    echo -e "  ${BOLD}Fusion API:${NC}         http://localhost:9090/threat"
    echo ""
    echo -e "  ${YELLOW}Run test scenarios from the dashboard or use:${NC}"
    echo -e "  ./sandbox.sh scenario attack_prep"
    echo -e "  ./sandbox.sh test"
    echo ""
}

cmd_stop() {
    header "STOPPING ISSF SANDBOX"
    cd "${SANDBOX_DIR}"
    docker compose -f "${COMPOSE_FILE}" down 2>&1
    log "Sandbox stopped."
}

cmd_restart() {
    cmd_stop
    sleep 2
    cmd_start
}

cmd_status() {
    header "SANDBOX STATUS"
    echo ""
    health_check "OPA Policy Engine"    "http://localhost:8181/v1/health"               "OPA Policy Engine"
    health_check "Elasticsearch"        "http://localhost:9200/_cluster/health"         "Elasticsearch"
    health_check "Kibana"              "http://localhost:5601/api/status"              "Kibana"
    health_check "Kafka"               "http://localhost:9092"                         "Kafka"
    health_check "Mock Identity Provider" "http://localhost:8443/health"               "Mock IdP"
    health_check "Sensor Gateway"      "http://localhost:8081/health"                  "Sensor Gateway"
    health_check "Fusion Engine"       "http://localhost:9090/health"                  "Fusion Engine"
    health_check "Console Dashboard"   "http://localhost:9099/health"                  "Console"
    echo ""

    if curl -sf http://localhost:9099/api/status &>/dev/null; then
        echo -e "${CYAN}Fusion Status:${NC}"
        curl -s http://localhost:9099/api/status | python3 -m json.tool 2>/dev/null || curl -s http://localhost:9099/api/status
        echo ""
    fi
}

cmd_scenario() {
    local scenario="${1:-peaceful}"
    if [[ "${scenario}" != "peaceful" && "${scenario}" != "attack_prep" && "${scenario}" != "active_attack" ]]; then
        err "Invalid scenario. Use: peaceful, attack_prep, or active_attack"
        exit 1
    fi
    log "Switching scenario to: ${scenario}"
    curl -s -X POST "http://localhost:9099/api/scenario/${scenario}" | python3 -m json.tool 2>/dev/null || true
    export SCENARIO="${scenario}"
}

cmd_test() {
    header "RUNNING SANDBOX TESTS"
    echo ""

    # OPA Policy Tests
    echo -e "${BOLD}1. OPA Policy Evaluation Tests${NC}"
    curl -s -X POST http://localhost:9099/api/test/opa | python3 -m json.tool 2>/dev/null || echo "  (console not available)"
    echo ""

    # E2E Tests
    echo -e "${BOLD}2. End-to-End Integration Tests${NC}"
    curl -s -X POST http://localhost:9099/api/test/e2e | python3 -m json.tool 2>/dev/null || echo "  (console not available)"
    echo ""

    # Auth Test: Valid login
    echo -e "${BOLD}3. Identity Auth Test — Valid Login${NC}"
    curl -s -X POST http://localhost:8443/auth \
        -H "Content-Type: application/json" \
        -d '{"operator_id":"CDR_OKONKWO","biometric_hash":"abc123","smartcard_present":true,"smartcard_signature":"sig_ok","facility_id":"HQ_ABUJA","device_id":"TABLET-A001","request_time":36000}' \
        | python3 -m json.tool 2>/dev/null || echo "  (IdP not available)"
    echo ""

    # Auth Test: Denied from wrong facility
    echo -e "${BOLD}4. Identity Auth Test — Blocked (Wrong Facility)${NC}"
    curl -s -X POST http://localhost:8443/auth \
        -H "Content-Type: application/json" \
        -d '{"operator_id":"CDR_OKONKWO","biometric_hash":"abc123","smartcard_present":true,"smartcard_signature":"sig_ok","facility_id":"ENEMY_CAMP","device_id":"TABLET-A001","request_time":36000}' \
        | python3 -m json.tool 2>/dev/null || echo "  (IdP not available)"
    echo ""

    # Self-Wipe Test
    echo -e "${BOLD}5. Self-Wipe Trigger Test${NC}"
    curl -s -X POST http://localhost:8081/simulate/selfwipe \
        -H "Content-Type: application/json" \
        -d '{"trigger":"tamper_sensor"}' \
        | python3 -m json.tool 2>/dev/null || echo "  (sensor not available)"
    echo ""

    # Threat Assessment
    echo -e "${BOLD}6. Current Threat Assessment${NC}"
    curl -s http://localhost:9090/threat | python3 -m json.tool 2>/dev/null || echo "  (fusion not available)"
    echo ""

    echo -e "${GREEN}Tests complete. See above for results.${NC}"
}

cmd_logs() {
    local svc="${1:-}"
    cd "${SANDBOX_DIR}"
    if [[ -n "${svc}" ]]; then
        docker compose -f "${COMPOSE_FILE}" logs -f "${svc}"
    else
        docker compose -f "${COMPOSE_FILE}" logs -f
    fi
}

cmd_clean() {
    warn "This will remove ALL sandbox data (containers, volumes, Kafka/ES data)."
    prompt_confirm "Are you sure?" || exit 0
    header "CLEANING SANDBOX"
    cd "${SANDBOX_DIR}"
    docker compose -f "${COMPOSE_FILE}" down -v 2>&1
    rm -rf "${SANDBOX_DIR}/data" 2>/dev/null || true
    mkdir -p "${SANDBOX_DIR}/data"/{es01,kafka,opa}
    log "Sandbox cleaned. Run './sandbox.sh start' to rebuild."
}

cmd_hard_reset() {
    cmd_clean
    warn "Removing all Docker images built for sandbox..."
    docker rmi issf-sandbox-mock-idp issf-sandbox-sensor-gateway issf-sandbox-fusion-engine issf-sandbox-console 2>/dev/null || true
    log "Hard reset complete."
}

cmd_help() {
    echo ""
    echo "  USAGE: ./sandbox.sh <command> [options]"
    echo ""
    echo "  COMMANDS:"
    echo "    start       — Build and start all sandbox services"
    echo "    stop        — Stop all services"
    echo "    restart     — Restart all services"
    echo "    status      — Show service health and fusion status"
    echo "    scenario    — Switch scenario (peaceful|attack_prep|active_attack)"
    echo "    test        — Run all test scenarios"
    echo "    logs [svc]  — Tail logs (optional: service name)"
    echo "    clean       — Remove containers + data volumes"
    echo "    reset       — Full clean + image rebuild"
    echo "    help        — Show this help"
    echo ""
    echo "  SCENARIOS:"
    echo "    peaceful      — Low background sensor activity"
    echo "    attack_prep   — Elevated SIM/fuel/motion activity"
    echo "    active_attack — High intensity (triggers RED alerts)"
    echo ""
    echo "  TEST OPERATORS (for IdP auth):"
    echo "    CDR_OKONKWO      — Colonel, JTF North-East, TOP_SECRET"
    echo "    MAJ_ADEOBA       — Major, Intel, SECRET"
    echo "    CPT_DANJUMA      — Captain, QRF Command, SECRET"
    echo "    LT_NWACHUKWU     — Lieutenant, Sensors, RESTRICTED"
    echo "    INSIDER_MALAMA   — INSIDER THREAT test case"
    echo ""
    echo "  EXAMPLES:"
    echo "    ./sandbox.sh start"
    echo "    ./sandbox.sh scenario attack_prep"
    echo "    ./sandbox.sh test"
    echo "    ./sandbox.sh logs fusion-engine"
    echo "    SCENARIO=active_attack ./sandbox.sh start"
    echo ""
}

# ── Main ──────────────────────────────────────────────────
check_deps

case "${1:-help}" in
    start)    cmd_start ;;
    stop)     cmd_stop ;;
    restart)  cmd_restart ;;
    status)   cmd_status ;;
    scenario) cmd_scenario "${2:-peaceful}" ;;
    test)     cmd_test ;;
    logs)     cmd_logs "${2:-}" ;;
    clean)    cmd_clean ;;
    reset)    cmd_hard_reset ;;
    help|--help|-h) cmd_help ;;
    *)
        err "Unknown command: ${1}"
        cmd_help
        exit 1
        ;;
esac
