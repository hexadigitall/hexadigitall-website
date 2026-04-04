#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'public', 'curriculums');

function e(s=''){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');}

function weekBlock(week){
  return `
            <div class="week-block">
                <div class="week-header">
                    <span class="week-number">Week ${week.num}</span>
                    <span class="week-duration">2 hours + labs</span>
                </div>
                <div class="week-topic">${e(week.topic)}</div>
                <div class="week-content">
                    <div class="week-column">
                        <h4>Concept Scope</h4>
                        <ul>
                            ${week.core.map(x=>`<li>${e(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Hands-On Scope</h4>
                        <ul>
                            ${week.lab.map(x=>`<li>${e(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Expected Deliverables</h4>
                        <ul>
                            ${week.deliverables.map(x=>`<li>${e(x)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;
}

function renderCourse({title, slug, level, weeks, overview, prerequisites, outcomes, projects, imageSrc}){
  const weekly = weeks.map(weekBlock).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${e(title)} - Course Curriculum</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --primary-color:#0078D4; --dark-blue:#002050; --text-dark:#1F1F1F; --text-light:#605E5C; --bg-light:#F5F5F5; --bg-white:#FFFFFF; --border-color:#EDEBE9; }
        body { font-family:'Inter',sans-serif; line-height:1.6; color:var(--text-dark); background:var(--bg-white); font-size:14px; }
        .container { max-width:1200px; margin:0 auto; padding:40px; }
        .brand-bar { display:flex; align-items:center; justify-content:space-between; gap:20px; border:1px solid var(--border-color); border-radius:12px; padding:16px 20px; margin-bottom:20px; box-shadow:0 4px 18px rgba(0,32,80,.08); }
        .brand-meta { display:flex; align-items:center; gap:16px; }
        .brand-meta img { width:60px; }
        .brand-name { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--dark-blue); }
        .brand-link { color:var(--primary-color); font-weight:600; text-decoration:none; }
        .qr-block { display:flex; align-items:center; gap:12px; background:var(--bg-light); padding:10px 14px; border-radius:10px; border:1px solid var(--border-color); }
        .qr-block img { width:86px; height:86px; }
        .qr-text { font-size:12px; color:var(--text-light); max-width:220px; }
        .course-hero { background:linear-gradient(135deg,#E8F4FD 0%,#F5F9FF 100%); border:1px solid var(--border-color); border-radius:12px; padding:18px; margin-bottom:24px; display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:center; }
        .course-hero img { width:100%; border-radius:12px; border:1px solid var(--border-color); }
        .course-hero h2 { font-family:'Space Grotesk',sans-serif; color:var(--dark-blue); margin-bottom:10px; font-size:22px; }
        .header { background:linear-gradient(135deg,var(--dark-blue) 0%,var(--primary-color) 100%); color:white; padding:60px 40px; border-radius:12px; margin-bottom:40px; }
        .header h1 { font-family:'Space Grotesk',sans-serif; font-size:40px; margin-bottom:12px; }
        .subtitle { font-size:18px; opacity:.95; margin-bottom:16px; }
        .course-meta { display:flex; flex-wrap:wrap; gap:16px; margin-top:16px; }
        .meta-item { background:rgba(255,255,255,.15); padding:10px 14px; border-radius:8px; }
        .section { margin-bottom:46px; }
        .section-title { font-family:'Space Grotesk',sans-serif; font-size:28px; color:var(--dark-blue); margin-bottom:22px; padding-bottom:10px; border-bottom:3px solid var(--primary-color); }
        .card { border:1px solid var(--border-color); border-radius:10px; padding:22px; }
        .card ul { margin-left:20px; }
        .card li { margin:6px 0; }
        .week-block { border:1px solid var(--border-color); border-left:6px solid var(--primary-color); border-radius:12px; padding:16px; margin-bottom:14px; }
        .week-header { display:flex; justify-content:space-between; margin-bottom:10px; }
        .week-topic { color:var(--primary-color); font-family:'Space Grotesk',sans-serif; font-size:18px; margin-bottom:10px; }
        .week-content { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
        .week-column { background:#f8fbff; border:1px solid var(--border-color); border-radius:8px; padding:10px; }
        .week-column h4 { font-size:13px; color:var(--dark-blue); margin-bottom:8px; }
        .week-column ul { margin-left:16px; }
        .week-column li { font-size:13px; margin:5px 0; }
        .project-card { border:1px solid var(--border-color); border-radius:10px; padding:16px; margin-bottom:12px; background:linear-gradient(135deg,#f3f8ff 0%,#fff 100%); }
        .project-card h4 { color:var(--dark-blue); margin-bottom:8px; }
        .project-card p { color:var(--text-light); margin-bottom:8px; }
        .project-card ul { margin-left:20px; }
        .footer { border-top:1px solid var(--border-color); margin-top:24px; padding-top:16px; color:var(--text-light); font-size:12px; }
        @media (max-width:900px){ .course-hero{grid-template-columns:1fr;} .week-content{grid-template-columns:1fr;} }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand-bar">
            <div class="brand-meta">
                <img src="../hexadigitall-logo-transparent.png" alt="Hexadigitall logo">
                <div>
                    <div class="brand-name">Hexadigitall Academy (Hexadigitall Technologies)</div>
                    <a class="brand-link" href="https://www.hexadigitall.com">www.hexadigitall.com</a>
                </div>
            </div>
            <div class="qr-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.hexadigitall.com/courses/${e(slug)}" alt="Course QR Code">
                <div class="qr-text">Scan for course page, admissions, and mentorship details.</div>
            </div>
        </div>

        <div class="course-hero">
            <div>
                <h2>${e(title)}</h2>
                <p>${e(overview)}</p>
            </div>
            <img src="${e(imageSrc)}" alt="${e(title)}" onerror="this.style.display='none'">
        </div>

        <div class="header">
            <h1>${e(title)}</h1>
            <p class="subtitle">Detailed course-specific weekly curriculum built for professional competency and portfolio delivery.</p>
            <div class="course-meta">
                <div class="meta-item"><strong>Duration:</strong> ${weeks.length} Weeks</div>
                <div class="meta-item"><strong>Level:</strong> ${e(level)}</div>
                <div class="meta-item"><strong>Study Time:</strong> 2 hours/week + labs</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Prerequisites & What You Should Know</h2>
            <div class="card"><ul>${prerequisites.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Outcomes</h2>
            <div class="card"><ul>${outcomes.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>
        </div>

        <div class="section">
            <h2 class="section-title">Detailed Weekly Curriculum</h2>
${weekly}
        </div>

        <div class="section">
            <h2 class="section-title">Capstone Projects</h2>
            ${projects.map(p=>`<div class="project-card"><h4>${e(p.title)}</h4><p>${e(p.desc)}</p><ul>${p.scope.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`).join('')}
        </div>

        <div class="footer">
            <p>&copy; 2026 Hexadigitall Academy (Hexadigitall Technologies). ${e(title)} curriculum.</p>
        </div>
    </div>
</body>
</html>`;
}

const landingWeeks = [
  ['Landing Zone Strategy and CAF Alignment',['Cloud adoption framework phases and landing zone operating model.','Business, security, and compliance drivers translated to platform requirements.','Reference architecture decisions for enterprise foundations.'],['Draft target-state architecture and governance model.','Map business units to subscription/account hierarchy.','Create initial platform backlog and implementation milestones.'],['Strategy brief and architecture baseline.','Requirements matrix and governance assumptions.','Week 1 review memo with decision log.']],
  ['Identity and Access Operating Model',['Identity source-of-truth and tenant design principles.','Privileged access model, role separation, and break-glass strategy.','RBAC policy inheritance across management hierarchy.'],['Configure identity groups and role baselines.','Implement least-privilege role assignment patterns.','Validate privileged workflows with approval controls.'],['IAM design document and role map.','Access control test evidence.','Privilege escalation risk register.']],
  ['Hierarchy Design: Tenants, Management Groups, Subscriptions',['Management group strategy for platform, landing, and sandbox scopes.','Subscription/account segmentation by environment and business domain.','Policy inheritance and scope boundaries.'],['Build hierarchy and assign policy scaffolds.','Implement naming standards and resource taxonomy.','Validate delegation boundaries and ownership model.'],['Hierarchy implementation diagram.','Policy scope validation report.','Naming and taxonomy standard.']],
  ['Network Topology Blueprint',['Hub-spoke or transit architecture trade-offs.','Address space planning, segmentation, and overlapping CIDR risks.','Ingress/egress and east-west traffic controls.'],['Implement core vNet/VPC topology.','Configure routing and segmentation controls.','Validate connectivity and isolation test cases.'],['Network architecture baseline.','Routing and segmentation test logs.','Operational runbook v1.']],
  ['Hybrid Connectivity and Edge Integration',['Site-to-site and private connectivity patterns.','DNS, identity, and trust boundaries in hybrid designs.','Failover patterns for branch and on-prem integration.'],['Configure hybrid network connectivity lab.','Implement DNS and private endpoint strategy.','Test resilience and failover scenarios.'],['Hybrid connectivity implementation notes.','Edge integration checklist.','Failover test report.']],
  ['Security Baselines and Policy as Code',['Guardrails using policy frameworks and control objectives.','Security baseline controls for compute, data, and networking.','Policy lifecycle management and exception handling.'],['Author and assign policy definitions.','Enforce baseline hardening controls.','Validate noncompliance remediation paths.'],['Security baseline policy pack.','Exception and waiver workflow.','Compliance gap summary.']],
  ['Logging, Monitoring, and Detection Foundations',['Platform telemetry architecture and log taxonomy.','Centralized monitoring, alerting, and correlation strategy.','Detection engineering principles for platform signals.'],['Enable diagnostic settings and log pipelines.','Configure dashboards and alert thresholds.','Simulate incidents and validate detections.'],['Observability architecture and data map.','Alert runbook and threshold rationale.','Detection validation evidence.']],
  ['Governance, Tagging, and FinOps Controls',['Resource governance standards and mandatory metadata.','Budget controls, chargeback/showback model.','Cost anomaly detection and optimization loops.'],['Implement tagging policy and enforcement.','Configure budgets and cost alerts.','Build basic FinOps reporting views.'],['Governance policy and tagging standard.','Budget configuration evidence.','Cost optimization recommendations.']],
  ['Infrastructure as Code for Landing Zones',['IaC module design for reusable platform components.','State management and environment promotion strategy.','Secure secrets and configuration management in IaC.'],['Build reusable IaC modules for core landing zone components.','Implement state isolation and locking.','Run validation and policy checks in pipeline.'],['IaC module repository structure.','State strategy and backend configuration.','Pipeline quality gate report.']],
  ['Platform CI/CD and Change Management',['Release flow for platform changes and guardrails.','Automated validation, approvals, and rollback standards.','Change management governance for platform teams.'],['Build CI/CD workflow for landing zone changes.','Integrate static checks and policy gates.','Test rollback path with controlled failure scenario.'],['Platform pipeline design.','Approval and rollback evidence.','Change governance checklist.']],
  ['Workload Onboarding Patterns',['Landing zone onboarding process for new product teams.','Shared services, platform contracts, and ownership boundaries.','Security and networking onboarding controls.'],['Execute onboarding for sample workload.','Apply baseline templates and controls.','Validate readiness using onboarding checklist.'],['Onboarding playbook v1.','Sample workload onboarding evidence.','Readiness assessment report.']],
  ['Compliance, Audit, and Control Validation',['Mapping technical controls to regulatory requirements.','Audit evidence collection and control attestation model.','Continuous compliance monitoring architecture.'],['Implement compliance dashboards and control status tracking.','Automate evidence collection for key controls.','Run mock audit against selected control set.'],['Control mapping matrix.','Audit evidence package.','Mock audit findings and remediation plan.']],
  ['Business Continuity and Disaster Recovery',['Resilience objectives (RTO/RPO) for platform services.','Cross-region and backup strategy for landing zone components.','Incident escalation and recovery governance.'],['Implement backup and DR configuration baseline.','Run tabletop and technical recovery drills.','Validate failover/failback procedures.'],['DR architecture and runbook.','Recovery drill evidence.','Risk and resilience improvement log.']],
  ['Capstone: Enterprise Landing Zone Delivery',['End-to-end landing zone architecture defense.','Governance, security, observability, and operations integration.','Executive communication of platform value and risks.'],['Build and present a complete landing zone blueprint and implementation package.','Demonstrate controls, onboarding, and operational workflows.','Conduct final review with architecture and security checkpoints.'],['Final architecture dossier.','Implementation and operations bundle.','Capstone presentation and Q&A notes.']]
].map((x,i)=>({num:i+1,topic:x[0],core:x[1],lab:x[2],deliverables:x[3]}));

const devopsWeeks = [
  ['DevOps Foundations and Linux Systems Fundamentals',['DevOps culture, CALMS principles, and value stream thinking.','Linux administration essentials for production environments.','Operational mindset for reliability and automation.'],['Set up Linux workstation/server environment.','Practice command-line administration and permissions workflows.','Document reproducible setup and troubleshooting steps.'],['Environment setup documentation.','Linux operations checklist.','Week-1 lab evidence.']],
  ['Version Control, Git Strategy, and Collaboration',['Git workflows, branching strategy, and commit hygiene.','Repository governance and collaborative development patterns.','Pull request quality controls and review standards.'],['Implement branch strategy and protected branch rules.','Run PR workflow with review and merge policies.','Resolve merge conflicts and audit commit history.'],['Repository governance configuration.','PR review artifacts.','Git workflow retrospective.']],
  ['CI Foundations with Automated Build and Test',['CI pipeline stages and quality gates.','Build reproducibility, dependency management, and test automation.','Pipeline failure diagnosis and remediation patterns.'],['Build first CI pipeline with lint, tests, and artifacts.','Configure test reporting and status checks.','Debug and fix a failing pipeline scenario.'],['CI pipeline YAML and documentation.','Automated test evidence.','Failure remediation report.']],
  ['Containerization with Docker Fundamentals',['Container runtime model and image lifecycle.','Dockerfile best practices and multi-stage builds.','Image security and deterministic builds.'],['Build container images for sample services.','Implement multi-stage Dockerfile optimization.','Run vulnerability scan and remediation steps.'],['Container build artifacts.','Dockerfile quality checklist.','Security scan summary.']],
  ['Container Networking and Persistent Storage',['Container networking modes and service communication.','Volume management and data durability patterns.','Runtime observability and debugging techniques.'],['Create multi-container local environment.','Implement persistent data strategy and backup steps.','Capture runtime logs and troubleshoot networking faults.'],['Compose configuration and runbook.','Storage validation evidence.','Network troubleshooting notes.']],
  ['Kubernetes Core Architecture and Workloads',['Kubernetes control plane and worker node responsibilities.','Workload primitives: Deployments, ReplicaSets, and Pods.','Scheduling behavior and resource management.'],['Deploy workloads to a cluster.','Tune probes, resources, and rollout settings.','Validate workload health and autoscaling prerequisites.'],['Kubernetes manifests set 1.','Workload validation report.','Rollout checklist.']],
  ['Kubernetes Services, Ingress, and Traffic Management',['Service discovery and traffic routing patterns.','Ingress controller fundamentals and path/host routing.','Network policies and segmentation controls.'],['Expose workloads via services and ingress.','Implement TLS ingress and route policies.','Test service communication and network policy enforcement.'],['Networking manifests set 2.','Ingress validation evidence.','Traffic policy summary.']],
  ['Kubernetes Configuration, Secrets, and Stateful Patterns',['ConfigMaps, Secrets, and secure configuration workflows.','StatefulSets and persistent volume claims.','Operational considerations for stateful workloads.'],['Deploy stateful app with persistent storage.','Implement secret management workflow.','Perform controlled update and rollback test.'],['Stateful workload manifests.','Secret handling checklist.','Update/rollback evidence.']],
  ['Helm and Kubernetes Package Management',['Helm chart structure and templating strategy.','Values management across environments.','Chart testing and release lifecycle.'],['Create and package Helm chart.','Deploy chart with environment overlays.','Run chart linting and release rollback test.'],['Helm chart repository.','Deployment logs and rollback evidence.','Release notes.']],
  ['Infrastructure as Code with Terraform Fundamentals',['Terraform workflow, state, and dependency graph.','Provider configuration and module decomposition.','Idempotent infrastructure delivery principles.'],['Provision cloud infrastructure with Terraform.','Implement module-based structure and variables.','Validate plans and apply safety controls.'],['Terraform codebase and module map.','Plan/apply evidence.','State management notes.']],
  ['Terraform Advanced State, Modules, and Environments',['Remote state backends and locking strategy.','Reusable module design for platform teams.','Environment promotion and drift management.'],['Set up remote backend and state locking.','Refactor IaC into reusable modules.','Run drift detection and remediation workflow.'],['Advanced Terraform architecture doc.','Module registry artifacts.','Drift remediation report.']],
  ['Cloud Platform Services for DevOps Workloads',['Core cloud services for compute, storage, and networking.','IAM and least-privilege deployment controls.','Reliability and scalability design decisions.'],['Deploy reference workload to cloud.','Harden IAM and access boundaries.','Implement HA baseline and validate failover assumptions.'],['Cloud deployment evidence.','IAM policy review output.','HA validation notes.']],
  ['CI/CD Release Strategies and Deployment Safety',['Release strategies: blue/green, canary, and rolling updates.','Environment promotion and deployment approvals.','Rollback strategy and release risk management.'],['Implement multi-environment pipeline.','Execute controlled canary deployment.','Perform rollback drill with postmortem notes.'],['Release pipeline artifacts.','Deployment strategy decision log.','Rollback drill report.']],
  ['Observability: Metrics, Logs, and Traces',['Observability pillars and telemetry architecture.','Prometheus/Grafana and centralized log pipelines.','SLO/SLI/SLA model and alert tuning.'],['Build dashboards for service health and latency.','Implement log aggregation and trace correlation.','Tune alerts to reduce noise and improve signal quality.'],['Observability dashboard pack.','Alert policy configuration.','SLO/SLI baseline.']],
  ['DevSecOps and Secure Delivery Controls',['Shift-left security in CI/CD pipelines.','SAST, dependency scanning, and secret detection.','Runtime security controls and policy enforcement.'],['Integrate security scans into pipeline gates.','Remediate identified vulnerabilities with documented fixes.','Validate policy compliance before deployment.'],['Security pipeline report.','Vulnerability remediation log.','Compliance evidence.']],
  ['GitOps and Platform Operations',['GitOps operating model and desired state reconciliation.','ArgoCD/Flux workflow and sync policies.','Operational governance for platform teams.'],['Deploy GitOps controller and app definitions.','Test drift reconciliation and policy controls.','Document promotion flow and approval checkpoints.'],['GitOps repository structure.','Sync and drift evidence.','Operations playbook.']],
  ['Reliability Engineering and Incident Response',['SRE practices, error budgets, and reliability metrics.','Incident command workflow and communication standards.','Root cause analysis and corrective action planning.'],['Run simulated incident scenario and triage process.','Build incident timeline and post-incident report.','Implement reliability improvements from findings.'],['Incident runbook and timeline.','Postmortem document.','Reliability improvement backlog.']],
  ['FinOps and Performance Optimization',['Cost visibility, allocation, and optimization strategies.','Performance tuning methodology and bottleneck analysis.','Capacity planning and scaling economics.'],['Implement cost dashboards and budgets.','Profile workload and optimize key bottlenecks.','Validate performance improvements with before/after metrics.'],['Cost optimization report.','Performance benchmark evidence.','Capacity planning sheet.']],
  ['Capstone Build: End-to-End DevOps Platform',['Architect an end-to-end DevOps platform solution.','Integrate CI/CD, IaC, observability, and security controls.','Prepare production-readiness evidence and governance assets.'],['Build full capstone platform implementation.','Execute validation pipeline and operational checks.','Prepare handover documentation and demonstration package.'],['Capstone implementation repository.','Validation and readiness evidence.','Operations handover dossier.']],
  ['Capstone Hardening and Executive Defense',['Operational hardening and resilience validation.','Executive communication of architecture trade-offs and risk posture.','Final technical defense and roadmap recommendations.'],['Run hardening checklist and close critical gaps.','Present capstone architecture and operations strategy.','Complete final technical review and remediation tasks.'],['Final capstone presentation.','Hardening closure report.','Roadmap and next-phase recommendations.']]
].map((x,i)=>({num:i+1,topic:x[0],core:x[1],lab:x[2],deliverables:x[3]}));

function writeFile(fileName, payload){
  fs.writeFileSync(path.join(dir,fileName), renderCourse(payload), 'utf8');
}

writeFile('curriculum-architecting-landing-zones.html', {
  title:'Landing Zone Specialist Curriculum',
  slug:'architecting-landing-zones',
  level:'Advanced',
  weeks:landingWeeks,
  imageSrc:'../og-images/school-of-cloud-and-devops-engineering.jpg',
  overview:'Design, implement, and operate enterprise-grade cloud landing zones with governance, security, networking, and operational excellence baked in from day one.',
  prerequisites:[
    'Working knowledge of cloud fundamentals and virtual networking.',
    'Basic understanding of IAM concepts and policy-based access control.',
    'Comfort with infrastructure automation concepts and CLI-based workflows.',
    'Readiness to document architecture decisions and operational runbooks.'
  ],
  outcomes:[
    'Design enterprise landing zone architecture aligned to governance and security standards.',
    'Implement identity, networking, policy, and observability foundations for cloud platforms.',
    'Operationalize platform changes with IaC and CI/CD guardrails.',
    'Onboard workloads using standardized platform contracts and controls.',
    'Produce audit-ready evidence and resilience plans for production operations.'
  ],
  projects:[
    {title:'Project 1: Foundational Landing Zone Blueprint',desc:'Create a reference architecture and implementation baseline for an enterprise landing zone.',scope:['Management hierarchy and IAM model.','Network segmentation and connectivity design.','Governance policy baseline and tagging standards.']},
    {title:'Project 2: Automated Platform Build Pipeline',desc:'Implement an IaC + CI/CD workflow for controlled platform changes.',scope:['Reusable modules for landing zone components.','Policy and quality gates in pipeline.','Rollback and change-management validation.']},
    {title:'Project 3: Enterprise Onboarding and Compliance Capstone',desc:'Demonstrate onboarding of a workload with full governance, observability, and compliance evidence.',scope:['Workload onboarding playbook and artifacts.','Compliance control mapping and evidence pack.','Operational runbook and DR validation outputs.']}
  ]
});

writeFile('curriculum-devops-engineering-cloud-infrastructure-core.html', {
  title:'DevOps Engineering & Cloud Infrastructure (Core Track)',
  slug:'devops-engineering-cloud-infrastructure',
  level:'Advanced',
  weeks:devopsWeeks,
  imageSrc:'../assets/images/courses/devops-engineering-cloud-infrastructure.jpg',
  overview:'A professional 20-week track covering modern DevOps delivery, cloud infrastructure automation, Kubernetes operations, security, observability, and production-grade platform engineering.',
  prerequisites:[
    'Linux administration fundamentals and command-line confidence.',
    'Basic Git usage and understanding of software delivery workflows.',
    'Introductory scripting ability (Bash or Python).',
    'Commitment to weekly labs, project delivery, and technical documentation.'
  ],
  outcomes:[
    'Build and operate CI/CD pipelines with reliability and security controls.',
    'Containerize and orchestrate workloads using Docker and Kubernetes.',
    'Provision and manage cloud infrastructure using Terraform and IaC patterns.',
    'Implement observability, incident response, and reliability engineering practices.',
    'Deliver end-to-end DevOps platform capstones with production-readiness evidence.'
  ],
  projects:[
    {title:'Project 1: CI/CD and Container Delivery Pipeline',desc:'Design and deliver an automated build-test-release pipeline for a containerized service.',scope:['Pipeline with quality and security gates.','Container build, scan, and deployment workflows.','Release documentation and rollback strategy.']},
    {title:'Project 2: Kubernetes + IaC Platform Implementation',desc:'Provision infrastructure and deploy resilient workloads with observability and policy controls.',scope:['Terraform modules and remote state strategy.','Kubernetes workload, ingress, and secret management.','Dashboards, alerts, and operational runbooks.']},
    {title:'Project 3: Production DevOps Capstone',desc:'Deliver a full platform solution from infrastructure provisioning to secure delivery and operations.',scope:['End-to-end architecture, automation, and governance.','Incident simulation and reliability validation.','Executive-ready presentation and technical defense.']}
  ]
});

console.log('Rebuilt 2 missing curriculums with course-specific weekly content.');
