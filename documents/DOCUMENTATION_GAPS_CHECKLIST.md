# Documentation Gaps Checklist - Portfall Scenario

## Critical Missing Documents Required for Effective Team Response

### PHASE 1 TECHNICAL PROCEDURES (1, 6, 11 minutes)

#### Technical Team Missing Documents
- [ ] **Network Diagnostics SOP**
  - *Required for:* INJ001A (Delayed Packet Routing), INJ001B (Packet queue spike)
  - *Must include:* Node-04 traffic investigation steps, external gateway diagnostics, malicious connection trace procedures

- [ ] **AIS Signal Validation Checklist** 
  - *Required for:* INJ002A (hide_ship), INJ005A (hide_all_ships), INJ007B (hide Ship_Bravo)
  - *Must include:* Real-time signal validation steps, cross-system correlation procedures

- [ ] **Escalation Decision Matrix**
  - *Required for:* All technical injects requiring cyber team escalation decisions
  - *Must include:* Clear criteria for when to escalate vs. continue investigation

#### Operations Team Missing Documents  
- [ ] **CCTV Blackout Response SOP**
  - *Required for:* INJ003A (trigger_blackout), INJ003B (CCTV Blind Zone), INJ003F (CCTV Outage)
  - *Must include:* Procedures for maintaining operations during surveillance loss, manual watch protocols

- [ ] **Manual Override Authorization Process**
  - *Required for:* INJ003F (crane halt), INJ009C (manual overrides), INJ016C (crane crew confusion)
  - *Must include:* Authorization workflow, safety verification steps, coordination requirements

- [ ] **Safety Risk Assessment Template**
  - *Required for:* INJ003F (unsafe conditions), INJ005D (crew refusing work), INJ012D (crew stress)
  - *Must include:* Risk assessment framework, safety decision criteria, escalation thresholds

#### Legal Team Missing Documents
- [ ] **Insurance Clause Interpretation Guide**
  - *Required for:* INJ001F (clause 7.4), INJ005C (clause 4.7), INJ013 (coverage classification)
  - *Must include:* Policy interpretation framework, coverage determination steps

- [ ] **Regulatory Timeline Compliance Tracker**
  - *Required for:* INJ005C (1300 deadline), INJ017B (reporting timeframes), INJ021A (ministerial deadline)
  - *Must include:* Compliance deadline tracking, notification sequencing

#### Media Team Missing Documents
- [ ] **Media Monitoring Response SOP**
  - *Required for:* INJ001E (MarineTracker visibility), INJ004B (media scraping), INJ020A (Twitter images)
  - *Must include:* Monitoring response procedures, escalation criteria

---

### PHASE 2 ADVANCED PROCEDURES (16, 21, 26 minutes)

#### Technical Team Missing Documents
- [ ] **Log Deletion Investigation SOP**
  - *Required for:* INJ016B (log_deletion_alert), INJ011D (log retention compliance)
  - *Must include:* Forensic investigation steps, evidence preservation procedures

- [ ] **Unauthorized Cron Job Response**
  - *Required for:* INJ016A (detected cron activity), INJ017A (override_crane.sh)
  - *Must include:* Investigation steps, remediation procedures, system validation

- [ ] **Multi-System Failure Coordination Guide**
  - *Required for:* When AIS (INJ005A), CCTV (INJ003A), and network issues compound
  - *Must include:* Integrated response plan, priority matrix, resource allocation

#### Operations Team Missing Documents
- [ ] **Multi-Berth Emergency Shutdown Procedures**
  - *Required for:* INJ005D (Berths 2-4 affected), INJ009C (30% capacity reduction)
  - *Must include:* Systematic shutdown criteria, coordination protocols

- [ ] **Workforce Safety Communication Protocol**
  - *Required for:* INJ004D (team stress), INJ012D (crew safety concerns), INJ004F (heat safety)
  - *Must include:* Communication procedures, morale management, safety messaging

#### Legal Team Missing Documents
- [ ] **Breach Classification Decision Tree**
  - *Required for:* INJ017B (persistence clause), INJ012A (liability assessment)
  - *Must include:* Technical classification criteria, legal implications, reporting requirements

- [ ] **Multi-Jurisdiction Compliance Timeline Tracker**
  - *Required for:* INJ019A (breach notification), INJ021C (ministerial submission)
  - *Must include:* Overlapping regulatory requirements, prioritization matrix

#### Media Team Missing Documents
- [ ] **Rapid Response Media Protocol (15-30 minute deadlines)**
  - *Required for:* INJ006C (ABC 30 min), INJ012B (Channel 8 20 min), INJ020B (closing segment)
  - *Must include:* Decision criteria, rapid approval process, spokesperson protocols

- [ ] **Internal Information Leak Response Procedures**
  - *Required for:* INJ004E (vendor email leak), INJ011A (leaked HR memo)
  - *Must include:* Leak investigation, damage control, response strategy

---

### PHASE 3 COMPLEX DECISION-MAKING (31, 36, 41 minutes)

#### Cross-Team Integration Documents
- [ ] **Crisis Decision Authority Matrix**
  - *Required for:* INJ019A (CEO approval required), INJ021D (delay recommendations)
  - *Must include:* Authority levels, approval workflows, escalation paths

- [ ] **Evidence Handling and Legal Discovery Protocol**
  - *Required for:* INJ008A (auth failures), INJ009D (cronjob detected), INJ012A (risk logs request)
  - *Must include:* Chain of custody, forensic procedures, legal privilege protection

---

### PHASE 4 FINAL COORDINATION (46, 51, 56 minutes)

#### Executive Integration Documents
- [ ] **Executive Briefing Template and Decision Process**
  - *Required for:* INJ019A (breach notification approval), INJ021C (final briefing materials)
  - *Must include:* Structured briefing format, decision criteria, approval workflow

- [ ] **Multi-Channel Message Coordination Templates**
  - *Required for:* INJ020A (social media response), INJ020B (media statement), INJ021D (statement delay)
  - *Must include:* Message consistency, timing coordination, approval chains

---

### TOP PRIORITY CROSS-TEAM DOCUMENTS

#### Immediate Priority (Affects Multiple Phases)
- [ ] **Crisis Decision Authority Matrix**
- [ ] **Inter-Team Communication Protocol During Crisis**
- [ ] **Resource Prioritization and Conflict Resolution Process**
- [ ] **Executive Briefing Template and Schedule**
- [ ] **Crisis De-escalation Criteria and Process**

---

### IMPLEMENTATION NOTES

Each document should include:
- **Purpose:** Clear statement of when and why to use
- **Triggers:** Specific inject scenarios that require this procedure
- **Step-by-step procedures:** Actionable checklists
- **Decision criteria:** Clear guidance for judgment calls
- **Escalation paths:** When and how to escalate
- **Cross-team coordination:** Required notifications and approvals
- **Templates:** Forms, checklists, communication templates
- **Success criteria:** How to know the procedure was completed successfully

### CROSS-REFERENCE TO INJECTS
Each document should explicitly reference the inject IDs it supports to ensure complete coverage during scenario execution.