// Every technology on the site, as a logo: used by the "Stack in production" rows
// and the floating background. Logos are from Simple Icons (CC0).
import {
  siAlmalinux,
  siAnsible,
  siApachecloudstack,
  siArgo,
  siCentos,
  siCisco,
  siDebian,
  siDell,
  siDocker,
  siFirebase,
  siFlutter,
  siGit,
  siGitlab,
  siGnubash,
  siGrafana,
  siKubernetes,
  siLinux,
  siMikrotik,
  siPodman,
  siPrometheus,
  siPython,
  siQemu,
  siRedhat,
  siRockylinux,
  siUbuntu,
  siVmware,
} from 'simple-icons'

// Logos from Simple Icons (CC0). Zabbix and Kustomize are not in the set, so they get a lettered mark.
export type Logo = { title: string; path?: string; letter?: string }
const L = (icon: { path: string }, title: string): Logo => ({ title, path: icon.path })
const ZABBIX: Logo = { title: 'Zabbix', letter: 'Z' }
const KUSTOMIZE: Logo = { title: 'Kustomize', letter: 'K' }

export const ROWS: Logo[][] = [
  [
    L(siKubernetes, 'Kubernetes'),
    L(siArgo, 'ArgoCD'),
    KUSTOMIZE,
    L(siGitlab, 'GitLab CI/CD'),
    L(siPython, 'Python'),
    L(siDocker, 'Docker'),
    L(siAnsible, 'Ansible'),
    ZABBIX,
    L(siPrometheus, 'Prometheus'),
    L(siGrafana, 'Grafana'),
    L(siPodman, 'Podman'),
  ],
  [
    L(siRedhat, 'Red Hat'),
    L(siLinux, 'Linux'),
    L(siRockylinux, 'Rocky Linux'),
    L(siAlmalinux, 'AlmaLinux'),
    L(siCentos, 'CentOS'),
    L(siUbuntu, 'Ubuntu'),
    L(siDebian, 'Debian'),
    L(siGnubash, 'Bash'),
  ],
  [
    L(siApachecloudstack, 'CloudStack'),
    L(siQemu, 'KVM / QEMU'),
    L(siVmware, 'VMware'),
    L(siMikrotik, 'MikroTik'),
    L(siCisco, 'Cisco'),
    L(siDell, 'Dell'),
    L(siGit, 'Git'),
    L(siFlutter, 'Flutter'),
    L(siFirebase, 'Firebase'),
  ],
]

export const ALL_LOGOS = ROWS.flat()

export function Mark({ logo, className }: { logo: Logo; className: string }) {
  if (!logo.path)
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <rect x="1.5" y="1.5" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="currentColor">
          {logo.letter}
        </text>
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d={logo.path} fill="currentColor" />
    </svg>
  )
}
