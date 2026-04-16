import type { CourseAssessmentDefinition } from '@/lib/assessment-types'

const courseSlug = 'devops-engineering-cloud-infrastructure'

export const devopsEngineeringAssessments: CourseAssessmentDefinition[] = [
  {
    courseSlug,
    slug: 'phase-1-foundations',
    title: 'Phase I Assessment: DevOps Foundations & Container Engineering',
    phase: 'phase-1',
    phaseLabel: 'Phase I',
    description: 'Weeks 1–5 covering DevOps principles, CI/CD, Docker, container workflows, and core Kubernetes concepts.',
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
        prompt: 'What is the primary goal of a CI/CD pipeline in a DevOps workflow?',
        options: [
          { id: 'a', text: 'To replace manual code reviews entirely' },
          { id: 'b', text: 'To automate building, testing, and deploying code changes reliably' },
          { id: 'c', text: 'To eliminate the need for version control' },
          { id: 'd', text: 'To provision cloud infrastructure only on weekends' }
        ],
        correctOptionId: 'b',
        explanation: 'CI/CD pipelines automate the software delivery lifecycle so teams can ship changes frequently and safely.'
      },
      {
        id: 'p1q2',
        prompt: 'Which statement best distinguishes a Docker container from a virtual machine?',
        options: [
          { id: 'a', text: 'Containers include a full guest OS kernel; VMs share the host kernel' },
          { id: 'b', text: 'Containers share the host OS kernel and are therefore more lightweight than VMs' },
          { id: 'c', text: 'Containers require dedicated hardware; VMs run on shared CPU' },
          { id: 'd', text: 'VMs are stateless; containers are always stateful' }
        ],
        correctOptionId: 'b',
        explanation: 'Containers share the host kernel via namespaces and cgroups, making them lighter and faster to start than full VMs.'
      },
      {
        id: 'p1q3',
        prompt: 'In a Docker image, what is the effect of each instruction in a Dockerfile?',
        options: [
          { id: 'a', text: 'Each instruction replaces the previous layer entirely' },
          { id: 'b', text: 'Each instruction creates a new read-only layer, enabling caching and reuse' },
          { id: 'c', text: 'Only the final instruction produces an artifact' },
          { id: 'd', text: 'Instructions are executed at container runtime, not build time' }
        ],
        correctOptionId: 'b',
        explanation: 'Docker uses a Union File System where each instruction adds an immutable layer, enabling build cache reuse.'
      },
      {
        id: 'p1q4',
        prompt: 'What problem does a container registry solve in a CI/CD pipeline?',
        options: [
          { id: 'a', text: 'It stores raw source code before compilation' },
          { id: 'b', text: 'It provides a centralized location to store, version, and distribute container images' },
          { id: 'c', text: 'It replaces the need for a Dockerfile in each project' },
          { id: 'd', text: 'It monitors container health at runtime' }
        ],
        correctOptionId: 'b',
        explanation: 'A registry (e.g., Docker Hub, ECR, GCR) stores versioned image artifacts that deployment pipelines can pull reliably.'
      },
      {
        id: 'p1q5',
        prompt: 'What is a Kubernetes Pod?',
        options: [
          { id: 'a', text: 'A physical server in a Kubernetes data centre' },
          { id: 'b', text: 'The smallest deployable unit in Kubernetes, representing one or more tightly coupled containers' },
          { id: 'c', text: 'A configuration file that defines cluster networking rules' },
          { id: 'd', text: 'A storage volume attached to the control plane' }
        ],
        correctOptionId: 'b',
        explanation: 'A Pod wraps one or more containers that share network namespace, localhost, and optional volumes.'
      },
      {
        id: 'p1q6',
        prompt: 'In a Kubernetes cluster, what role does the control plane play?',
        options: [
          { id: 'a', text: 'It runs application workloads directly in user-space' },
          { id: 'b', text: 'It stores container images in a local registry' },
          { id: 'c', text: 'It manages cluster state, schedules Pods, and exposes the API server' },
          { id: 'd', text: 'It handles end-user authentication only' }
        ],
        correctOptionId: 'c',
        explanation: 'The control plane components (kube-apiserver, etcd, scheduler, controller-manager) coordinate the entire cluster.'
      },
      {
        id: 'p1q7',
        prompt: 'Which principle of DevOps culture encourages small, frequent code integrations rather than large infrequent merges?',
        options: [
          { id: 'a', text: 'Infrastructure as Code' },
          { id: 'b', text: 'Continuous Integration' },
          { id: 'c', text: 'Blue-Green Deployment' },
          { id: 'd', text: 'Immutable Infrastructure' }
        ],
        correctOptionId: 'b',
        explanation: 'CI requires developers to integrate code into a shared repository frequently so issues surface early.'
      },
      {
        id: 'p1q8',
        prompt: 'What is the primary purpose of Docker Compose in a development workflow?',
        options: [
          { id: 'a', text: 'To build multi-architecture images for production clusters' },
          { id: 'b', text: 'To define and run multi-container applications on a single host using a single YAML file' },
          { id: 'c', text: 'To replace Kubernetes for large-scale production orchestration' },
          { id: 'd', text: 'To scan container images for CVEs' }
        ],
        correctOptionId: 'b',
        explanation: 'Docker Compose orchestrates multi-container local environments, making it easy to spin up dependent services together.'
      },
      {
        id: 'p1q9',
        prompt: 'Why should secrets never be baked into a Docker image at build time?',
        options: [
          { id: 'a', text: 'Docker images cannot hold text files' },
          { id: 'b', text: 'Secrets embedded in layers persist in image history and can be extracted' },
          { id: 'c', text: 'Build-time secrets cause pipelines to fail automatically' },
          { id: 'd', text: 'Kubernetes requires secrets to be passed as environment variables only' }
        ],
        correctOptionId: 'b',
        explanation: 'Image layers are immutable and inspectable; `docker history` can expose secrets even after deletion in later layers.'
      },
      {
        id: 'p1q10',
        prompt: 'What is the role of a Kubernetes Namespace?',
        options: [
          { id: 'a', text: 'To provide physical network isolation between nodes' },
          { id: 'b', text: 'To logically isolate resources within a cluster, enabling multi-team or multi-environment separation' },
          { id: 'c', text: 'To increase the number of Pods the scheduler can run' },
          { id: 'd', text: 'To replace RBAC policies in production clusters' }
        ],
        correctOptionId: 'b',
        explanation: 'Namespaces scope resource names, RBAC, and quotas, enabling safe multi-team usage of a shared cluster.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-2-kubernetes-iac',
    title: 'Phase II Assessment: Kubernetes Mastery & Infrastructure as Code',
    phase: 'phase-2',
    phaseLabel: 'Phase II',
    description: 'Weeks 6–10 covering Kubernetes workloads, networking, storage, Helm package management, and Terraform fundamentals.',
    instructions: [
      'This timed assessment evaluates Kubernetes and IaC decision-making.',
      'Answer all questions before submitting.',
      'You can review answers after grading.'
    ],
    durationMinutes: 40,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p2q1',
        prompt: 'What is the difference between a Kubernetes Deployment and a StatefulSet?',
        options: [
          { id: 'a', text: 'Deployments manage stateful databases; StatefulSets manage stateless web apps' },
          { id: 'b', text: 'Deployments manage stateless Pods with interchangeable identities; StatefulSets provide stable network IDs and ordered storage for stateful workloads' },
          { id: 'c', text: 'StatefulSets are deprecated in modern Kubernetes versions' },
          { id: 'd', text: 'Both are identical but differ only in naming convention' }
        ],
        correctOptionId: 'b',
        explanation: 'StatefulSets guarantee stable Pod names, DNS hostnames, and PersistentVolume bindings — essential for databases and distributed systems.'
      },
      {
        id: 'p2q2',
        prompt: 'Which Kubernetes Service type exposes a workload externally via a cloud load balancer?',
        options: [
          { id: 'a', text: 'ClusterIP' },
          { id: 'b', text: 'NodePort' },
          { id: 'c', text: 'LoadBalancer' },
          { id: 'd', text: 'ExternalName' }
        ],
        correctOptionId: 'c',
        explanation: 'LoadBalancer provisions a cloud-provider NLB/ALB and assigns an external IP, routing traffic into ClusterIP endpoints.'
      },
      {
        id: 'p2q3',
        prompt: 'What is the main purpose of a Kubernetes Ingress resource?',
        options: [
          { id: 'a', text: 'To define persistent storage classes for StatefulSets' },
          { id: 'b', text: 'To provide HTTP/HTTPS routing, TLS termination, and host/path-based traffic splitting for multiple services' },
          { id: 'c', text: 'To grant RBAC permissions to external users' },
          { id: 'd', text: 'To schedule Jobs at recurring intervals' }
        ],
        correctOptionId: 'b',
        explanation: 'Ingress (with an Ingress Controller such as NGINX or Traefik) centralizes HTTP-layer routing without requiring one LoadBalancer per service.'
      },
      {
        id: 'p2q4',
        prompt: 'In Kubernetes RBAC, what does a ClusterRoleBinding do?',
        options: [
          { id: 'a', text: 'Restricts a ServiceAccount to a single Namespace only' },
          { id: 'b', text: 'Grants cluster-wide permissions defined in a ClusterRole to a subject across all Namespaces' },
          { id: 'c', text: 'Encrypts etcd data at rest' },
          { id: 'd', text: 'Binds a PersistentVolume to a PersistentVolumeClaim' }
        ],
        correctOptionId: 'b',
        explanation: 'ClusterRoleBinding applies a ClusterRole across the whole cluster; use RoleBinding to scope permissions to one Namespace.'
      },
      {
        id: 'p2q5',
        prompt: 'What problem does Helm solve in Kubernetes deployments?',
        options: [
          { id: 'a', text: 'It automatically provisions cloud VPCs and subnets for clusters' },
          { id: 'b', text: 'It packages, versions, and templates Kubernetes manifests so complex applications can be installed and upgraded repeatably' },
          { id: 'c', text: 'It replaces kubectl with a GUI dashboard' },
          { id: 'd', text: 'It monitors resource utilisation and scales nodes automatically' }
        ],
        correctOptionId: 'b',
        explanation: 'Helm charts bundle Kubernetes resources with Go templates and values files, enabling versioned, parameterisable releases.'
      },
      {
        id: 'p2q6',
        prompt: 'In Terraform, what is the purpose of a "state file"?',
        options: [
          { id: 'a', text: 'A log of all terminal commands run during provisioning' },
          { id: 'b', text: 'A record of the real infrastructure Terraform has deployed, used to compute plan diffs and detect drift' },
          { id: 'c', text: 'A YAML manifest for Kubernetes resources' },
          { id: 'd', text: 'A backup of cloud provider credentials' }
        ],
        correctOptionId: 'b',
        explanation: 'The state file maps Terraform resource addresses to real infrastructure IDs — it is the source of truth for `plan` and `apply`.'
      },
      {
        id: 'p2q7',
        prompt: 'What is a Kubernetes HorizontalPodAutoscaler (HPA)?',
        options: [
          { id: 'a', text: 'A controller that increases node count when cluster CPU exceeds a threshold' },
          { id: 'b', text: 'A resource that automatically scales the number of Pod replicas based on CPU, memory, or custom metrics' },
          { id: 'c', text: 'A storage provisioner for dynamically creating PersistentVolumes' },
          { id: 'd', text: 'A policy that limits egress traffic per Namespace' }
        ],
        correctOptionId: 'b',
        explanation: 'HPA adjusts Deployment/ReplicaSet replica count in response to load, ensuring capacity without over-provisioning.'
      },
      {
        id: 'p2q8',
        prompt: 'Why should Terraform remote state be stored in a shared backend such as S3 with DynamoDB locking?',
        options: [
          { id: 'a', text: 'Because local state files cannot contain more than 100 resources' },
          { id: 'b', text: 'To enable team collaboration, prevent concurrent apply conflicts via state locking, and ensure state durability' },
          { id: 'c', text: 'Because Terraform requires a cloud database to execute any plan' },
          { id: 'd', text: 'To bypass the need for access credentials in CI pipelines' }
        ],
        correctOptionId: 'b',
        explanation: 'Remote state allows teams to share infrastructure state safely, and locking prevents two engineers from applying changes simultaneously.'
      },
      {
        id: 'p2q9',
        prompt: 'What resource in Kubernetes is used to decouple a pod\'s storage request from the underlying storage implementation?',
        options: [
          { id: 'a', text: 'ConfigMap' },
          { id: 'b', text: 'PersistentVolumeClaim (PVC)' },
          { id: 'c', text: 'ServiceAccount' },
          { id: 'd', text: 'NetworkPolicy' }
        ],
        correctOptionId: 'b',
        explanation: 'A PVC is a user\'s storage request; Kubernetes binds it to an available PersistentVolume, hiding provider-specific implementation.'
      },
      {
        id: 'p2q10',
        prompt: 'Which Terraform command shows proposed infrastructure changes without applying them?',
        options: [
          { id: 'a', text: 'terraform validate' },
          { id: 'b', text: 'terraform init' },
          { id: 'c', text: 'terraform plan' },
          { id: 'd', text: 'terraform output' }
        ],
        correctOptionId: 'c',
        explanation: '`terraform plan` compares desired config to current state and prints a diff of resources to create, update, or destroy.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-3-platform-engineering',
    title: 'Phase III Assessment: Platform Engineering & Observability',
    phase: 'phase-3',
    phaseLabel: 'Phase III',
    description: 'Weeks 11–15 covering advanced Terraform patterns, GitOps, monitoring/logging stacks, advanced CI/CD, and progressive delivery.',
    instructions: [
      'This assessment evaluates platform engineering and observability practices.',
      'All questions are multiple-choice with one correct answer.',
      'Review your answers before final submission.'
    ],
    durationMinutes: 40,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p3q1',
        prompt: 'What is the primary benefit of organising Terraform code into reusable modules?',
        options: [
          { id: 'a', text: 'Modules allow Terraform to skip state file creation' },
          { id: 'b', text: 'Modules encapsulate patterns so they can be versioned, tested, and composed across multiple environments' },
          { id: 'c', text: 'Modules eliminate the need for a remote backend' },
          { id: 'd', text: 'Modules replace Helm charts entirely in Kubernetes projects' }
        ],
        correctOptionId: 'b',
        explanation: 'Reusable modules enforce DRY infrastructure design and allow teams to share approved patterns with version pinning.'
      },
      {
        id: 'p3q2',
        prompt: 'What is GitOps, and which tool is most commonly associated with Kubernetes-native GitOps delivery?',
        options: [
          { id: 'a', text: 'GitOps is branch naming convention; Jenkins is the standard tool' },
          { id: 'b', text: 'GitOps uses Git as the single source of truth for declarative infrastructure; Argo CD is the dominant Kubernetes GitOps tool' },
          { id: 'c', text: 'GitOps means every commit triggers a full VM rebuild; Terraform implements it' },
          { id: 'd', text: 'GitOps is a monorepo strategy; GitHub Actions is the only valid implementation' }
        ],
        correctOptionId: 'b',
        explanation: 'In GitOps, the desired state lives in Git; Argo CD continuously reconciles the cluster to match that state automatically.'
      },
      {
        id: 'p3q3',
        prompt: 'In the "Four Golden Signals" of SRE, what does "saturation" measure?',
        options: [
          { id: 'a', text: 'The number of successful HTTP requests per minute' },
          { id: 'b', text: 'The fraction of a constrained resource (CPU, memory, connection pool) that is in use' },
          { id: 'c', text: 'The elapsed time between request receipt and response' },
          { id: 'd', text: 'The percentage of requests returning 5xx errors' }
        ],
        correctOptionId: 'b',
        explanation: 'Saturation measures how "full" a resource is; high saturation predicts imminent degradation before errors appear.'
      },
      {
        id: 'p3q4',
        prompt: 'What is a Prometheus scrape job, and what does it collect?',
        options: [
          { id: 'a', text: 'A cron task that pushes infrastructure logs to an S3 bucket' },
          { id: 'b', text: 'A periodic HTTP pull of a /metrics endpoint exposing time-series metric data in the Prometheus exposition format' },
          { id: 'c', text: 'A Jenkins pipeline that deletes old container images' },
          { id: 'd', text: 'A Kubernetes Job that checks DNS resolution across pods' }
        ],
        correctOptionId: 'b',
        explanation: 'Prometheus uses a pull model; scrape jobs periodically fetch /metrics from targets and store the samples in its TSDB.'
      },
      {
        id: 'p3q5',
        prompt: 'What is the purpose of a Kubernetes NetworkPolicy?',
        options: [
          { id: 'a', text: 'To specify CPU and memory resource limits for each Pod' },
          { id: 'b', text: 'To define ingress and egress traffic rules at the Pod level, enforcing micro-segmentation within the cluster' },
          { id: 'c', text: 'To automatically restart Pods that fail liveness probes' },
          { id: 'd', text: 'To store TLS certificates for Ingress controllers' }
        ],
        correctOptionId: 'b',
        explanation: 'NetworkPolicy enables zero-trust networking inside a cluster by explicitly allowing only required Pod-to-Pod communication.'
      },
      {
        id: 'p3q6',
        prompt: 'What is a canary deployment strategy?',
        options: [
          { id: 'a', text: 'Replacing 100% of instances at once after a brief traffic pause' },
          { id: 'b', text: 'Routing a small percentage of production traffic to a new version to validate it before full rollout' },
          { id: 'c', text: 'Running two identical production environments and switching DNS at cutover' },
          { id: 'd', text: 'Deploying to staging only and never to production' }
        ],
        correctOptionId: 'b',
        explanation: 'Canary releases progressively increase traffic to a new version, limiting blast radius when regressions occur.'
      },
      {
        id: 'p3q7',
        prompt: 'Why is a structured logging format (e.g., JSON) preferred over plain-text logs in distributed systems?',
        options: [
          { id: 'a', text: 'JSON logs are smaller and compress better than plain text' },
          { id: 'b', text: 'Structured logs enable machine parsing, filtering, and aggregation across thousands of service instances without custom regex' },
          { id: 'c', text: 'Plain-text logs are not supported by Kubernetes' },
          { id: 'd', text: 'JSON is required by cloud providers for billing log analysis' }
        ],
        correctOptionId: 'b',
        explanation: 'Structured logs carry consistent fields (level, trace_id, service) that log aggregation platforms index for fast querying.'
      },
      {
        id: 'p3q8',
        prompt: 'What does the Terraform `for_each` meta-argument allow you to do?',
        options: [
          { id: 'a', text: 'Loop over files in a directory and upload them to S3' },
          { id: 'b', text: 'Create multiple resource instances from a map or set, giving each instance a unique key and configuration' },
          { id: 'c', text: 'Execute a Bash script for every module in the root configuration' },
          { id: 'd', text: 'Run a plan against all workspaces simultaneously' }
        ],
        correctOptionId: 'b',
        explanation: '`for_each` replaces brittle `count` indexing with stable map-key-based addressing, avoiding destructive reindexing when items are removed.'
      },
      {
        id: 'p3q9',
        prompt: 'What is a blue-green deployment and what is its primary advantage over a rolling update?',
        options: [
          { id: 'a', text: 'Blue-green replaces containers one at a time; rolling updates replace all at once' },
          { id: 'b', text: 'Blue-green maintains two identical environments and switches traffic instantly, allowing zero-downtime cutover and instant full rollback' },
          { id: 'c', text: 'Blue-green is only possible in bare-metal environments' },
          { id: 'd', text: 'Blue-green requires twice the code but half the infrastructure' }
        ],
        correctOptionId: 'b',
        explanation: 'Blue-green enables atomic traffic switching and immediate full rollback by simply redirecting back to the previous environment.'
      },
      {
        id: 'p3q10',
        prompt: 'In an Argo CD GitOps model, what happens when someone manually edits a resource directly in the cluster (outside of Git)?',
        options: [
          { id: 'a', text: 'Argo CD immediately deletes the resource to protect the cluster' },
          { id: 'b', text: 'Argo CD detects the drift and marks the application as "OutOfSync," then reconciles it back to the Git-defined state' },
          { id: 'c', text: 'The change persists permanently since Argo CD only reconciles on Git push events' },
          { id: 'd', text: 'Argo CD triggers a new pipeline run that re-deploys from scratch' }
        ],
        correctOptionId: 'b',
        explanation: 'Argo CD continuously watches cluster state; any deviation from Git is surfaced as drift and corrected on the next sync cycle.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'phase-4-production-security',
    title: 'Phase IV Assessment: Production Excellence & DevSecOps',
    phase: 'phase-4',
    phaseLabel: 'Phase IV',
    description: 'Weeks 16–20 covering service mesh, SRE observability, DevSecOps security engineering, cost optimisation, and capstone delivery.',
    instructions: [
      'This assessment covers production-grade engineering and security practices.',
      'Read each question carefully before selecting your answer.',
      'You may change answers before final submission.'
    ],
    durationMinutes: 40,
    passPercentage: 72,
    totalQuestions: 10,
    questions: [
      {
        id: 'p4q1',
        prompt: 'What is a service mesh, and what operational problem does it solve?',
        options: [
          { id: 'a', text: 'A service mesh is a CDN layer that caches microservice responses globally' },
          { id: 'b', text: 'A service mesh is a dedicated infrastructure layer (e.g., Istio, Linkerd) that handles service-to-service communication, providing mTLS, traffic management, and observability without code changes' },
          { id: 'c', text: 'A service mesh replaces the Kubernetes API server with a distributed proxy' },
          { id: 'd', text: 'A service mesh is a DNS-based routing layer for multi-cloud deployments only' }
        ],
        correctOptionId: 'b',
        explanation: 'A service mesh externalises networking concerns (mTLS encryption, retries, circuit breaking, telemetry) into sidecar proxies, decoupling them from application code.'
      },
      {
        id: 'p4q2',
        prompt: 'What is an SLO (Service Level Objective) and why does it guide engineering decisions?',
        options: [
          { id: 'a', text: 'An SLO is the maximum budget allocated for a microservice team' },
          { id: 'b', text: 'An SLO is a target reliability level (e.g., 99.9% availability) that defines acceptable risk, guides error budget allocation, and determines when to invest in reliability vs. features' },
          { id: 'c', text: 'An SLO is a legal contract between the organisation and a cloud provider' },
          { id: 'd', text: 'An SLO is a Kubernetes resource type for defining autoscaling thresholds' }
        ],
        correctOptionId: 'b',
        explanation: 'SLOs translate reliability into an actionable error budget — when the budget is consumed, reliability work takes priority over feature delivery.'
      },
      {
        id: 'p4q3',
        prompt: 'In DevSecOps, what does "shift left" mean regarding security testing?',
        options: [
          { id: 'a', text: 'Moving production monitoring dashboards to a left-panel layout' },
          { id: 'b', text: 'Integrating security scanning (SAST, SCA, image scanning) earlier in the development pipeline so vulnerabilities are caught before deployment' },
          { id: 'c', text: 'Requiring security approvals only after production deployment' },
          { id: 'd', text: 'Restricting developer access to left-side environments such as dev and staging' }
        ],
        correctOptionId: 'b',
        explanation: 'Shift-left reduces the cost and risk of fixing vulnerabilities by detecting them at commit or PR stage rather than after release.'
      },
      {
        id: 'p4q4',
        prompt: 'What is mutual TLS (mTLS) and where is it commonly enforced in cloud-native systems?',
        options: [
          { id: 'a', text: 'mTLS is one-way certificate validation used by public-facing load balancers' },
          { id: 'b', text: 'mTLS requires both parties in a connection to present certificates, providing identity verification and encrypted channels — commonly enforced by service meshes for east-west traffic' },
          { id: 'c', text: 'mTLS replaces Kubernetes RBAC for Pod-level authorization' },
          { id: 'd', text: 'mTLS is only applicable to external API gateways, not internal service communication' }
        ],
        correctOptionId: 'b',
        explanation: 'mTLS authenticates both client and server, preventing lateral movement in compromised environments and encrypting all internal service traffic.'
      },
      {
        id: 'p4q5',
        prompt: 'What is a Kubernetes Pod Disruption Budget (PDB) and when should you define one?',
        options: [
          { id: 'a', text: 'A PDB sets the maximum CPU burst a Pod can consume during disruptions' },
          { id: 'b', text: 'A PDB specifies how many Pod replicas must remain available during voluntary disruptions (e.g., node drains, rolling updates), protecting high-availability workloads' },
          { id: 'c', text: 'A PDB is a cost governance policy that stops Pods exceeding a monthly cloud spend' },
          { id: 'd', text: 'A PDB defines the rollback window for a Helm release' }
        ],
        correctOptionId: 'b',
        explanation: 'PDBs prevent cluster operations from evicting too many Pods at once, ensuring quorum-sensitive workloads stay available during maintenance.'
      },
      {
        id: 'p4q6',
        prompt: 'Which Kubernetes resource enables automatic secret rotation by referencing an external secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault)?',
        options: [
          { id: 'a', text: 'ConfigMap with an encrypted data field' },
          { id: 'b', text: 'ExternalSecret (External Secrets Operator) that syncs secrets from an external provider into Kubernetes Secrets' },
          { id: 'c', text: 'A CronJob that patches Secrets on a schedule using kubectl' },
          { id: 'd', text: 'A Kubernetes native Secret with the `auto-rotate: true` annotation' }
        ],
        correctOptionId: 'b',
        explanation: 'External Secrets Operator decouples secret lifecycle from Kubernetes, pulling from trusted vaults and updating Secrets automatically when values rotate.'
      },
      {
        id: 'p4q7',
        prompt: 'What cloud cost optimisation technique does Kubernetes Cluster Autoscaler implement?',
        options: [
          { id: 'a', text: 'It buys Reserved Instances automatically based on historical usage' },
          { id: 'b', text: 'It scales cluster node count up when Pods are unschedulable and down when nodes are underutilised, reducing idle compute spend' },
          { id: 'c', text: 'It removes Pods exceeding memory limits to prevent cloud billing overruns' },
          { id: 'd', text: 'It compresses container images to reduce egress data transfer costs' }
        ],
        correctOptionId: 'b',
        explanation: 'Cluster Autoscaler dynamically adjusts node pool size so the cluster never pays for idle nodes while still meeting scheduling demand.'
      },
      {
        id: 'p4q8',
        prompt: 'What is OPA (Open Policy Agent) and how does it function in a Kubernetes admission control pipeline?',
        options: [
          { id: 'a', text: 'OPA is a runtime container scan tool that detects CVEs in running images' },
          { id: 'b', text: 'OPA is a general-purpose policy engine; as a ValidatingWebhook, it evaluates Kubernetes API requests against Rego policies and accepts or rejects resources before they are persisted' },
          { id: 'c', text: 'OPA is a Kubernetes Operator that manages Prometheus alert rules' },
          { id: 'd', text: 'OPA replaces etcd as the Kubernetes state store in security-hardened clusters' }
        ],
        correctOptionId: 'b',
        explanation: 'OPA/Gatekeeper acts as an admission webhook, applying custom Rego policies (e.g., prohibiting privileged containers or enforcing label standards) before objects are created or updated.'
      },
      {
        id: 'p4q9',
        prompt: 'In a capstone executive handover package, which document is most critical for enabling a new team to operate the platform?',
        options: [
          { id: 'a', text: 'A list of all Docker image tags deployed so far' },
          { id: 'b', text: 'An Architecture Decision Record (ADR) log paired with running playbooks, SLO dashboards, and incident response procedures' },
          { id: 'c', text: 'A personal log of debugging sessions from the build phase' },
          { id: 'd', text: 'A single README pointing to the primary Git repository' }
        ],
        correctOptionId: 'b',
        explanation: 'Operational continuity depends on documented decisions (ADRs), proven runbooks, observable SLOs, and tested incident procedures — not just code access.'
      },
      {
        id: 'p4q10',
        prompt: 'What distinguishes a production-grade infrastructure from a demo environment in terms of observability?',
        options: [
          { id: 'a', text: 'Production environments add more colourful Grafana themes' },
          { id: 'b', text: 'Production observability includes correlated traces, structured logs, defined SLOs with error budgets, actionable alerts, and documented runbooks tied to each alert' },
          { id: 'c', text: 'Production environments use only cloud-native monitoring with no third-party tools' },
          { id: 'd', text: 'Production observability requires a dedicated team of 10 or more SREs' }
        ],
        correctOptionId: 'b',
        explanation: 'True production observability is not just metrics collection — it connects signals to SLOs, routes alerts to runbooks, and enables fast incident triage.'
      }
    ]
  },
  {
    courseSlug,
    slug: 'final-certification',
    title: 'Final Certification: DevOps & Cloud Infrastructure Engineer',
    phase: 'final',
    phaseLabel: 'Final Certification',
    description: 'Comprehensive assessment spanning all four phases: containers, Kubernetes, IaC, platform engineering, observability, and production security.',
    instructions: [
      'This is the comprehensive certification assessment.',
      'You must achieve 75% or above to earn your certificate of completion.',
      'All 20 questions must be answered before submission.',
      'This assessment is timed — manage your time per question carefully.'
    ],
    durationMinutes: 70,
    passPercentage: 75,
    totalQuestions: 20,
    questions: [
      {
        id: 'fq1',
        prompt: 'Which statement best describes the DevOps principle of "Infrastructure as Code"?',
        options: [
          { id: 'a', text: 'Documenting all server hostnames in a spreadsheet' },
          { id: 'b', text: 'Provisioning and managing infrastructure through machine-readable configuration files stored in version control' },
          { id: 'c', text: 'Writing application business logic in Bash scripts' },
          { id: 'd', text: 'Replacing infrastructure teams with software developers' }
        ],
        correctOptionId: 'b',
        explanation: 'IaC treats infrastructure like application code — versioned, testable, and repeatable — eliminating configuration drift and enabling automation.'
      },
      {
        id: 'fq2',
        prompt: 'What Dockerfile instruction sets the base image for a Docker build?',
        options: [
          { id: 'a', text: 'BASE' },
          { id: 'b', text: 'IMAGE' },
          { id: 'c', text: 'FROM' },
          { id: 'd', text: 'START' }
        ],
        correctOptionId: 'c',
        explanation: 'Every Dockerfile must begin with FROM to declare the parent image from which subsequent layers are built.'
      },
      {
        id: 'fq3',
        prompt: 'A Kubernetes Deployment has 3 replicas. If 2 Pods crash simultaneously, what component is responsible for recreating them?',
        options: [
          { id: 'a', text: 'kube-scheduler' },
          { id: 'b', text: 'kube-apiserver' },
          { id: 'c', text: 'ReplicaSet controller within the Deployment controller' },
          { id: 'd', text: 'kubelet on each worker node independently' }
        ],
        correctOptionId: 'c',
        explanation: 'The Deployment controller manages a ReplicaSet that continuously reconciles actual Pod count to the desired replica count.'
      },
      {
        id: 'fq4',
        prompt: 'A Helm `values.yaml` file overrides defaults in which part of a Helm chart?',
        options: [
          { id: 'a', text: 'The NOTES.txt post-install message' },
          { id: 'b', text: 'The templates/ directory manifests via Go template variable injection' },
          { id: 'c', text: 'The Chart.yaml metadata file only' },
          { id: 'd', text: 'The Kubernetes API server admission webhooks' }
        ],
        correctOptionId: 'b',
        explanation: 'Helm renders templates using Go templating, substituting values from values.yaml (and --set overrides) into manifest files at install time.'
      },
      {
        id: 'fq5',
        prompt: 'In Terraform, what does `terraform import` do?',
        options: [
          { id: 'a', text: 'Imports a module from the Terraform registry into the working directory' },
          { id: 'b', text: 'Associates an existing real-world resource with a Terraform state resource address without destroying it' },
          { id: 'c', text: 'Copies a remote state file into the local directory' },
          { id: 'd', text: 'Pulls the latest provider version from the registry' }
        ],
        correctOptionId: 'b',
        explanation: '`terraform import` lets you bring pre-existing infrastructure under Terraform management by mapping its provider ID to a state address.'
      },
      {
        id: 'fq6',
        prompt: 'Which Kubernetes probe type triggers a container restart when it fails?',
        options: [
          { id: 'a', text: 'readinessProbe' },
          { id: 'b', text: 'startupProbe only during startup' },
          { id: 'c', text: 'livenessProbe' },
          { id: 'd', text: 'execProbe' }
        ],
        correctOptionId: 'c',
        explanation: 'livenessProbe detects deadlocked containers; failure triggers kubelet to kill and restart the container per the Pod\'s restartPolicy.'
      },
      {
        id: 'fq7',
        prompt: 'What is the key difference between a Prometheus Counter and a Gauge metric type?',
        options: [
          { id: 'a', text: 'Counters can decrease; Gauges only increase' },
          { id: 'b', text: 'Counters monotonically increase (e.g., total requests); Gauges can go up or down (e.g., current memory usage)' },
          { id: 'c', text: 'Gauges are only for infrastructure metrics; Counters are only for application metrics' },
          { id: 'd', text: 'Both are identical but differ in how they are visualised in Grafana' }
        ],
        correctOptionId: 'b',
        explanation: 'Counters never decrease (except on reset); Gauges track instantaneous values that fluctuate over time.'
      },
      {
        id: 'fq8',
        prompt: 'What is the purpose of a Kubernetes ConfigMap?',
        options: [
          { id: 'a', text: 'To store encrypted credentials for database connections' },
          { id: 'b', text: 'To externalise non-sensitive configuration data (environment variables, config files) from container images' },
          { id: 'c', text: 'To define Pod resource requests and limits' },
          { id: 'd', text: 'To configure cluster-level network policies' }
        ],
        correctOptionId: 'b',
        explanation: 'ConfigMaps keep configuration separate from container images, enabling environment-specific settings without rebuilding.'
      },
      {
        id: 'fq9',
        prompt: 'In a GitOps workflow, which action should trigger a production deployment?',
        options: [
          { id: 'a', text: 'A developer running `kubectl apply` from their local laptop' },
          { id: 'b', text: 'A merge to the main branch in the Git repository that holds the desired cluster state' },
          { id: 'c', text: 'A scheduled cron job that applies all pending manifests at midnight' },
          { id: 'd', text: 'A Slack message to the DevOps team channel' }
        ],
        correctOptionId: 'b',
        explanation: 'GitOps mandates Git as the sole trigger for changes; automated reconciliation (Argo CD, Flux) detects the merge and applies the new state.'
      },
      {
        id: 'fq10',
        prompt: 'What does DORA (DevOps Research and Assessment) identify as the four key metrics for measuring software delivery performance?',
        options: [
          { id: 'a', text: 'Lines of code, test coverage, sprint velocity, and bug count' },
          { id: 'b', text: 'Deployment frequency, lead time for changes, time to restore service, and change failure rate' },
          { id: 'c', text: 'Uptime, error rate, throughput, and cost per deployment' },
          { id: 'd', text: 'CI pass rate, PR review time, container image size, and security scan score' }
        ],
        correctOptionId: 'b',
        explanation: 'DORA\'s four metrics measure delivery speed (deployment frequency, lead time) and stability (MTTR, change failure rate).'
      },
      {
        id: 'fq11',
        prompt: 'What is the purpose of Istio\'s VirtualService resource?',
        options: [
          { id: 'a', text: 'To provision virtual machines alongside containers in a Kubernetes cluster' },
          { id: 'b', text: 'To define fine-grained traffic routing rules (weight-based, header-match, retries, timeouts) for services in an Istio mesh' },
          { id: 'c', text: 'To store TLS certificates for all services in the mesh' },
          { id: 'd', text: 'To replace Kubernetes Services with a more performant proxy' }
        ],
        correctOptionId: 'b',
        explanation: 'VirtualService configures the Envoy proxies with rich routing logic, enabling canary releases, A/B testing, and fault injection within the mesh.'
      },
      {
        id: 'fq12',
        prompt: 'In a SBOM (Software Bill of Materials), what information does it capture?',
        options: [
          { id: 'a', text: 'The billing breakdown for cloud resource costs per service' },
          { id: 'b', text: 'A complete inventory of all software components, libraries, and dependencies in an artefact, including versions and licences' },
          { id: 'c', text: 'A diagram of microservice communication patterns' },
          { id: 'd', text: 'A compliance checklist for SOC 2 audits' }
        ],
        correctOptionId: 'b',
        explanation: 'An SBOM enables rapid vulnerability response by mapping CVEs to specific components in your software supply chain.'
      },
      {
        id: 'fq13',
        prompt: 'Which Kubernetes feature allows you to run Pods only on nodes matching specific labels (e.g., GPU nodes, spot instances)?',
        options: [
          { id: 'a', text: 'PodAffinity only' },
          { id: 'b', text: 'NodeSelector or nodeAffinity in the Pod spec' },
          { id: 'c', text: 'LimitRange resource in the Namespace' },
          { id: 'd', text: 'PriorityClass assigned to the Deployment' }
        ],
        correctOptionId: 'b',
        explanation: 'NodeSelector/nodeAffinity constrains which nodes are eligible for Pod scheduling by matching node labels.'
      },
      {
        id: 'fq14',
        prompt: 'What does a Kubernetes ResourceQuota enforce within a Namespace?',
        options: [
          { id: 'a', text: 'The maximum number of events stored in etcd' },
          { id: 'b', text: 'Aggregate limits on total resource consumption (CPU, memory, object count) across all Pods and objects in a Namespace' },
          { id: 'c', text: 'Network egress bandwidth caps per Pod' },
          { id: 'd', text: 'The maximum Helm release history retained per namespace' }
        ],
        correctOptionId: 'b',
        explanation: 'ResourceQuotas prevent one team from consuming all cluster resources, enabling fair multi-tenant cluster sharing.'
      },
      {
        id: 'fq15',
        prompt: 'What is distributed tracing and which standard propagation format enables interoperability across tools like Jaeger and Zipkin?',
        options: [
          { id: 'a', text: 'Distributed tracing measures DNS resolution time; Prometheus format propagates trace context' },
          { id: 'b', text: 'Distributed tracing follows a request across service boundaries; W3C TraceContext (or B3) headers propagate trace and span IDs between services' },
          { id: 'c', text: 'Distributed tracing is a log aggregation pattern; Syslog format is the standard' },
          { id: 'd', text: 'Distributed tracing only works within a single container and does not cross service boundaries' }
        ],
        correctOptionId: 'b',
        explanation: 'Distributed tracing reconstructs the journey of a request across microservices using injected trace context headers for correlation.'
      },
      {
        id: 'fq16',
        prompt: 'According to the 12-Factor App methodology, how should application configuration (database URLs, API keys) be managed?',
        options: [
          { id: 'a', text: 'Hard-coded in source code for simplicity' },
          { id: 'b', text: 'Stored in environment variables, separate from the codebase, so the same build can run in any environment' },
          { id: 'c', text: 'Committed to a private branch that is never merged to main' },
          { id: 'd', text: 'Encrypted inside the Docker image at build time' }
        ],
        correctOptionId: 'b',
        explanation: '12-Factor Factor III requires strict config separation via environment variables, enabling the same artefact to serve dev, staging, and production.'
      },
      {
        id: 'fq17',
        prompt: 'What is the primary risk of using `:latest` as a Docker image tag in production pipelines?',
        options: [
          { id: 'a', text: 'The `:latest` tag is blocked by most container registries in production by policy' },
          { id: 'b', text: 'It is a mutable pointer that can resolve to a different image on each pull, making deployments non-deterministic and rollbacks unreliable' },
          { id: 'c', text: '`:latest` images are always uncompressed and too large for production nodes' },
          { id: 'd', text: 'Container runtimes ignore `:latest` in manifests and always use cached versions' }
        ],
        correctOptionId: 'b',
        explanation: 'Pinning image tags to an immutable digest or semantic version guarantees reproducibility and safe rollbacks.'
      },
      {
        id: 'fq18',
        prompt: 'What is cost allocation tagging in a cloud environment and why is it essential for FinOps?',
        options: [
          { id: 'a', text: 'A security control that restricts API calls by resource owner' },
          { id: 'b', text: 'Attaching metadata tags (e.g., team, environment, cost-centre) to cloud resources so costs can be attributed, analysed, and charged back to the responsible team' },
          { id: 'c', text: 'A billing report format exported monthly by cloud providers' },
          { id: 'd', text: 'A Kubernetes annotation that limits Per-Pod cloud spending' }
        ],
        correctOptionId: 'b',
        explanation: 'Consistent tagging enables granular cost visibility, accountability, and optimisation decision-making at the team and workload level.'
      },
      {
        id: 'fq19',
        prompt: 'What is a postmortem (incident retrospective) and what makes it blameless?',
        options: [
          { id: 'a', text: 'A customer-facing report explaining downtime; it is blameless because legal liability prevents naming individuals' },
          { id: 'b', text: 'A structured review of an incident that identifies root causes, contributing factors, and action items without assigning personal blame, treating failures as systemic learning opportunities' },
          { id: 'c', text: 'A performance review process that evaluates on-call engineers after major outages' },
          { id: 'd', text: 'An automated report generated by APM tools after each deployment' }
        ],
        correctOptionId: 'b',
        explanation: 'Blameless postmortems focus on processes and systems rather than individuals, creating psychological safety and accelerating organisational learning.'
      },
      {
        id: 'fq20',
        prompt: 'Which practise is most indicative of a mature DevSecOps pipeline?',
        options: [
          { id: 'a', text: 'Running penetration tests annually and storing results in a shared folder' },
          { id: 'b', text: 'Integrating SAST, DAST, SCA, container image scanning, and secret detection as automated gates in CI/CD so every commit is security-validated before it reaches production' },
          { id: 'c', text: 'Designating one security engineer to review all PRs manually before merge' },
          { id: 'd', text: 'Encrypting all S3 buckets and considering security complete' }
        ],
        correctOptionId: 'b',
        explanation: 'Mature DevSecOps embeds automated security gates throughout the pipeline so security is continuous and proportional to delivery velocity.'
      }
    ]
  }
]
