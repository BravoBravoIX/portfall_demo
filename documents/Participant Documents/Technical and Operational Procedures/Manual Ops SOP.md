# SOUTHGATE TERMINAL
## Port Operations Security Documentation
---

**Technical / Ops Procedures -- Manual Ops SOP**

**Purpose:**\
To provide procedures for maintaining critical terminal operations when
automated systems (planning tools, sensors, scheduler) are unavailable
or untrusted. This ensures operational continuity under degraded
conditions.

**When to Use**

• AIS, GPS, or scheduling systems are offline or compromised\
• Physical equipment must be operated manually due to override or comms
failure\
• Planning dashboards are inaccessible or unreliable\
• Crane, berth, or container tasks require local coordination

**Step 1: Confirm Degraded State**

• Alert received or dashboard offline\
• Confirm affected subsystems: AIS Aggregator, Container Scheduler,
Crane Feed\
• Log timestamp of service interruption and notify Coordinator

**Step 2: Fallback Coordination Protocol**

• Switch to physical or phone-based coordination with key terminal
staff\
• Assign a Manual Ops Lead for each shift (usually Dockside Supervisor)\
• Use printed manifests or radio comms to:

- Confirm container ID and destination

- Track crane activity

- Coordinate berth sequence and clearances

**Step 3: Manual Planning Flow**

• Maintain whiteboard or paper-based record of:

- Ship arrivals and departures

- Crane assignments and lift cycles

- Container stack movements\
  • Record decisions with time, operator name, and authorisation source\
  • Confirm every manual task with second party when safety-critical
  (e.g. container override)

**Step 4: Ops Log & Incident Tagging**

• All manual tasks to be entered into /incident/manual-ops-log.txt\
• Use structured format:

\[Timestamp\] \[Operator\] \[Action Taken\] \[System Bypassed\]
\[Confirmation Source\]

• Flag any incidents involving:

- Missed clearances

- Wrong container movement

- Physical override of safety interlocks

**Step 5: Restore & Reconciliation**

• When system restored:

- Validate manual records against recovered system state

- Update container locations or berth schedules manually in planning
  tool

- Note discrepancies in Ops After-Action Log\
  • Identify if any incorrect assumptions occurred due to loss of
  visibility

---

## Manual Override Authorization Process

### Purpose
This procedure establishes clear authorization workflow for manual overrides during system failures, ensuring safety while maintaining operational continuity. Use when automated systems are unreliable or compromised.

### When to Use
- CCTV blackout affecting crane operations
- AIS signal loss requiring manual navigation
- Automated crane synchronization failures
- System anomalies creating unsafe conditions
- Crew refusing to work with automated systems

### Authorization Levels

#### LEVEL 1: Immediate Safety Override (No approval required)
- Imminent danger to personnel
- Equipment malfunction creating immediate hazard
- Environmental emergency requiring immediate response

#### LEVEL 2: Operational Override (Supervisor approval)
- CCTV blackout affecting single crane
- Minor AIS discrepancies
- Single-system automation failure
- Crew comfort/confidence issues

#### LEVEL 3: Multi-System Override (Operations Manager approval)
- Multiple crane manual operation
- AIS system-wide manual operation
- Berth shutdown for safety
- Extended manual operations (>2 hours)

#### LEVEL 4: Terminal Override (Executive approval)
- Terminal-wide automation shutdown
- Multi-berth operations halt
- Extended operations suspension
- Media/regulatory visibility operations

### **EMERGENCY MANUAL OPERATIONS (Critical Time Pressure)**

**WHEN IMMEDIATE MANUAL OVERRIDE NEEDED:**

**30-SECOND SAFETY DECISION:**
- **IMMEDIATE DANGER?** → Override now, document later
- **CREW SAFETY CONCERNS?** → Switch to manual immediately  
- **MULTIPLE SYSTEMS FAILING?** → Implement manual procedures

**2-MINUTE EMERGENCY IMPLEMENTATION:**
1. **Alert all operators:** "Switching to manual operations - enhanced safety protocols in effect"
2. **Deploy spotters:** Minimum one spotter per active crane/operation
3. **Reduce operational speed:** 50% normal speed until stabilized
4. **Establish radio contact:** Constant communication between operators and spotters

**5-MINUTE EMERGENCY DOCUMENTATION:**
- Record time of manual override implementation
- Document safety measures activated
- Note which systems failed requiring manual override
- Assign someone to handle formal authorization paperwork

**WHEN TO USE:** System failures creating immediate safety concerns, crew refusing to work with automated systems, multiple critical system failures

### Authorization Workflow

#### Step 1: Situation Assessment (2 minutes)
1. **Safety Evaluation**
   - [ ] Immediate danger present? → LEVEL 1 (proceed immediately)
   - [ ] Equipment functioning but crew uncomfortable? → LEVEL 2
   - [ ] Multiple systems affected? → LEVEL 3
   - [ ] Terminal-wide impact? → LEVEL 4

2. **Impact Assessment**
   - [ ] Document specific systems requiring manual override
   - [ ] Estimate operational capacity under manual mode
   - [ ] Calculate expected timeline for resolution

#### Step 2: Authorization Request
**For Level 2-4:** Use standard authorization format:

**TO:** [Supervisor/Operations Manager/Executive]  
**SUBJECT:** Manual Override Authorization Request - [System]  
**PRIORITY:** [URGENT/HIGH/MEDIUM]

**SITUATION:** [Brief description of technical issue]  
**SAFETY IMPACT:** [Risk if continuing automated vs. manual]  
**OPERATIONAL IMPACT:** [Capacity reduction, timeline effects]  
**RECOMMENDED ACTION:** [Specific override request]  
**DURATION:** [Expected time in manual mode]  
**APPROVAL REQUESTED BY:** [Deadline for decision]

#### Step 3: Implementation Verification
1. **Pre-Override Checklist**
   - [ ] Authorization received and documented
   - [ ] Crew briefed on manual procedures
   - [ ] Safety equipment verified operational
   - [ ] Communication channels confirmed working

2. **Override Activation**
   - [ ] Systems switched to manual mode
   - [ ] Automated safety systems remain active where possible
   - [ ] Manual operation commenced with continuous monitoring

3. **Status Communication**
   - [ ] Technical Team: "Manual override implemented for [system]. Estimated duration: [time]"
   - [ ] Incident Coordinator: "Operations status: Manual mode - [capacity]% capacity"
   - [ ] Executive (Level 3-4): "Manual operations authorized - safety verified"

### Special Circumstances

#### CCTV Blackout Response
- **Immediate:** Station manual spotters at affected zones
- **Short-term:** Implement buddy system for crane operations
- **Extended:** Consider operations suspension if safety compromised

#### AIS Signal Loss
- **Immediate:** Switch to radar/visual navigation
- **Short-term:** Coordinate with harbor master for traffic management
- **Extended:** Reduce vessel movement to essential only

#### Crew Safety Concerns
- **Listen:** Take crew concerns seriously - they know equipment best
- **Assess:** Evaluate technical safety vs. crew confidence
- **Decide:** Err on side of caution if crew expertise suggests risk

### Quality Assurance During Manual Operations

#### Continuous Monitoring Requirements
- [ ] Double-check all manual operations
- [ ] Maintain communication every 15 minutes
- [ ] Document all decisions and actions
- [ ] Watch for crew fatigue or stress

#### Safety Verification Steps
- [ ] Verify each manual action before execution
- [ ] Maintain clear communication channels
- [ ] Have abort procedures ready
- [ ] Monitor crew stress and competence levels

### Communication Templates

#### To Technical Team:
"Manual override authorized for [system]. Please prioritize [system] restoration. Operations continuing at [X]% capacity."

#### To Executive Team:
"Manual operations implemented safely. Impact: [description]. Restoration timeline: [estimate]. Continuous monitoring in place."

#### To All Teams:
"OPERATIONS UPDATE: [System] in manual mode. Safety verified. Expected capacity: [X]%. Updates every 30 minutes."

### Return to Automated Operations

#### Pre-Restoration Checklist
- [ ] Technical issue resolved and verified
- [ ] Systems tested in non-operational mode
- [ ] Crew briefed on return to automation
- [ ] Manual override authorization formally closed

#### Restoration Process
1. **Gradual Transition:** Return one system at a time where possible
2. **Verification:** Confirm each system functioning before full automation
3. **Monitoring:** Increased monitoring for first 30 minutes after restoration
4. **Documentation:** Record lessons learned and process improvements

### Success Criteria
- Manual operations implemented safely without delay
- Clear authorization trail documented
- Operational capacity maintained at acceptable level
- Crew confidence and safety maintained
- Smooth transition back to automated operations

### Related Procedures
- Use with: CCTV Blackout Response SOP
- Coordinate with: Safety Risk Assessment Template
- Reference: Technical Containment Guide (if technical cause suspected)
- Escalate to: Crisis Decision Authority Matrix (for complex authorization)

---

## Competency Validation Procedures

### Purpose
This procedure provides quick competency validation checklists before authorizing manual operations, ensuring personnel have adequate skills and experience to safely perform manual procedures during system failures.

### When to Use
- Before authorizing manual override operations
- When switching from automated to manual operations
- During extended manual operation periods
- When crew expresses safety concerns about manual procedures
- After significant time gaps in manual operation experience

### Pre-Operation Competency Assessment

#### Crane Operator Manual Competency Check
**Basic Qualifications Verification (2 minutes):**
- [ ] **Current Certification:** Valid crane operator certification on file
- [ ] **Medical Clearance:** Current medical clearance for manual operations
- [ ] **Experience Level:** Minimum 6 months manual crane operation experience
- [ ] **Recent Practice:** Manual operation within last 90 days

**Skill Assessment Questions (3 minutes):**
1. **Load Limits:** "What is the maximum load for this crane in manual mode?"
2. **Wind Restrictions:** "At what wind speed do we stop manual crane operations?"
3. **Emergency Procedures:** "How do you execute emergency stop during manual lift?"
4. **Communication:** "What radio protocol do you use with spotters?"
5. **Safety Zones:** "Where are the exclusion zones for this crane?"

**Physical Readiness Check (2 minutes):**
- [ ] **Alertness:** Operator alert and focused (no signs of fatigue)
- [ ] **Physical Condition:** No impairment from illness, medication, or stress
- [ ] **Stress Level:** Comfortable with manual operation responsibility
- [ ] **Communication Ability:** Clear radio communication demonstrated

#### Spotter Competency Assessment
**Essential Qualifications (2 minutes):**
- [ ] **Training Completion:** Completed spotter safety training
- [ ] **Communication Skills:** Clear, loud voice and radio proficiency
- [ ] **Visual Acuity:** Adequate vision for spotting operations
- [ ] **Experience:** Previous spotting experience or recent training

**Knowledge Verification (3 minutes):**
1. **Hand Signals:** Demonstrate standard crane hand signals
2. **Emergency Signals:** Show emergency stop signal
3. **Position Awareness:** Identify safe spotting positions
4. **Communication Protocol:** Explain radio communication procedures
5. **Safety Responsibilities:** Describe spotter safety obligations

#### Technical Personnel System Override Competency
**System Knowledge Assessment (5 minutes):**
- [ ] **System Architecture:** Understanding of system interdependencies
- [ ] **Manual Procedures:** Knowledge of manual override procedures
- [ ] **Safety Interlocks:** Understanding of safety system interactions
- [ ] **Restoration Process:** Knowledge of system restoration procedures

**Technical Skills Verification:**
1. **Override Procedures:** Walk through manual override steps
2. **Safety Verification:** Explain safety checks before override
3. **Monitoring Requirements:** Describe ongoing monitoring needs
4. **Escalation Triggers:** Identify when to escalate or abort

### Competency Decision Matrix

#### APPROVED FOR MANUAL OPERATIONS
**Criteria (All must be met):**
- All basic qualifications current
- Passes skill assessment (80% or better)
- Demonstrates confidence and competence
- No physical or mental impairment factors
- Recent relevant experience documented

#### APPROVED WITH SUPERVISION
**Criteria:**
- Basic qualifications met
- Minor gaps in skill assessment (60-79%)
- Adequate physical and mental readiness
- Requires experienced supervisor oversight
- Additional safety measures implemented

#### TRAINING REQUIRED BEFORE AUTHORIZATION
**Criteria:**
- Basic qualifications met
- Significant skill gaps identified (40-59%)
- Physical and mental readiness adequate
- Requires refresher training before operation
- Alternative qualified personnel available

#### NOT AUTHORIZED FOR MANUAL OPERATIONS
**Criteria:**
- Qualifications expired or inadequate
- Major skill deficiencies (below 40%)
- Physical or mental impairment present
- Lack of confidence or competence
- Safety concerns identified

### Rapid Competency Validation (Emergency Situations)

#### 5-Minute Emergency Assessment
**When Time-Critical Situations Require Immediate Manual Operations:**

**Step 1: Critical Qualifications (1 minute)**
- [ ] Valid certifications (accept expired if within 30 days)
- [ ] No obvious impairment or safety concerns
- [ ] Operator expresses confidence in ability

**Step 2: Essential Skills Check (2 minutes)**
- [ ] Demonstrate emergency stop procedure
- [ ] Confirm understanding of load limits
- [ ] Verify communication with spotters

**Step 3: Safety Briefing (2 minutes)**
- [ ] Review specific hazards for this operation
- [ ] Confirm emergency procedures
- [ ] Establish enhanced monitoring

**Emergency Authorization Criteria:**
- Safety-critical situation requiring immediate action
- No fully qualified personnel immediately available
- Operator meets minimum emergency criteria
- Enhanced supervision and safety measures in place

### Ongoing Competency Monitoring

#### During Manual Operations
**Continuous Assessment Indicators:**
- [ ] **Performance Quality:** Smooth, controlled operations
- [ ] **Communication Effectiveness:** Clear, timely communication
- [ ] **Safety Awareness:** Appropriate caution and awareness
- [ ] **Stress Management:** Maintaining composure under pressure
- [ ] **Decision Making:** Sound operational decisions

**Performance Monitoring Checklist (Every 30 minutes):**
- [ ] Operations proceeding smoothly
- [ ] Communication clear and effective
- [ ] No signs of fatigue or stress
- [ ] Safety procedures being followed
- [ ] Quality of work maintaining standards

#### Competency Deterioration Warning Signs
**Immediate Intervention Required:**
- Unsafe operational practices
- Poor communication or coordination
- Signs of fatigue or impairment
- Expressions of uncertainty or fear
- Equipment handling errors

**Intervention Actions:**
1. **Immediate:** Stop current operation safely
2. **Assessment:** Evaluate cause of performance decline
3. **Decision:** Rest, supervision, or replacement
4. **Documentation:** Record competency concerns

### Extended Manual Operation Considerations

#### Shift Changes and Handovers
**Competency Verification for New Personnel:**
- [ ] Brief incoming personnel on current situation
- [ ] Verify competency of replacement personnel
- [ ] Ensure continuity of safety standards
- [ ] Document shift change competency decisions

#### Fatigue Management
**Monitoring for Operator Fatigue:**
- Maximum 4 hours continuous manual operation
- Mandatory 15-minute breaks every 2 hours
- Enhanced monitoring after 2 hours of operation
- Immediate replacement if fatigue signs observed

### Training and Development

#### Competency Gap Identification
**Common Skill Gaps:**
- Manual operation procedures not recently practiced
- Communication protocols not familiar
- Safety procedures not well understood
- Equipment limitations not fully known

#### Rapid Training Procedures
**Quick Skills Refresher (15-30 minutes):**
- Review of manual operation procedures
- Practice of communication protocols
- Safety procedure walkthrough
- Equipment familiarization update

### Documentation Requirements

#### Competency Assessment Records
**Required Documentation:**
- Personnel competency assessment results
- Authorization decisions and rationale
- Training provided or required
- Performance monitoring observations
- Any competency-related incidents

#### Post-Operation Review
**Competency Performance Analysis:**
- Effectiveness of competency validation process
- Personnel performance during manual operations
- Training needs identified
- Process improvements recommended

### Success Criteria
- All manual operations performed by competent, authorized personnel
- No safety incidents due to operator incompetence
- Effective competency validation process that doesn't delay emergency response
- Continuous improvement of personnel skills and readiness
- Clear documentation of competency decisions and rationale

---

**Owner:** Ops Lead\
**Reference:** TECH-08\
**Version:** 1.0\
**Approved by:** Cyber-Ops Coordination Cell
