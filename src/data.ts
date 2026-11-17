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
    'IT and Computer Engineering graduate with hands-on experience in Linux system administration (RHEL / CentOS / AlmaLinux / Rocky / Ubuntu), server infrastructure, network operations and IT automation.',
    'Certified Red Hat System Administrator (RHCSA), Red Hat Certified Engineer in Enterprise Linux and in Ansible, Red Hat Certified Advanced System Administrator in Ansible, and Zabbix Certified Specialist (ZCS).',
    'Proven ability to deploy and manage monitoring stacks (Zabbix, Grafana), automate workflows with GitLab CI/CD and Ansible, and maintain high-availability enterprise environments.',
  ],
  email: 'ninjaosnnxkn@gmail.com',
  github: '', // add your GitHub URL here to show it on the site
  linkedin: 'https://linkedin.com/in/abdullah-mohammed-552159302',
}

// Headline numbers shown in the hero — every one comes straight from the CV
export const stats = [
  { value: '4+', label: 'years in IT' },
  { value: '50+', label: 'KVM hosts run' },
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
    note: 'On-prem private cloud at 50+ hosts',
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
  'Adaptable to new environments, systems and evolving requirements',
  'Clear communicator with technical and non-technical stakeholders',
  'Customer-focused, with a strong commitment to service quality',
  'Organized and detail-oriented in documenting issues and solutions',
  'Quick learner who actively adopts new technologies',
  'Strong problem-solving and troubleshooting under pressure',
  'Collaborative team player with a professional mindset',
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
  problem: string
  investigation: string
  fix: string
  result: string
}

// Each project is written as an incident report: Problem → Investigation → Fix → Result.
// Everything here comes from the CV — no invented numbers.
export const projects: Project[] = [
  {
    id: 'private-cloud',
    name: 'cloudstack-private-cloud',
    title: 'On-prem private cloud',
    since: '2025 → now',
    featured: true,
    summary: 'Designed, deployed and operate an Apache CloudStack private cloud on 50+ KVM hosts.',
    stack: ['Apache CloudStack', 'KVM', 'libvirt', 'Dell / HPE / Cisco'],
    flow: [['CloudStack mgmt'], ['KVM host 01', 'KVM host 02', 'KVM host …', 'KVM host 50+'], ['VMs on demand']],
    problem: 'Teams needed virtual machines on demand, on hardware the company owns, without waiting on manual setup.',
    investigation: 'Planned capacity across the server fleet and worked out how hosts would be added, maintained and retired.',
    fix: 'Designed, deployed and now operate an on-premises private cloud on Apache CloudStack with KVM hypervisors, covering capacity planning, host lifecycle and VM provisioning.',
    result: '50+ KVM hosts run as one private cloud, with VMs provisioned from a single platform.',
  },
  {
    id: 'monitoring',
    name: 'zabbix-monitoring-20-proxies',
    title: 'Zabbix at scale',
    since: '2025 → now',
    summary: 'Deployed Zabbix and run it at scale: 20+ Zabbix proxies reporting to one Zabbix server, plus Prometheus and Grafana.',
    stack: ['Zabbix server', 'Zabbix proxy ×20+', 'Templates & triggers', 'Prometheus', 'Grafana'],
    flow: [['Servers', 'Network gear', 'Services'], ['Proxy 01', 'Proxy 02', 'Proxy …', 'Proxy 20+'], ['Zabbix server'], ['Grafana', 'Alerts']],
    focus: 1,
    tag: '0x5A 20+ PROXIES',
    problem: 'Problems with servers and services had to be caught before they turned into outages for ISP customers.',
    investigation: 'Mapped which hosts and services mattered most and which signals (availability, performance, resources) showed trouble early. With this many hosts and locations, data had to be collected close to them by proxies while keeping one central server.',
    fix: 'Deployed Zabbix and now maintain and administer 20+ Zabbix proxies reporting to a single Zabbix server, with custom templates, items and triggers. Prometheus and Grafana add metrics and dashboards through service-specific exporters.',
    result: 'One Zabbix server sees the whole infrastructure through 20+ proxies, with alerts and dashboards in one place.',
  },
  {
    id: 'storage-monitoring',
    name: 'storage-exporters-gitops',
    title: 'Storage monitoring (GitOps)',
    since: '2025 → now',
    summary: 'One ArgoCD + Kustomize deployment on Kubernetes monitoring 4 storage arrays with Prometheus and Grafana.',
    stack: ['Kubernetes', 'ArgoCD', 'Kustomize', 'Prometheus', 'Grafana', 'Pure FlashArray', 'Pure FlashBlade', 'Dell PowerStore ×2'],
    flow: [['Git + ArgoCD'], ['Kustomize base'], ['FlashArray', 'FlashBlade', 'PowerStore 1', 'PowerStore 2'], ['Prometheus'], ['Grafana']],
    focus: 2,
    tag: '0x4C 4 OVERLAYS',
    problem: 'Four storage arrays from two vendors (Pure FlashArray, Pure FlashBlade and two Dell PowerStore systems) had to be monitored from one place.',
    investigation: 'Each array needs its own exporter settings, but the deployment around them is the same, so one shared definition with small per-array differences fits best.',
    fix: 'Built one Kustomize base for the exporter deployment plus four overlays, one per storage array, synced to Kubernetes by a single ArgoCD application. Prometheus scrapes the exporters and Grafana shows the dashboards.',
    result: 'All four storage arrays are monitored from one GitOps deployment: changes roll out from Git through ArgoCD, and adding an array means adding one overlay.',
  },
  {
    id: 'cam-auto-reset',
    name: 'camera-poe-auto-reset',
    title: 'Camera self-healing',
    since: '2025 → now',
    summary: 'Zabbix spots cameras that ping but send no image; a GitLab-run Python job finds their PoE port, power-cycles it and opens a ticket only if they stay down.',
    stack: ['Zabbix', 'Zabbix Actions', 'GitLab CI/CD', 'Python', 'PoE switches', 'Ticketing'],
    flow: [['Zabbix alert'], ['GitLab job'], ['Find PoE port'], ['Power-cycle'], ['Cam recovered', 'Open ticket']],
    focus: 2,
    tag: '0x5D PYTHON SCAN',
    problem: 'Cameras sometimes hang: they still answer ping but stop sending images, so someone had to find the right switch port and power-cycle them by hand.',
    investigation: 'Ping alone shows these cameras as healthy, so detection had to check for the missing image. Fixing them meant finding which PoE switch port each camera sits on, across every building on the site.',
    fix: 'Zabbix detects cameras that are pingable but have no image and fires an action that triggers a GitLab pipeline. A Python script lists the site or building PoE switches, searches each one for the affected cameras, power-cycles the port when it finds them, then tests each camera again. If a camera does not recover, the automation opens a ticket with the issue.',
    result: 'Hung cameras are reset automatically without anyone touching a switch. Only cameras that stay down after the reset reach a person, as a ticket that already describes the problem.',
  },
  {
    id: 'vm-self-service',
    name: 'teams-vm-self-service',
    title: 'Self-service VM requests',
    since: '2025 → now',
    summary: 'Users request a VM with a Microsoft Teams form; Power Automate sends it to me for approval, then GitLab CI runs an Ansible cloud module that creates the VM from the form details.',
    stack: ['Microsoft Teams', 'Power Automate', 'Approvals', 'GitLab CI/CD', 'Ansible', 'Ansible cloud module', 'Apache CloudStack'],
    flow: [['Teams form'], ['Power Automate'], ['GitLab CI'], ['Ansible module'], ['VM created']],
    focus: 1,
    tag: '0x6B APPROVAL',
    problem: 'Creating VMs for users by hand meant collecting the details, checking each request and setting everything up manually every time.',
    investigation: 'Every request needs the same information and the same sign-off, so the request form and the approval step could be standardized and the creation step automated.',
    fix: 'Users submit a request form in Microsoft Teams. Power Automate sends it to me as an approval request; once I approve it, Power Automate triggers a GitLab CI pipeline that passes the form details to an Ansible playbook, and the Ansible cloud module creates the VM on the cloud environment.',
    result: 'Users request VMs themselves, nothing is created without my approval, and every VM is built exactly as requested in the form.',
  },
]

export type Job = {
  time: string
  level: 'INFO' | 'EDU'
  title: string
  company: string
  points: string[]
}

export const experience: Job[] = [
  {
    time: '2025-05 → now',
    level: 'INFO',
    title: 'IT System Administrator',
    company: 'Earthlink ISP',
    points: [
      'Manage and maintain physical and virtual servers, ensuring high availability, performance and scalability.',
      'Manage and maintain Dell, Cisco and HPE server hardware.',
      'Design, deploy and operate an on-premises private cloud built on Apache CloudStack with KVM hypervisors (50+ hosts): capacity planning, host lifecycle management and VM provisioning.',
      'Deploy and manage containerized workloads using Kubernetes, Docker and Podman.',
      'Administer Linux systems (RHEL / CentOS / AlmaLinux / Rocky / Ubuntu): installation, configuration, patching, hardening and troubleshooting.',
      'Deployed Zabbix and maintain and administer 20+ Zabbix proxies reporting to one Zabbix server, with custom templates, items and triggers to monitor infrastructure availability and performance.',
      'Deploy and manage Grafana and Prometheus for metrics collection and visualization, with service-specific exporters.',
      'Built GitOps storage monitoring for 4 arrays (Pure FlashArray, Pure FlashBlade, 2× Dell PowerStore): one ArgoCD application syncing a Kustomize base with 4 overlays to Kubernetes, scraped by Prometheus and shown in Grafana.',
      'Automate repetitive tasks and monitoring workflows with Ansible and Bash to reduce downtime and manual effort.',
      'Built self-healing for IP cameras: Zabbix detects cameras that ping but send no image and triggers a GitLab pipeline; a Python script finds each camera on the site\'s PoE switches, power-cycles its port, re-tests it and opens a ticket if it stays down.',
      'Design and maintain GitLab CI/CD pipelines to automate deployments and streamline development workflows.',
      'Built self-service VM provisioning: a Microsoft Teams form goes through a Power Automate approval to me, then triggers a GitLab CI pipeline that creates the VM on the cloud with an Ansible cloud module, using the form details.',
      'Monitor system performance, resource utilization and network traffic to proactively find and resolve issues.',
      'Coordinate with cross-functional teams on system upgrades, migrations and new service deployments.',
      'Maintain documentation of infrastructure configurations, incidents and resolutions for knowledge management.',
      'Implement and regularly test backup, disaster-recovery and business-continuity plans.',
    ],
  },
  {
    time: '2024-06 → 2025-05',
    level: 'INFO',
    title: 'IT Help Desk Technician',
    company: 'Earthlink ISP',
    points: [
      'Provided first-level technical support for hardware, software and network issues for end users.',
      'Installed, configured and maintained Windows and Linux operating systems and enterprise software.',
      'Managed MikroTik routers and switches; supported Cisco DX devices and Cisco Unified Communications Manager (CUCM).',
      'Handled building-level network support: cabling, switch configuration and connectivity troubleshooting.',
      'Kept accurate records of support requests in the ticketing system and escalated complex issues appropriately.',
    ],
  },
  {
    time: '2022 → 2024',
    level: 'INFO',
    title: 'Computer Technician',
    company: 'Computer Hardware & Software Shop',
    points: [
      'Diagnosed and repaired hardware faults in desktops and laptops, including component replacements and upgrades.',
      'Installed and configured Windows and Linux; performed virus removal and data recovery.',
      'Documented repair cases and gave customers technical guidance on hardware and software issues.',
    ],
  },
  {
    time: '2019 → 2024',
    level: 'EDU',
    title: 'Bachelor of Computer Engineering',
    company: 'University of Technology, Baghdad',
    points: [
      'Graduation project: Mobile Tourist Guidance Application, built with Flutter (frontend) and Firebase (backend).',
      'Features: booking, space sharing, currency converter and city exploration.',
      'Implemented Firebase Authentication, real-time database and cloud storage.',
    ],
  },
]

// Contact links; GitHub only appears once a URL is set above
export const contactLinks = [
  { key: 'email', label: profile.email, href: `mailto:${profile.email}`, external: false },
  { key: 'linkedin', label: profile.linkedin.replace('https://', ''), href: profile.linkedin, external: true },
  ...(profile.github
    ? [{ key: 'github', label: profile.github.replace('https://', ''), href: profile.github, external: true }]
    : []),
]
