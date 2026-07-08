# AZ-900 · Night-Before Cheat Sheet

The complete distillation. Every table below has appeared in AZ-900 exam questions in some form. If you can reproduce all of these from memory the morning of the exam, you're operating at the top of the score band.

---

## Exam mechanics

| Item             | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| Duration         | 60 minutes                                                  |
| Questions        | 40–60                                                       |
| Passing score    | 700 / 1000                                                  |
| Cost             | $99 USD                                                     |
| Validity         | Certification does not expire                               |
| Domains          | Cloud concepts (25–30%), Architecture (35–40%), Governance (30–35%) |

---

## Cloud concepts

- **CapEx → OpEx** is the executive value of moving to cloud.
- **Ingress free, egress paid.**
- **Consumption-based pricing:** pay only for what you use.
- **Shared responsibility line moves by service type:** IaaS = you patch OS; PaaS = you don't; SaaS = you barely touch anything. Data & identities are *always yours.*

### Cloud deployment models

| Model       | Where it runs                     | Trade-off                                     |
| ----------- | --------------------------------- | --------------------------------------------- |
| Public      | Provider DCs, multi-tenant        | Lowest cost, fastest, least control           |
| Private     | Single tenant (on-prem or hosted) | Most control, highest cost, compliance-friendly |
| Hybrid      | Public + private, connected       | Gradual migration, burst-to-cloud             |
| Multi-cloud | Multiple public providers         | Avoid lock-in, best-of-breed                  |

### Service types

| Type       | You manage                          | Examples                              |
| ---------- | ----------------------------------- | ------------------------------------- |
| IaaS       | OS + up                             | Azure VMs, VNets, Disks               |
| PaaS       | Application + data                  | App Service, Azure SQL DB, Cosmos DB  |
| SaaS       | Data + configuration                | Microsoft 365, Dynamics 365           |
| Serverless | Function code + config              | Azure Functions, Logic Apps           |

### Benefits terminology (nail the distinctions)

- **Availability** = uptime. **Reliability** = fault-recovery.
- **Scalability** = capability. **Elasticity** = automatic scalability.
- **Vertical scale** = bigger box (up/down). **Horizontal scale** = more boxes (out/in).
- **Composite SLA is the *product*** of dependent SLAs.

### SLA nines — yearly downtime cheat

| SLA %           | Yearly downtime | Typical shape                     |
| --------------- | --------------- | --------------------------------- |
| 99%             | ~3.65 days      | Single VM, no redundancy          |
| 99.9%           | ~8.76 hours     | Single VM with Premium SSD        |
| 99.95%          | ~4.38 hours     | Availability Set                  |
| 99.99%          | ~52 minutes     | Availability Zones                |
| 99.999%         | ~5 minutes      | Multi-region active-active        |
| **0% / no SLA** | —               | **Preview + Free-tier services**  |

---

## Azure architecture

### Physical hierarchy

```
Geography → Region → Availability Zone → Datacentre
```

- **60+ regions** worldwide.
- **Region pair** = paired region within a geography, ~300+ miles apart, used for DR. Updates are staggered across a pair.
- **Availability Zone** = min 3 physically separate zones per zone-enabled region.
- **Sovereign regions** = Azure Government (US) and Azure China (21Vianet-operated).

### Resource hierarchy

```
Tenant → Root MG → Management Groups (up to 6 deep) → Subscriptions → Resource Groups → Resources
```

- Every resource lives in exactly one RG and one region.
- **Delete an RG** = every resource inside is deleted.
- **ARM** = the single control plane; every request goes through it.

### VM SLA ladder

| Setup                                     | SLA     |
| ----------------------------------------- | ------- |
| Single VM (Premium SSD / Ultra Disk)      | 99.9%   |
| ≥ 2 VMs in an Availability Set            | 99.95%  |
| ≥ 2 VMs across Availability Zones         | 99.99%  |

### Availability Set vs Availability Zone

| Feature   | Availability Set              | Availability Zone         |
| --------- | ----------------------------- | ------------------------- |
| Scope     | One datacentre                | Multiple datacentres      |
| Protects  | Rack, update, power at rack   | Datacentre outage         |
| Structure | Fault Domain + Update Domain  | Zone (1, 2, 3)            |

---

## Compute

| Service                    | Type       | Sweet spot                                  |
| -------------------------- | ---------- | ------------------------------------------- |
| Virtual Machines           | IaaS       | Lift-and-shift, full OS control             |
| VM Scale Sets              | IaaS       | Horizontal scale of identical VMs           |
| App Service                | PaaS       | Web apps, APIs, mobile back-ends            |
| Container Instances (ACI)  | PaaS       | Single container, no orchestrator           |
| Container Apps             | PaaS       | Managed containers with KEDA autoscale      |
| AKS                        | PaaS       | Managed Kubernetes control plane            |
| Azure Functions            | Serverless | Event-driven code, pay-per-execution        |
| Azure Virtual Desktop      | PaaS       | Windows desktops, multi-session support     |

### VM billing states

- **Stopped** (from OS): still billed for compute.
- **Stopped-deallocated** (via portal/CLI): **not** billed for compute. Storage still billed.

---

## Networking

### Connectivity between networks

| Service            | Path              | Bandwidth      | SLA         |
| ------------------ | ----------------- | -------------- | ----------- |
| VNet peering       | Azure backbone    | Line rate      | -           |
| VPN Gateway (S2S / P2S) | Encrypted over internet | Up to ~10 Gbps | -    |
| ExpressRoute       | Private via partner | Up to 100 Gbps | 99.95%     |

### Load balancing

| Service              | OSI Layer | Scope    |
| -------------------- | :-------: | -------- |
| Load Balancer        | L4        | Regional |
| Application Gateway  | L7        | Regional |
| Front Door           | L7        | Global   |
| Traffic Manager      | DNS       | Global   |

Pick by (OSI layer, scope):
- Regional non-HTTP → **Load Balancer**
- Regional HTTP → **Application Gateway**
- Global HTTP → **Front Door**
- Global via DNS / non-HTTP → **Traffic Manager**

---

## Storage

### Services

**Blob** (unstructured objects), **File** (SMB/NFS shares), **Queue** (messages ≤64 KB), **Table** (key-value NoSQL), **Disk** (VM disks).

### Redundancy

| Option      | Copies | Location                              |
| ----------- | :----: | ------------------------------------- |
| LRS         | 3      | 1 datacentre                          |
| ZRS         | 3      | 3 zones in 1 region                   |
| GRS         | 6      | 2 regions (LRS × 2)                   |
| GZRS        | 6      | ZRS + geo secondary                   |
| RA-GRS      | 6      | GRS + secondary readable              |
| RA-GZRS     | 6      | GZRS + secondary readable             |

### Blob access tiers

| Tier    | Cost profile     | Min retention | Retrieval           |
| ------- | ---------------- | :-----------: | ------------------- |
| Hot     | Storage $$$, access $ | -        | Milliseconds        |
| Cool    | Storage $$, access $$ | 30 days  | Milliseconds        |
| Cold    | Storage $, access $$$ | 90 days  | Milliseconds        |
| Archive | Storage cheapest, access highest | 180 days | Up to **15 hours** rehydration |

### Migration & movement tools

| Tool                | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| AzCopy              | CLI bulk copy                                                |
| Storage Explorer    | Cross-platform GUI                                           |
| Azure File Sync     | Hybrid Windows file shares                                   |
| Azure Migrate       | Discover + assess + migrate servers, DBs, apps               |
| Data Box            | Physical device for offline bulk transfer (Disk / Box / Heavy) |

---

## Identity, access, security

### Entra ID essentials

- Formerly **Azure AD**. Cloud identity service.
- Protocols: **OAuth 2.0, OpenID Connect, SAML**. Not Kerberos/LDAP/NTLM.
- **Entra Domain Services** provides managed AD DS (Kerberos, GPO, LDAP) in Azure.

### Authentication

- **MFA** = two or more of: know, have, are.
- **Passwordless** options: Windows Hello, FIDO2, Microsoft Authenticator.
- **SSO** across many apps from one sign-in.

### RBAC — four fundamental roles

| Role                     | Can do                                        |
| ------------------------ | --------------------------------------------- |
| Owner                    | Full access + grant access to others          |
| Contributor              | Full management, cannot grant access          |
| Reader                   | View only                                     |
| User Access Administrator | Manage access, not other resources           |

Assign at MG / Sub / RG / Resource — permissions inherit down.

### Zero Trust (memorise)

1. **Verify explicitly**
2. **Use least-privilege access**
3. **Assume breach**

### Defense in depth (7 layers, outside → in)

**Physical → Identity & Access → Perimeter → Network → Compute → Application → Data**

### Security services

| Service                   | Role                                        |
| ------------------------- | ------------------------------------------- |
| Defender for Cloud        | CSPM + workload protection; Secure Score    |
| Microsoft Sentinel        | Cloud-native SIEM + SOAR                    |
| Azure Key Vault           | Secrets, keys, certificates                 |
| Azure Firewall            | Managed L4–L7 firewall                      |
| DDoS Protection           | Basic (free, on) or Standard (paid, SLA)    |
| NSG                       | Subnet / NIC allow-deny rules (stateful)    |
| ASG                       | Group VMs by app role for cleaner NSG rules |

---

## Cost management

### Six cost factors

Resource type · Consumption · Maintenance state · Geography · Network egress · Subscription type

### Calculators

- **Pricing Calculator** — cost of new Azure workloads (plan).
- **TCO Calculator** — compare Azure to on-prem over 5 years (business case).

### Savings levers

| Option              | Discount   | Commitment    | Flexibility          |
| ------------------- | ---------- | ------------- | -------------------- |
| Reserved Instances  | Up to 72%  | 1 or 3 yr     | Low                  |
| Savings Plan        | Up to 65%  | 1 or 3 yr     | Medium               |
| Hybrid Benefit      | Up to 85%* | Existing licence | High              |
| Spot VMs            | Up to 90%  | None (evictable) | Fully flexible    |
| Dev/Test subs       | Reduced    | None          | High                 |

*Combined with RI on some workloads.

### Habits

- Deallocate idle VMs (dev boxes overnight).
- Autoscale to shrink at low demand.
- Right-size (Advisor recommends).
- Move blobs to Cool / Cold / Archive.
- Tag everything, budget everything.

---

## Governance & compliance

### Policy vs RBAC

| RBAC (identity)                       | Azure Policy (resource config)              |
| ------------------------------------- | ------------------------------------------- |
| *Who* can perform actions             | *What* configurations are allowed           |
| Roles: Owner, Contributor, Reader, UAA | Effects: audit, deny, append, modify, deployIfNotExists |

Use both — they're complementary.

### Resource locks

| Lock              | Modify | Delete |
| ----------------- | :----: | :----: |
| ReadOnly          | No     | No     |
| Delete (CanNotDelete) | Yes | No     |

Inherit down the hierarchy; apply on top of RBAC (even Owner is affected).

### Data governance

- **Microsoft Purview** — data discovery, classification, lineage across your estate.
- **Purview ≠ Policy**: Purview = data; Policy = resource config.

### Service Trust Portal

Public docs at `servicetrust.microsoft.com` — audit reports (SOC, ISO, FedRAMP, HIPAA, PCI, GDPR).

---

## Management & deployment tools

- **Azure Portal** — GUI at `portal.azure.com`.
- **Azure CLI** — cross-platform, `az verb noun` (Bash-friendly).
- **Azure PowerShell** — cross-platform via PS Core, `Verb-Noun` cmdlets.
- **Cloud Shell** — browser-hosted at `shell.azure.com`; both Bash + PowerShell; needs a storage account for `$HOME`.
- **Azure Mobile app** — iOS / Android; alerts + Cloud Shell.
- **ARM templates** — JSON declarative IaC.
- **Bicep** — cleaner DSL that transpiles to ARM.
- **Azure Arc** — extends Azure control plane to on-prem, other clouds, and edge (servers, K8s, data services).

---

## Monitoring

### Azure Advisor — five pillars

**Reliability · Security · Performance · Cost · Operational excellence**

### Service Health family

- **Azure Status** = global public dashboard.
- **Service Health** = filtered to your subscriptions (Azure-side incidents, planned maintenance, health & security advisories).
- **Resource Health** = health of an individual resource.

### Azure Monitor umbrella

Metrics · Logs (Log Analytics + KQL) · Alerts → Action Groups · Autoscale · Application Insights · Container Insights · VM Insights · Network Watcher

### Alerts flow

Signal → Alert rule condition → Alert fires → Action Group (email / SMS / webhook / Function / Logic App / Runbook)

---

## Ultra-condensed anchor facts (memorise these last)

- **700 / 1000** to pass.
- **60+ regions**, min **3 AZs** per zone-enabled region, region pairs **~300 miles** apart.
- **Hierarchy:** Tenant → Root MG → MGs → Subs → RGs → Resources.
- **VM SLA:** 99.9 → 99.95 (Set) → 99.99 (Zones).
- **Storage redundancy:** LRS / ZRS / GRS / GZRS / RA-GRS / RA-GZRS.
- **Blob tiers:** Hot / Cool / Cold / Archive. Archive rehydration up to **15 h**.
- **Region pair = DR. AZ = HA.**
- **Zero Trust:** verify explicitly · least privilege · assume breach.
- **Defense in depth:** physical → identity → perimeter → network → compute → application → data.
- **RBAC = who. Policy = what.** Both enforced by ARM.
- **Advisor pillars:** reliability · security · performance · cost · operational excellence.
- **Service Health ≠ Resource Health.**
- **Purview = data. Policy = resource config. Service Trust Portal = docs.**
- **ExpressRoute = private circuit. VPN Gateway = encrypted over internet.**
- **Load Balancer L4, App Gateway L7 regional, Front Door L7 global, Traffic Manager DNS.**
- **Ingress free, egress paid.**
- **Deallocate VMs to stop compute billing.**

Good luck.
