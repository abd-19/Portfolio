// All portfolio content lives here (source: Abdullah Mohammed CV).
// Phone number is intentionally left off the public site.

export const profile = {
  name: 'Abdullah Mohammed',
  handle: 'abdullah',
  role: 'IT System Administrator — Linux, Private Cloud & Automation',
  shortRole: 'IT System Administrator',
  location: 'Baghdad, Iraq',
  years: 4,
  tagline: 'I run the Linux servers, private cloud and monitoring that keep an ISP online.',
  about: [
    'Computer Engineering graduate who went from fixing PCs to running an ISP’s private cloud.',
    'I automate repetitive work with Ansible, Python and GitLab CI, and keep it all monitored.',
  ],
  github: '', // add your GitHub URL here to show it on the site
  linkedin: 'https://linkedin.com/in/abdullah-mohammed-552159302',
  // Hero camera feed. Put your photo in /public and set its file name here ('' hides the feed).
  photo: '',
  // where the face sits in the photo, in % of the image: the tracking box locks onto this
  face: { x: 30, y: 14, w: 40, h: 46 },
}

// Headline numbers shown in the hero — every one comes straight from the CV
export const stats = [
  { value: '4+', label: 'years in IT' },
  { value: '1,500+', label: 'VMs managed' },
  { value: '50+', label: 'servers hands-on' },
  { value: '1,500+', label: 'tickets resolved' },
  { value: '5', label: 'certifications', accent: true },
]

export type SkillGroup = { label: string; note: string; tools: string[] }

export const skillGroups: SkillGroup[] = [
  {
    label: 'Operating Systems',
    note: 'Install, patch, harden, troubleshoot',
    tools: ['RHEL', 'CentOS', 'AlmaLinux', 'Rocky Linux', 'Ubuntu', 'Debian', 'Windows'],
  },
  {
    label: 'Virtualization & Cloud',
    note: 'Private cloud on KVM',
    tools: ['Apache CloudStack', 'KVM / libvirt', 'VMware ESXi', 'vSphere'],
  },
  { label: 'Containers', note: 'Workloads in production', tools: ['Kubernetes', 'Docker', 'Podman', 'ArgoCD', 'Kustomize'] },
  {
    label: 'Monitoring',
    note: 'Know before users do',
    tools: ['Zabbix', 'Prometheus', 'Grafana', 'Exporters'],
  },
  {
    label: 'Automation & CI/CD',
    note: 'Do it twice, script it',
    tools: ['Ansible', 'GitLab CI/CD', 'Python', 'Bash', 'Git'],
  },
  {
    label: 'Networking',
    note: 'From cabling to routing',
    tools: ['TCP/IP', 'DNS', 'DHCP', 'VLANs', 'LAN / WAN', 'Subnetting', 'MikroTik', 'Cisco CUCM'],
  },
  {
    label: 'Storage & Backup',
    note: 'Data that survives bad days',
    tools: ['LVM', 'RAID', 'Pure FlashArray', 'Pure FlashBlade', 'Dell PowerStore', 'Backup & DR'],
  },
  {
    label: 'Server Hardware',
    note: 'Racked, cabled, maintained',
    tools: ['Dell', 'HPE', 'Cisco', 'ITSM', 'Documentation'],
  },
]

export type Cert = { short: string; name: string; id: string; desc: string }

export const certs: Cert[] = [
  {
    short: 'RHCSA',
    name: 'Red Hat Certified System Administrator',
    id: '250-096-559',
    desc: 'Core Linux administration: installation, user/group management, file systems, storage, networking, SELinux and system troubleshooting on RHEL.',
  },
  {
    short: 'RHCE',
    name: 'Red Hat Certified Engineer in Enterprise Linux',
    id: '250-096-559',
    desc: 'Advanced Linux administration on RHEL: system services, security hardening, advanced SELinux, storage management and performance tuning.',
  },
  {
    short: 'RHCE · Ansible',
    name: 'Red Hat Certified Engineer in Ansible',
    id: '250-096-559',
    desc: 'Automating enterprise IT with Ansible: playbooks, roles, variables, Jinja2 templates, Ansible Vault and large-scale infrastructure.',
  },
  {
    short: 'RH Adv. Ansible',
    name: 'Red Hat Certified Advanced System Administrator in Ansible',
    id: '250-096-559',
    desc: 'Advanced Ansible automation: complex playbooks, custom modules, dynamic inventories, testing with Molecule and CI/CD integration.',
  },
  {
    short: 'ZCS',
    name: 'Zabbix Certified Specialist',
    id: 'CS-2602-097',
    desc: 'Deploying and managing Zabbix: server/proxy setup, host and template configuration, SNMP and agent monitoring, trigger/alert workflows and dashboards.',
  },
]

export const training = [
  {
    code: 'RH104',
    name: 'Getting Started with Linux Fundamentals',
    desc: 'Command line, shell environments, file system navigation, text editing, file and directory management, permissions and core system configuration.',
  },
  {
    code: 'RH124 / RH134',
    name: 'Red Hat System Administration I & II',
    desc: 'RHEL fundamentals, systemd services, DNF package management, shell scripting, storage management, containers and security.',
  },
]

export const softSkills = [
  'Adapts fast to new systems',
  'Clear with technical and non-technical people',
  'Customer-focused',
  'Documents everything',
  'Quick learner',
  'Calm under pressure',
  'Team player',
]

export type Project = {
  id: string
  name: string
  title: string
  since: string
  featured?: boolean
  summary: string // one-line outcome shown on the card
  stack: string[]
  // architecture diagram: each inner array is one stage, drawn left → right
  flow: string[][]
  // stage transitions (index of the left stage) drawn one-to-one instead of all-to-all
  pairs?: number[]
  focus?: number // stage highlighted in red in the diagram
  tag?: string // tracking label on the highlighted stage
  solution: string // what I built, shown on the project
}

// Everything here comes from the CV and from what I built — no invented numbers.
export const projects: Project[] = [
  {
    id: 'private-cloud',
    name: 'cloudstack-private-cloud',
    title: 'On-prem private cloud',
    since: '2025 → now',
    featured: true,
    summary: 'Apache CloudStack private cloud on 50+ KVM hosts.',
    stack: ['Apache CloudStack', 'KVM', 'libvirt', 'Dell / HPE / Cisco'],
    flow: [['CloudStack mgmt'], ['KVM host 01', 'KVM host 02', 'KVM host …', 'KVM host 50+'], ['VMs on demand']],
    solution: 'Designed and deployed CloudStack on KVM; I run capacity planning, host lifecycle and VM provisioning.',
  },
  {
    id: 'monitoring',
    name: 'zabbix-monitoring-20-proxies',
    title: 'Zabbix at scale',
    since: '2025 → now',
    summary: 'One Zabbix server watching everything through 20+ proxies.',
    stack: ['Zabbix server', 'Zabbix proxy ×20+', 'Templates & triggers', 'Prometheus', 'Grafana'],
    flow: [['Servers', 'Network gear', 'Services'], ['Proxy 01', 'Proxy 02', 'Proxy …', 'Proxy 20+'], ['Zabbix server'], ['Grafana', 'Alerts']],
    focus: 1,
    tag: '0x5A 20+ PROXIES',
    solution: 'Deployed Zabbix with 20+ proxies, custom templates and triggers; Prometheus and Grafana add metrics and dashboards.',
  },
  {
    id: 'storage-monitoring',
    name: 'storage-exporters-gitops',
    title: 'Storage monitoring (GitOps)',
    since: '2025 → now',
    summary: '4 storage arrays monitored from one GitOps deployment.',
    stack: ['Kubernetes', 'ArgoCD', 'Kustomize', 'Prometheus', 'Grafana', 'Pure FlashArray', 'Pure FlashBlade', 'Dell PowerStore ×2'],
    flow: [['Git + ArgoCD'], ['Kustomize base'], ['Storage 1', 'Storage 2', 'Storage 3', 'Storage 4'], ['Prometheus'], ['Grafana']],
    focus: 2,
    tag: '0x4C 4 OVERLAYS',
    solution: 'One Kustomize base plus an overlay per array, synced to Kubernetes by ArgoCD. Prometheus scrapes, Grafana shows.',
  },
  {
    id: 'cam-auto-reset',
    name: 'camera-poe-auto-reset',
    title: 'Camera self-healing',
    since: '2025 → now',
    summary: 'Hung cameras get power-cycled automatically.',
    stack: ['Zabbix', 'Zabbix Actions', 'GitLab CI/CD', 'Python', 'PoE switches', 'Ticketing'],
    flow: [['Zabbix alert'], ['GitLab job'], ['Find PoE port'], ['Power-cycle'], ['Cam recovered', 'Open ticket']],
    focus: 2,
    tag: '0x5D PYTHON SCAN',
    solution: 'Zabbix flags pingable cameras with no image and triggers a GitLab job. Python finds the camera on the PoE switches, power-cycles its port, re-tests it and opens a ticket only if it stays down.',
  },
  {
    id: 'vm-self-service',
    name: 'teams-vm-self-service',
    title: 'Self-service VM requests',
    since: '2025 → now',
    summary: 'Users request VMs in Teams; I approve, automation builds them.',
    stack: ['Microsoft Teams', 'Power Automate', 'Approvals', 'GitLab CI/CD', 'Ansible', 'Ansible cloud module', 'Apache CloudStack'],
    flow: [['Teams form'], ['Power Automate'], ['GitLab CI'], ['Ansible module'], ['VM created']],
    focus: 1,
    tag: '0x6B APPROVAL',
    solution: 'A Teams form reaches me for approval through Power Automate, then GitLab CI runs an Ansible cloud module that builds the VM from the form.',
  },
]

// Tools I automate with. Each card gets a small animated flow, like the project diagrams.
// `logo` is a title from src/logos.tsx; anything missing there gets a lettered mark.
export type AutomationTool = {
  name: string
  logo: string
  use: string // one line: what I automate with it
  flow: string[][]
  focus: number // stage highlighted in the flow
  tag: string // label on the highlighted stage
}

export const automationTools: AutomationTool[] = [
  {
    name: 'Ansible',
    logo: 'Ansible',
    use: 'Playbooks that configure servers and build VMs through the cloud module.',
    flow: [['Playbook'], ['Inventory'], ['Servers/VMs']],
    focus: 1,
    tag: 'RUN',
  },
  {
    name: 'GitLab CI/CD',
    logo: 'GitLab CI/CD',
    use: 'Pipelines that run deployments and start automation jobs.',
    flow: [['Trigger'], ['Pipeline'], ['Deploy']],
    focus: 1,
    tag: 'CI',
  },
  {
    name: 'Python & Bash',
    logo: 'Python',
    use: 'Scripts for routine jobs and network gear, like resetting a camera\'s PoE port.',
    flow: [['Script'], ['PoE switches'], ['Port reset']],
    focus: 1,
    tag: 'SCAN',
  },
  {
    name: 'Zabbix actions',
    logo: 'Zabbix',
    use: 'Alerts that start automation instead of waiting for a person.',
    flow: [['Trigger'], ['Action'], ['GitLab job']],
    focus: 1,
    tag: 'FIRE',
  },
  {
    name: 'Power Automate',
    logo: 'Power Automate',
    use: 'Approval flows from Microsoft Teams that hand off to pipelines.',
    flow: [['Teams form'], ['Approval'], ['GitLab CI']],
    focus: 1,
    tag: 'OK',
  },
  {
    name: 'ArgoCD + Kustomize',
    logo: 'ArgoCD',
    use: 'GitOps: what is in Git is what runs on Kubernetes.',
    flow: [['Git'], ['ArgoCD'], ['Kubernetes']],
    focus: 1,
    tag: 'SYNC',
  },
]

export type Job = {
  time: string
  level: 'INFO' | 'EDU'
  title: string
  company: string
  points: string[]
  highlights?: { value: string; label: string }[] // big numbers above the bullets
  groups?: { label: string; points: string[] }[] // when set, bullets are shown by topic (tabs)
}

// Current role's bullets, grouped by topic for the Experience tabs
const sysadminGroups = [
  {
    label: 'Cloud & servers',
    points: [
      'Manage 1,500+ VMs and work hands-on with 50+ Dell, HPE and Cisco servers.',
      'Built and run the CloudStack private cloud (50+ KVM hosts).',
      'Run container workloads on Kubernetes, Docker and Podman.',
      'Administer RHEL, CentOS, AlmaLinux, Rocky and Ubuntu: install, patch, harden, troubleshoot.',
    ],
  },
  {
    label: 'Monitoring',
    points: [
      'Deployed Zabbix; run 20+ proxies with custom templates and triggers.',
      'Prometheus and Grafana with service-specific exporters.',
      'GitOps storage monitoring for 4 arrays (ArgoCD + Kustomize).',
      'Track performance, resources and traffic to catch issues early.',
    ],
  },
  {
    label: 'Automation',
    points: [
      'Automate routine tasks with Ansible and Bash.',
      'GitLab CI/CD pipelines for deployments.',
      'Camera self-healing: Zabbix → GitLab → Python PoE reset.',
      'Self-service VMs: Teams form → my approval → Ansible.',
    ],
  },
  {
    label: 'Operations',
    points: [
      'Plan upgrades, migrations and new services with other teams.',
      'Document configurations, incidents and fixes.',
      'Run and test backup and disaster-recovery plans.',
    ],
  },
]

export const experience: Job[] = [
  {
    time: '2025-05 → now',
    level: 'INFO',
    title: 'IT System Administrator',
    company: 'Earthlink ISP',
    points: sysadminGroups.flatMap((g) => g.points),
    highlights: [
      { value: '1,500+', label: 'VMs managed' },
      { value: '50+', label: 'servers, hands-on' },
      { value: '20+', label: 'Zabbix proxies, one server' },
      { value: '50+', label: 'KVM hypervisors' },
    ],
    groups: sysadminGroups,
  },
  {
    time: '2024-06 → 2025-05',
    level: 'INFO',
    title: 'IT Help Desk Technician',
    company: 'Earthlink ISP',
    highlights: [{ value: '1,500+', label: 'tickets resolved' }],
    points: [
      'Resolved 1,500+ tickets: first-line hardware, software and network support.',
      'Installed and maintained Windows, Linux and business software.',
      'Managed MikroTik routers and switches; supported Cisco DX and CUCM.',
      'Building network support: cabling, switches and connectivity, with every request logged.',
    ],
  },
  {
    time: '2022 → 2024',
    level: 'INFO',
    title: 'Computer Technician',
    company: 'Computer Hardware & Software Shop',
    points: [
      'Repaired and upgraded desktops and laptops.',
      'Installed Windows and Linux; removed malware and recovered data.',
    ],
  },
  {
    time: '2019 → 2024',
    level: 'EDU',
    title: 'Bachelor of Computer Engineering',
    company: 'University of Technology, Baghdad',
    points: [
      'Graduation project: a tourist-guide mobile app in Flutter and Firebase (booking, currency converter, city guide).',
    ],
  },
]

// Contact links (no email on the site, by choice); GitHub only appears once a URL is set above
export const contactLinks = [
  { key: 'linkedin', label: profile.linkedin.replace('https://', ''), href: profile.linkedin, external: true },
  ...(profile.github
    ? [{ key: 'github', label: profile.github.replace('https://', ''), href: profile.github, external: true }]
    : []),
]
