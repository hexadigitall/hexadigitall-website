import type { CourseAssessmentDefinition } from '@/lib/assessment-types'

const courseSlug = 'architecting-landing-zones'

export const architectingLandingZonesAssessments: CourseAssessmentDefinition[] = [
  {
    courseSlug,
    slug: 'phase-1-foundations',
    title: 'Phase I Assessment: Governance Foundations',
    phase: 'phase-1',
    phaseLabel: 'Phase I',
    description: 'Weeks 1-3 covering organizations, account strategy, and baseline governance.',
    instructions: [
      'You have one timed attempt in this session.',
      'Do not refresh your browser during the assessment.',
      'Submit before the timer reaches zero.'
    ],
    durationMinutes: 35,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p1q1',
        prompt: 'Which AWS service provides organizational units and service control policies?',
        options: [
          { id: 'a', text: 'AWS Organizations' },
          { id: 'b', text: 'AWS Config' },
          { id: 'c', text: 'Amazon Inspector' },
          { id: 'd', text: 'AWS Backup' }
        ],
        correctOptionId: 'a',
        explanation: 'AWS Organizations is the base service for multi-account structure and policy boundaries.'
      },
      {
        id: 'p1q2',
        prompt: 'What is the primary purpose of a dedicated Log Archive account?',
        options: [
          { id: 'a', text: 'To speed up CloudFront caching' },
          { id: 'b', text: 'To isolate immutable audit logs from member account compromise' },
          { id: 'c', text: 'To host developer workloads' },
          { id: 'd', text: 'To reduce Route 53 cost' }
        ],
        correctOptionId: 'b',
        explanation: 'A dedicated log account protects forensic evidence and reduces tampering risk.'
      },
      {
        id: 'p1q3',
        prompt: 'What is the effect of an explicit Deny in an SCP?',
        options: [
          { id: 'a', text: 'It can be overridden by IAM Allow' },
          { id: 'b', text: 'It only applies to root users' },
          { id: 'c', text: 'It blocks the action even if IAM allows it' },
          { id: 'd', text: 'It applies only in the management account' }
        ],
        correctOptionId: 'c',
        explanation: 'SCP explicit deny sets a hard permission boundary and cannot be bypassed by IAM allow.'
      },
      {
        id: 'p1q4',
        prompt: 'Which account should host centralized security tooling in a landing zone?',
        options: [
          { id: 'a', text: 'A dedicated Security or Audit account' },
          { id: 'b', text: 'Every workload account independently' },
          { id: 'c', text: 'Only the networking account' },
          { id: 'd', text: 'Only the billing account' }
        ],
        correctOptionId: 'a',
        explanation: 'A dedicated security account centralizes visibility and keeps controls independent from workloads.'
      },
      {
        id: 'p1q5',
        prompt: 'Why is account segmentation important in enterprise cloud governance?',
        options: [
          { id: 'a', text: 'It eliminates the need for IAM' },
          { id: 'b', text: 'It reduces blast radius and separates duties' },
          { id: 'c', text: 'It disables logging complexity' },
          { id: 'd', text: 'It guarantees zero incidents' }
        ],
        correctOptionId: 'b',
        explanation: 'Segmentation limits failure impact and supports principle-of-least-privilege operations.'
      },
      {
        id: 'p1q6',
        prompt: 'Which control type is an SCP primarily considered?',
        options: [
          { id: 'a', text: 'Detective control' },
          { id: 'b', text: 'Preventive control' },
          { id: 'c', text: 'Corrective control' },
          { id: 'd', text: 'Compensating control' }
        ],
        correctOptionId: 'b',
        explanation: 'SCPs prevent prohibited actions before they are executed.'
      },
      {
        id: 'p1q7',
        prompt: 'What is a key benefit of using IAM Identity Center in multi-account environments?',
        options: [
          { id: 'a', text: 'It replaces CloudTrail' },
          { id: 'b', text: 'It centralizes user access and permission sets' },
          { id: 'c', text: 'It provisions VPC CIDRs' },
          { id: 'd', text: 'It encrypts S3 objects by default' }
        ],
        correctOptionId: 'b',
        explanation: 'Identity Center simplifies access governance across many accounts using permission sets.'
      },
      {
        id: 'p1q8',
        prompt: 'What should be true before granting account access to project teams?',
        options: [
          { id: 'a', text: 'Guardrails and baseline controls are applied' },
          { id: 'b', text: 'No logs are enabled yet' },
          { id: 'c', text: 'Only root credentials exist' },
          { id: 'd', text: 'Budgets are optional and skipped' }
        ],
        correctOptionId: 'a',
        explanation: 'Accounts should be governed and baselined before users begin deployment.'
      },
      {
        id: 'p1q9',
        prompt: 'Which statement best describes a landing zone baseline?',
        options: [
          { id: 'a', text: 'A one-time script never revisited' },
          { id: 'b', text: 'A minimum required configuration for every account' },
          { id: 'c', text: 'A marketing document for auditors' },
          { id: 'd', text: 'A replacement for all incident response plans' }
        ],
        correctOptionId: 'b',
        explanation: 'A baseline is the mandatory standard configuration applied consistently at scale.'
      },
      {
        id: 'p1q10',
        prompt: 'What does least privilege require in a landing zone design?',
        options: [
          { id: 'a', text: 'Granting all service permissions to all developers' },
          { id: 'b', text: 'Granting only necessary permissions to perform defined tasks' },
          { id: 'c', text: 'Using one shared admin role for every team' },
          { id: 'd', text: 'Disabling all temporary credentials' }
        ],
        correctOptionId: 'b',
        explanation: 'Least privilege minimizes risk by granting only required capabilities.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-2-hardening',
    title: 'Phase II Assessment: Security Hardening',
    phase: 'phase-2',
    phaseLabel: 'Phase II',
    description: 'Weeks 4-7 covering hardened networking, identity boundaries, and policy enforcement.',
    instructions: [
      'This timed assessment evaluates hardening decisions.',
      'Answer all questions before submitting.',
      'You can review answers after grading.'
    ],
    durationMinutes: 40,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p2q1',
        prompt: 'Which network pattern best supports centralized inspection in multi-account AWS?',
        options: [
          { id: 'a', text: 'Hub-and-spoke with Transit Gateway' },
          { id: 'b', text: 'Flat VPC peering mesh only' },
          { id: 'c', text: 'Single public VPC for all workloads' },
          { id: 'd', text: 'No shared networking model' }
        ],
        correctOptionId: 'a',
        explanation: 'Hub-and-spoke with TGW enables consistent routing, inspection, and governance.'
      },
      {
        id: 'p2q2',
        prompt: 'What is the main purpose of AWS Config in Phase II hardening?',
        options: [
          { id: 'a', text: 'Provision account emails' },
          { id: 'b', text: 'Continuously evaluate resource compliance' },
          { id: 'c', text: 'Replace IAM policies' },
          { id: 'd', text: 'Act as DNS resolver' }
        ],
        correctOptionId: 'b',
        explanation: 'AWS Config provides detective controls and compliance state over time.'
      },
      {
        id: 'p2q3',
        prompt: 'Why are guardrails split into preventive and detective categories?',
        options: [
          { id: 'a', text: 'To support both blocking and monitoring use cases' },
          { id: 'b', text: 'Because only preventive controls can be automated' },
          { id: 'c', text: 'Because detective controls remove IAM roles' },
          { id: 'd', text: 'To separate logging from encryption' }
        ],
        correctOptionId: 'a',
        explanation: 'Enterprises need both prevention at execution and detection after state changes.'
      },
      {
        id: 'p2q4',
        prompt: 'What is a common reason to use customer-managed KMS keys in regulated environments?',
        options: [
          { id: 'a', text: 'They remove all key policies' },
          { id: 'b', text: 'They provide stronger control over key lifecycle and access' },
          { id: 'c', text: 'They disable encryption costs' },
          { id: 'd', text: 'They force public S3 access' }
        ],
        correctOptionId: 'b',
        explanation: 'Customer-managed keys improve control for rotation, auditability, and access governance.'
      },
      {
        id: 'p2q5',
        prompt: 'What is the value of centralized CloudTrail organization trails?',
        options: [
          { id: 'a', text: 'No need for account-level logging' },
          { id: 'b', text: 'Unified audit history across all accounts' },
          { id: 'c', text: 'Automatic privilege escalation' },
          { id: 'd', text: 'Reduced IAM complexity by deleting users' }
        ],
        correctOptionId: 'b',
        explanation: 'Organization trails capture activity consistently across the organization for forensic analysis.'
      },
      {
        id: 'p2q6',
        prompt: 'Which practice best reduces accidental data exposure in S3?',
        options: [
          { id: 'a', text: 'Disabling Block Public Access' },
          { id: 'b', text: 'Enforcing S3 Block Public Access and least privilege policies' },
          { id: 'c', text: 'Using wildcard principals in bucket policies' },
          { id: 'd', text: 'Allowing anonymous list operations by default' }
        ],
        correctOptionId: 'b',
        explanation: 'S3 public access controls plus strict policies are critical for exposure prevention.'
      },
      {
        id: 'p2q7',
        prompt: 'Why should root account usage be tightly controlled?',
        options: [
          { id: 'a', text: 'Root has limited permissions and no risk' },
          { id: 'b', text: 'Root is the most privileged identity and should be break-glass only' },
          { id: 'c', text: 'Root cannot perform billing actions' },
          { id: 'd', text: 'Root users are automatically rotated' }
        ],
        correctOptionId: 'b',
        explanation: 'Root access should be highly restricted due to its unrestricted capabilities.'
      },
      {
        id: 'p2q8',
        prompt: 'What is a practical hardening objective for security groups?',
        options: [
          { id: 'a', text: 'Allow 0.0.0.0/0 on all management ports' },
          { id: 'b', text: 'Restrict inbound rules to explicit, justified sources' },
          { id: 'c', text: 'Use default groups without review' },
          { id: 'd', text: 'Disable egress controls entirely' }
        ],
        correctOptionId: 'b',
        explanation: 'Explicit and minimal ingress policy reduces attack surface and lateral movement risk.'
      },
      {
        id: 'p2q9',
        prompt: 'What role does Security Hub play in hardening operations?',
        options: [
          { id: 'a', text: 'It creates VPCs and route tables' },
          { id: 'b', text: 'It aggregates security findings and compliance controls' },
          { id: 'c', text: 'It replaces log storage' },
          { id: 'd', text: 'It issues ACM certificates automatically only' }
        ],
        correctOptionId: 'b',
        explanation: 'Security Hub centralizes findings from multiple security services and standards.'
      },
      {
        id: 'p2q10',
        prompt: 'What is the core purpose of account-level baseline hardening automation?',
        options: [
          { id: 'a', text: 'Make each account manually unique' },
          { id: 'b', text: 'Ensure consistent security posture and reduce manual drift' },
          { id: 'c', text: 'Disable governance for speed' },
          { id: 'd', text: 'Avoid all change approvals' }
        ],
        correctOptionId: 'b',
        explanation: 'Automated baselines enforce consistency and reduce configuration variance.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-3-automation-governance',
    title: 'Phase III Assessment: Automation and Governance',
    phase: 'phase-3',
    phaseLabel: 'Phase III',
    description: 'Weeks 8-11 covering AFT pipelines, drift management, and governed self-service.',
    instructions: [
      'This assessment checks your automation operating model.',
      'The timer continues while navigating questions.',
      'Submit once all questions are answered.'
    ],
    durationMinutes: 50,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p3q1',
        prompt: 'What is the primary purpose of AWS Control Tower Account Factory for Terraform (AFT)?',
        options: [
          { id: 'a', text: 'To manage IAM users across accounts' },
          { id: 'b', text: 'To provide automated account provisioning and customization' },
          { id: 'c', text: 'To monitor resource usage and costs' },
          { id: 'd', text: 'To create network connectivity between accounts' }
        ],
        correctOptionId: 'b',
        explanation: 'AFT automates account provisioning and baseline customization workflows.'
      },
      {
        id: 'p3q2',
        prompt: 'Which AFT repository is responsible for applying account-specific customizations?',
        options: [
          { id: 'a', text: 'aft-global-customizations' },
          { id: 'b', text: 'aft-account-customizations' },
          { id: 'c', text: 'aft-account-requests' },
          { id: 'd', text: 'aft-management' }
        ],
        correctOptionId: 'b',
        explanation: 'The account-customizations repository applies scoped custom Terraform logic per account.'
      },
      {
        id: 'p3q3',
        prompt: 'What is infrastructure drift in Terraform operations?',
        options: [
          { id: 'a', text: 'Expected scaling changes from autoscaling groups' },
          { id: 'b', text: 'Manual or out-of-band changes that differ from declared IaC state' },
          { id: 'c', text: 'Changes made through pull requests' },
          { id: 'd', text: 'Rotating KMS keys on schedule' }
        ],
        correctOptionId: 'b',
        explanation: 'Drift is divergence between desired code state and live infrastructure state.'
      },
      {
        id: 'p3q4',
        prompt: 'Which service enables users to deploy pre-approved products under governance?',
        options: [
          { id: 'a', text: 'AWS Service Catalog' },
          { id: 'b', text: 'AWS CloudFormation StackSets only' },
          { id: 'c', text: 'AWS DataSync' },
          { id: 'd', text: 'AWS Personal Health Dashboard' }
        ],
        correctOptionId: 'a',
        explanation: 'Service Catalog provides controlled self-service provisioning with guardrails.'
      },
      {
        id: 'p3q5',
        prompt: 'What do launch constraints in Service Catalog define?',
        options: [
          { id: 'a', text: 'The IAM role used to provision resources' },
          { id: 'b', text: 'Maximum CPU quota for all accounts' },
          { id: 'c', text: 'Automatic rollback interval' },
          { id: 'd', text: 'Encryption algorithm for all products' }
        ],
        correctOptionId: 'a',
        explanation: 'Launch constraints map provisioning actions to specific controlled IAM roles.'
      },
      {
        id: 'p3q6',
        prompt: 'Which Terraform mechanism prevents concurrent state write corruption?',
        options: [
          { id: 'a', text: 'Workspace tags' },
          { id: 'b', text: 'DynamoDB-backed state locking' },
          { id: 'c', text: 'CloudWatch alarms' },
          { id: 'd', text: 'Route 53 health checks' }
        ],
        correctOptionId: 'b',
        explanation: 'State locking prevents two runs from mutating the same state at once.'
      },
      {
        id: 'p3q7',
        prompt: 'Which repository usually triggers account creation in AFT?',
        options: [
          { id: 'a', text: 'aft-account-requests' },
          { id: 'b', text: 'aft-global-customizations' },
          { id: 'c', text: 'aft-account-customizations' },
          { id: 'd', text: 'aft-lambda-runtimes' }
        ],
        correctOptionId: 'a',
        explanation: 'Merging requests in aft-account-requests starts account provisioning workflows.'
      },
      {
        id: 'p3q8',
        prompt: 'What does GitOps mean in landing zone operations?',
        options: [
          { id: 'a', text: 'Using Git only for documentation' },
          { id: 'b', text: 'Treating Git as the source of truth for declared infrastructure' },
          { id: 'c', text: 'Running all deployments from local laptops' },
          { id: 'd', text: 'Disabling pull requests for speed' }
        ],
        correctOptionId: 'b',
        explanation: 'GitOps enforces declarative, reviewable, and auditable infrastructure changes.'
      },
      {
        id: 'p3q9',
        prompt: 'Which capability of AWS Config supports centralized compliance visibility?',
        options: [
          { id: 'a', text: 'Config Aggregators' },
          { id: 'b', text: 'Elastic IP pools' },
          { id: 'c', text: 'Direct Connect gateways' },
          { id: 'd', text: 'NAT Gateway flow export' }
        ],
        correctOptionId: 'a',
        explanation: 'Aggregators combine compliance signals across accounts and regions.'
      },
      {
        id: 'p3q10',
        prompt: 'What is the primary operational value of reusable Terraform modules?',
        options: [
          { id: 'a', text: 'Bypassing review processes' },
          { id: 'b', text: 'Reducing duplication while enforcing consistent patterns' },
          { id: 'c', text: 'Avoiding remote state' },
          { id: 'd', text: 'Replacing CI pipelines' }
        ],
        correctOptionId: 'b',
        explanation: 'Modules improve consistency, speed, and maintainability at enterprise scale.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-4-lifecycle-compliance',
    title: 'Phase IV Assessment: Lifecycle and Compliance',
    phase: 'phase-4',
    phaseLabel: 'Phase IV',
    description: 'Weeks 12-14 focused on day-2 operations, lifecycle controls, and audit evidence.',
    instructions: [
      'Read each question carefully before selecting your answer.',
      'You may change answers before final submission.',
      'Your final score is computed immediately after submit.'
    ],
    durationMinutes: 55,
    passPercentage: 70,
    totalQuestions: 10,
    questions: [
      {
        id: 'p4q1',
        prompt: 'What is the primary purpose of AWS Config Rules in landing zone lifecycle management?',
        options: [
          { id: 'a', text: 'To schedule IAM password resets' },
          { id: 'b', text: 'To detect non-compliant resource configurations continuously' },
          { id: 'c', text: 'To provision accounts automatically' },
          { id: 'd', text: 'To store backup snapshots' }
        ],
        correctOptionId: 'b',
        explanation: 'Config Rules continuously evaluate compliance posture and detect drift conditions.'
      },
      {
        id: 'p4q2',
        prompt: 'Which service is commonly used for automated remediation runbooks?',
        options: [
          { id: 'a', text: 'AWS Systems Manager Automation' },
          { id: 'b', text: 'AWS Cost Explorer' },
          { id: 'c', text: 'AWS Budgets' },
          { id: 'd', text: 'AWS Resource Access Manager' }
        ],
        correctOptionId: 'a',
        explanation: 'Systems Manager Automation executes repeatable remediation steps from policy events.'
      },
      {
        id: 'p4q3',
        prompt: 'Why is S3 Object Lock valuable for compliance evidence?',
        options: [
          { id: 'a', text: 'It compresses logs by default' },
          { id: 'b', text: 'It enforces write-once-read-many retention controls' },
          { id: 'c', text: 'It disables encryption requirements' },
          { id: 'd', text: 'It replaces CloudTrail' }
        ],
        correctOptionId: 'b',
        explanation: 'Object Lock supports immutable retention requirements for audit trails.'
      },
      {
        id: 'p4q4',
        prompt: 'What is account decommissioning in a governed cloud platform?',
        options: [
          { id: 'a', text: 'Deleting billing records only' },
          { id: 'b', text: 'Securely retiring accounts while preserving required evidence and controls' },
          { id: 'c', text: 'Converting all accounts to development mode' },
          { id: 'd', text: 'Migrating every account to a new region automatically' }
        ],
        correctOptionId: 'b',
        explanation: 'Decommissioning requires controlled data handling, retention, and documented closure.'
      },
      {
        id: 'p4q5',
        prompt: 'Which AWS capability is specifically designed to support audit evidence collection workflows?',
        options: [
          { id: 'a', text: 'AWS Audit Manager' },
          { id: 'b', text: 'AWS Global Accelerator' },
          { id: 'c', text: 'AWS Elemental MediaConvert' },
          { id: 'd', text: 'Amazon Neptune' }
        ],
        correctOptionId: 'a',
        explanation: 'Audit Manager helps map controls and collect evidence for compliance audits.'
      },
      {
        id: 'p4q6',
        prompt: 'What does operational readiness mean at handover?',
        options: [
          { id: 'a', text: 'Only architects can run production operations' },
          { id: 'b', text: 'Ops teams can run and support the platform without architect dependency' },
          { id: 'c', text: 'No documentation is required after delivery' },
          { id: 'd', text: 'All accounts must remain static forever' }
        ],
        correctOptionId: 'b',
        explanation: 'Readiness means runbooks, ownership, and supportability are fully operationalized.'
      },
      {
        id: 'p4q7',
        prompt: 'Which practice strengthens day-2 resilience validation?',
        options: [
          { id: 'a', text: 'Avoiding recovery tests in production-like environments' },
          { id: 'b', text: 'Running disaster recovery and failover validation exercises' },
          { id: 'c', text: 'Disabling backups for cost reduction' },
          { id: 'd', text: 'Using only manual rollback plans' }
        ],
        correctOptionId: 'b',
        explanation: 'Regular DR validation confirms recovery objectives and runbook effectiveness.'
      },
      {
        id: 'p4q8',
        prompt: 'Why is change management critical in landing zone operations?',
        options: [
          { id: 'a', text: 'To avoid peer review and speed changes' },
          { id: 'b', text: 'To ensure changes are approved, tested, and auditable' },
          { id: 'c', text: 'To remove rollback mechanisms' },
          { id: 'd', text: 'To keep state files local-only' }
        ],
        correctOptionId: 'b',
        explanation: 'Change governance protects stability and compliance as the platform evolves.'
      },
      {
        id: 'p4q9',
        prompt: 'Which service combination best supports centralized security posture reporting?',
        options: [
          { id: 'a', text: 'Security Hub plus Config plus CloudTrail' },
          { id: 'b', text: 'SNS plus SQS only' },
          { id: 'c', text: 'Cloud9 plus CodeCommit only' },
          { id: 'd', text: 'EC2 plus EBS snapshots only' }
        ],
        correctOptionId: 'a',
        explanation: 'Combined telemetry and findings provide broad compliance and security visibility.'
      },
      {
        id: 'p4q10',
        prompt: 'What is the practical value of documentation as infrastructure?',
        options: [
          { id: 'a', text: 'Documentation is generated once and never updated' },
          { id: 'b', text: 'Operational knowledge stays versioned and aligned with platform changes' },
          { id: 'c', text: 'It removes the need for runbooks' },
          { id: 'd', text: 'It replaces access controls' }
        ],
        correctOptionId: 'b',
        explanation: 'Documentation versioned with code ensures reliable handover and support continuity.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'final-certification',
    title: 'Final Certification: Landing Zone Specialist',
    phase: 'final',
    phaseLabel: 'Final Certification',
    description: 'Comprehensive assessment spanning governance, hardening, automation, and day-2 operations.',
    instructions: [
      'This is the comprehensive certification assessment.',
      'You must complete all questions within the allotted time.',
      'Review your result page and print your official submission record.'
    ],
    durationMinutes: 90,
    passPercentage: 76,
    totalQuestions: 20,
    questions: [
      {
        id: 'f1',
        prompt: 'Which service is foundational for organizing AWS accounts and applying SCPs?',
        options: [
          { id: 'a', text: 'AWS Organizations' },
          { id: 'b', text: 'AWS Shield' },
          { id: 'c', text: 'AWS Storage Gateway' },
          { id: 'd', text: 'AWS Glue' }
        ],
        correctOptionId: 'a',
        explanation: 'AWS Organizations is the governance backbone for multi-account architecture.'
      },
      {
        id: 'f2',
        prompt: 'What does a dedicated audit account primarily provide?',
        options: [
          { id: 'a', text: 'Workload scaling capacity' },
          { id: 'b', text: 'Independent security and compliance visibility' },
          { id: 'c', text: 'Application hosting isolation only' },
          { id: 'd', text: 'CDN edge routing' }
        ],
        correctOptionId: 'b',
        explanation: 'Audit accounts separate oversight controls from workload ownership boundaries.'
      },
      {
        id: 'f3',
        prompt: 'Which pattern best avoids transitive peering complexity at scale?',
        options: [
          { id: 'a', text: 'Single-account peering loops' },
          { id: 'b', text: 'Transit Gateway hub-and-spoke design' },
          { id: 'c', text: 'Manual static routes in every subnet' },
          { id: 'd', text: 'No central routing control' }
        ],
        correctOptionId: 'b',
        explanation: 'Transit Gateway centralizes routing and avoids peering mesh operational complexity.'
      },
      {
        id: 'f4',
        prompt: 'What is the strongest reason to enforce baseline controls with automation?',
        options: [
          { id: 'a', text: 'To increase configuration variance' },
          { id: 'b', text: 'To reduce human error and maintain consistency' },
          { id: 'c', text: 'To eliminate monitoring requirements' },
          { id: 'd', text: 'To avoid policy reviews' }
        ],
        correctOptionId: 'b',
        explanation: 'Automation ensures repeatable security posture across many accounts.'
      },
      {
        id: 'f5',
        prompt: 'What does drift indicate in IaC-managed environments?',
        options: [
          { id: 'a', text: 'Desired and actual state are synchronized' },
          { id: 'b', text: 'Actual infrastructure no longer matches declared state' },
          { id: 'c', text: 'No changes have occurred' },
          { id: 'd', text: 'Only billing tags are missing' }
        ],
        correctOptionId: 'b',
        explanation: 'Drift represents divergence between code and runtime infrastructure state.'
      },
      {
        id: 'f6',
        prompt: 'Which mechanism prevents concurrent Terraform state writes?',
        options: [
          { id: 'a', text: 'State locking in DynamoDB' },
          { id: 'b', text: 'CloudFront invalidations' },
          { id: 'c', text: 'Auto Scaling cooldown' },
          { id: 'd', text: 'GuardDuty suppression rules' }
        ],
        correctOptionId: 'a',
        explanation: 'Locking prevents overlapping state mutations and corruption.'
      },
      {
        id: 'f7',
        prompt: 'What is the key purpose of Service Catalog portfolios?',
        options: [
          { id: 'a', text: 'Store IAM users' },
          { id: 'b', text: 'Group approved products and control who can launch them' },
          { id: 'c', text: 'Manage CloudTrail retention' },
          { id: 'd', text: 'Replace account factory workflows' }
        ],
        correctOptionId: 'b',
        explanation: 'Portfolios package approved products and assign controlled access.'
      },
      {
        id: 'f8',
        prompt: 'Why is immutable logging essential in certification-grade environments?',
        options: [
          { id: 'a', text: 'To simplify data deletion' },
          { id: 'b', text: 'To preserve forensic integrity and compliance evidence' },
          { id: 'c', text: 'To disable incident response' },
          { id: 'd', text: 'To remove retention policies' }
        ],
        correctOptionId: 'b',
        explanation: 'Immutable logs ensure reliable audit trails and non-repudiation.'
      },
      {
        id: 'f9',
        prompt: 'What does least privilege require in practical operations?',
        options: [
          { id: 'a', text: 'Broad wildcard permissions by default' },
          { id: 'b', text: 'Scoped, task-specific permissions with periodic review' },
          { id: 'c', text: 'Permanent admin access for all engineers' },
          { id: 'd', text: 'No role separation' }
        ],
        correctOptionId: 'b',
        explanation: 'Least privilege means minimal, justified access that is regularly validated.'
      },
      {
        id: 'f10',
        prompt: 'Which statement best describes operational readiness?',
        options: [
          { id: 'a', text: 'System is complete only when architects remain required for daily tasks' },
          { id: 'b', text: 'Ops teams can run, recover, and govern the platform independently' },
          { id: 'c', text: 'No monitoring alerts should ever fire' },
          { id: 'd', text: 'All change activity is stopped permanently' }
        ],
        correctOptionId: 'b',
        explanation: 'Readiness is proven by independent operational capability with controlled processes.'
      },
      {
        id: 'f11',
        prompt: 'Which service is purpose-built for control evidence workflows?',
        options: [
          { id: 'a', text: 'AWS Audit Manager' },
          { id: 'b', text: 'AWS Route 53' },
          { id: 'c', text: 'AWS App Runner' },
          { id: 'd', text: 'Amazon MQ' }
        ],
        correctOptionId: 'a',
        explanation: 'Audit Manager assists with evidence mapping and continuous audit preparation.'
      },
      {
        id: 'f12',
        prompt: 'What role do runbooks serve in a landing zone handover?',
        options: [
          { id: 'a', text: 'Optional notes for future architects only' },
          { id: 'b', text: 'Standardized step-by-step operational procedures' },
          { id: 'c', text: 'Replacement for incident response teams' },
          { id: 'd', text: 'Alternative to logging' }
        ],
        correctOptionId: 'b',
        explanation: 'Runbooks enable consistent response and reduce operational ambiguity.'
      },
      {
        id: 'f13',
        prompt: 'What is the strongest benefit of organization-level CloudTrail?',
        options: [
          { id: 'a', text: 'Centralized API activity visibility across accounts' },
          { id: 'b', text: 'Automatic VPC route propagation' },
          { id: 'c', text: 'Lower EC2 startup latency' },
          { id: 'd', text: 'Replacement for IAM policies' }
        ],
        correctOptionId: 'a',
        explanation: 'Organization-level trails provide broad audit visibility with consistent coverage.'
      },
      {
        id: 'f14',
        prompt: 'Which practice best supports professional exam integrity for online assessment?',
        options: [
          { id: 'a', text: 'Client-only grading with hidden JavaScript answers' },
          { id: 'b', text: 'Server-side grading and persisted attempt records' },
          { id: 'c', text: 'No timer enforcement' },
          { id: 'd', text: 'Anonymous write access to result endpoints' }
        ],
        correctOptionId: 'b',
        explanation: 'Authoritative server grading and stored attempts preserve credibility and auditability.'
      },
      {
        id: 'f15',
        prompt: 'What is the key value of teacher-shareable assessment links?',
        options: [
          { id: 'a', text: 'They replace enrollment checks entirely' },
          { id: 'b', text: 'They simplify assignment while preserving mentorship accountability' },
          { id: 'c', text: 'They bypass grading workflows' },
          { id: 'd', text: 'They disable attempt tracking' }
        ],
        correctOptionId: 'b',
        explanation: 'Shareable links improve assignment flow while tracked attempts preserve instructor oversight.'
      },
      {
        id: 'f16',
        prompt: 'Why should timed assessments have a clear pre-start screen?',
        options: [
          { id: 'a', text: 'To increase confusion before attempts' },
          { id: 'b', text: 'To establish exam context, rules, and professional mindset' },
          { id: 'c', text: 'To hide pass thresholds from students' },
          { id: 'd', text: 'To prevent any review after submission' }
        ],
        correctOptionId: 'b',
        explanation: 'A structured pre-start experience sets expectations and exam discipline.'
      },
      {
        id: 'f17',
        prompt: 'What should happen when timer expiration is reached?',
        options: [
          { id: 'a', text: 'Attempt should continue indefinitely' },
          { id: 'b', text: 'Submission should be enforced and graded against saved answers' },
          { id: 'c', text: 'All answers should be deleted immediately' },
          { id: 'd', text: 'Student should restart from question one' }
        ],
        correctOptionId: 'b',
        explanation: 'Auto-submit on timeout preserves fairness and predictable exam control.'
      },
      {
        id: 'f18',
        prompt: 'Why include printable result reports for students?',
        options: [
          { id: 'a', text: 'To replace official records entirely' },
          { id: 'b', text: 'To support assignment submission workflows such as Google Classroom' },
          { id: 'c', text: 'To expose answer keys publicly' },
          { id: 'd', text: 'To avoid storing attempts server-side' }
        ],
        correctOptionId: 'b',
        explanation: 'Printable reports support academic workflow requirements while records remain verifiable.'
      },
      {
        id: 'f19',
        prompt: 'What is the best way to scale this assessment system across all courses?',
        options: [
          { id: 'a', text: 'Build one-off pages per course with custom logic' },
          { id: 'b', text: 'Use a reusable engine plus course-specific assessment data' },
          { id: 'c', text: 'Keep all questions only in textbook HTML' },
          { id: 'd', text: 'Avoid API-based grading' }
        ],
        correctOptionId: 'b',
        explanation: 'A reusable engine with structured content avoids duplication and rollout friction.'
      },
      {
        id: 'f20',
        prompt: 'Which outcome best indicates certification readiness?',
        options: [
          { id: 'a', text: 'Passing score with traceable, timed, and recorded assessment results' },
          { id: 'b', text: 'Reading the textbook without attempting assessments' },
          { id: 'c', text: 'Completing only one phase assessment' },
          { id: 'd', text: 'Skipping print and teacher review workflows' }
        ],
        correctOptionId: 'a',
        explanation: 'Readiness is demonstrated through formal, measurable, and verifiable assessment performance.'
      }
    ]
  }
]
