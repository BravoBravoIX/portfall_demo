# Phase-by-Phase Team Guide for Facilitators

## Document Information
**Intended Users:** Facilitators and Exercise Controllers  
**Purpose:** Guide facilitators on what each team should be doing in each phase  
**Usage:** Reference during exercise to understand team activities and answer questions

---

## Exercise Overview

The Portfall Maritime Cybersecurity Simulation is structured around escalating cyber incidents affecting port operations. Teams must coordinate to investigate, contain, and respond to increasingly complex system failures while maintaining operational safety and regulatory compliance.

**Duration:** Approximately 4 hours  
**Teams:** Technical, Operations, Legal, Media, Executive, Incident Coordinator

---

# PHASE 1: Initial Detection (0-30 minutes)
**Timeline:** First 30 minutes of exercise  
**Inject Range:** INJ001A - INJ002D  
**Overall Scenario:** Network routing delays and initial AIS signal anomalies detected

## **Phase 1 Overview**
Initial technical anomalies emerge that appear to be routine IT issues but begin showing patterns suggesting something more serious. Teams are establishing their response procedures and beginning coordination.

### **Technical Team Phase 1**
**Primary Activities:**
- Investigating network routing delays to manifest system (INJ001A)
- Analyzing packet queue spikes from Node-04 (INJ001B)  
- Beginning systematic investigation of network infrastructure
- Starting to correlate network issues with AIS signal problems

**Key Decisions:**
- Whether to escalate network investigation to cyber team level
- How to prioritize Node-04 traffic investigation vs. external gateway diagnostics
- When to begin evidence preservation procedures

**Expected Outputs:**
- Initial technical assessment of network routing issues
- Preliminary investigation of Node-04 anomalies
- Basic system status report for other teams

**Facilitator Guidance:**
*Technical team should be methodical but not immediately jump to "cyber attack" conclusions. Let them discover the complexity gradually.*

### **Operations Team Phase 1**
**Primary Activities:**
- Monitoring impact of network delays on operational systems
- Assessing whether network issues affect crane/container operations
- Maintaining normal operational tempo while staying alert for escalation

**Key Decisions:**
- Whether network delays warrant operational procedure changes
- How closely to monitor automated systems for degradation
- When to implement enhanced communication protocols

**Expected Outputs:**
- Operational impact assessment of network issues
- Confirmation that operations are continuing normally
- Readiness assessment for potential manual procedures

**Facilitator Guidance:**
*Operations should be cautiously optimistic but prepared. They're not seeing major impacts yet but should be establishing enhanced monitoring.*

### **Legal Team Phase 1**
**Primary Activities:**
- Monitoring technical team findings for potential legal implications
- Reviewing notification requirements for IT incidents
- Beginning to assess whether this could become a reportable incident

**Key Decisions:**
- Whether current issues warrant legal monitoring vs. standard IT troubleshooting
- If any preliminary notifications or documentation should begin
- How closely to coordinate with technical investigation

**Expected Outputs:**
- Assessment that current issues are likely routine
- Confirmation of notification requirements if escalation occurs
- Basic legal readiness for potential incident escalation

**Facilitator Guidance:**
*Legal team should be in monitoring mode, not active response. They're gathering information and preparing for potential escalation.*

### **Media Team Phase 1**
**Primary Activities:**
- Monitoring for any external visibility of network issues
- Preparing standard holding statements for potential IT inquiries
- Watching for social media or public mentions of port system issues

**Key Decisions:**
- Whether to proactively prepare statements about IT maintenance
- How to monitor for external detection of issues
- When to coordinate with operations on public-facing impacts

**Expected Outputs:**
- Confirmation that issues are not yet externally visible
- Basic communications readiness for IT-related inquiries
- Social media monitoring protocols activated

**Facilitator Guidance:**
*Media team should be in quiet monitoring mode. No external communications needed yet, but they should be preparing for potential visibility.*

### **Executive Team Phase 1**
**Primary Activities:**
- Receiving updates from technical and operations teams
- Monitoring for escalation triggers requiring executive attention
- Maintaining normal business operations while staying informed

**Key Decisions:**
- Level of attention to give to reported IT issues
- Whether to request more frequent updates
- How to balance normal business activities with incident monitoring

**Expected Outputs:**
- Acknowledgment of IT issues and confidence in team response
- Confirmation that no executive intervention required yet
- Readiness for escalation if issues expand

**Facilitator Guidance:**
*Executive team should be aware but not concerned. Routine IT issues don't typically require executive involvement at this stage.*

### **Incident Coordinator Phase 1**
**Primary Activities:**
- Monitoring technical investigation progress
- Ensuring communication flow between teams
- Assessing whether formal incident procedures should be activated

**Key Decisions:**
- Whether to declare formal incident status
- How frequently to coordinate team updates
- When to begin structured incident documentation

**Expected Outputs:**
- Coordination of technical and operational team activities
- Decision on incident status (likely still informal monitoring)
- Communication schedule established for potential escalation

**Facilitator Guidance:**
*Incident Coordinator should be facilitating communication but not necessarily in full incident mode yet. They're watching for escalation triggers.*

---

## **Phase 1 Common Questions and Answers**

### **Technical Team Questions:**
**Q: "Should we immediately suspect a cyber attack?"**  
**A:** Start with standard troubleshooting. Consider cyber possibilities but don't jump to conclusions without evidence.

**Q: "Do we need to preserve evidence at this stage?"**  
**A:** Begin basic documentation, but full forensic procedures aren't necessary yet unless you find clear indicators of compromise.

**Q: "Should we coordinate with vendor about gateway issues?"**  
**A:** Standard vendor communication is appropriate for routing problems.

### **Operations Team Questions:**
**Q: "Should we start implementing manual procedures?"**  
**A:** Not yet. Monitor systems closely but continue normal operations unless you see direct operational impact.

**Q: "How concerned should we be about these network delays?"**  
**A:** Vigilant but not alarmed. Network issues happen, but they could escalate.

### **Legal Team Questions:**
**Q: "Do we need to make any notifications yet?"**  
**A:** No regulatory notifications required for routine IT issues. Monitor for escalation.

**Q: "Should we implement legal hold?"**  
**A:** Not yet. Standard IT troubleshooting doesn't trigger legal hold requirements.

### **Media Team Questions:**
**Q: "Should we proactively communicate about IT maintenance?"**  
**A:** No proactive communication needed. Monitor for external detection but these appear to be internal issues.

### **Executive Team Questions:**
**Q: "How worried should we be?"**  
**A:** Appropriately concerned but not alarmed. Your teams are responding well to what appears to be routine IT issues.

---

# PHASE 2: Escalation Recognition (30-60 minutes)
**Timeline:** 30-60 minutes into exercise  
**Inject Range:** INJ003A - INJ003G  
**Overall Scenario:** CCTV blackout occurs, forcing manual operations and revealing coordinated system failures

## **Phase 2 Overview**
The incident escalates significantly as CCTV systems fail, creating safety concerns and forcing manual operations. Teams realize this is beyond routine IT issues and begin formal incident response procedures.

### **Technical Team Phase 2**
**Primary Activities:**
- Investigating complete CCTV blackout (INJ003A)
- Analyzing Node-04 isolation impact on CCTV relay (INJ003G)
- Beginning VM investigations on vm-opsnode and vm-coretech
- Correlating network issues with CCTV failures

**Key Decisions:**
- Whether to isolate Node-04 knowing it will affect CCTV (coordination with operations)
- How to prioritize CCTV restoration vs. network investigation
- When to implement full evidence preservation procedures

**Expected Outputs:**
- Technical assessment that CCTV failure is not random
- Initial VM investigation findings
- Coordination plan with operations for Node-04 decisions

**Facilitator Guidance:**
*Technical team should realize this is more serious and begin systematic investigation. They should discover the correlation between systems and start finding evidence of deliberate interference.*

### **Operations Team Phase 2**
**Primary Activities:**
- Implementing CCTV Blackout Response procedures
- Deploying manual spotters for crane operations (INJ003F)
- Coordinating with technical team on Node-04 isolation decisions
- Assessing operational capacity under manual procedures

**Key Decisions:**
- Whether to continue container operations without CCTV (safety decision)
- How many operations to halt vs. manual override authorization
- Whether to implement full manual operations protocols

**Expected Outputs:**
- Manual spotter deployment across affected areas
- Operational capacity assessment (likely 50-70% normal capacity)
- Safety status confirmation for continued operations

**Facilitator Guidance:**
*Operations team should be implementing comprehensive manual procedures. This is their time to shine showing they can maintain safe operations despite system failures.*

### **Legal Team Phase 2**
**Primary Activities:**
- Assessing legal implications of CCTV failure for safety compliance
- Reviewing notification requirements for security system failures
- Beginning to consider liability implications of manual operations

**Key Decisions:**
- Whether CCTV failure requires immediate regulatory notification
- Legal exposure from continuing operations with degraded safety systems
- When to implement evidence preservation legal hold

**Expected Outputs:**
- Legal assessment that manual operations are legally permissible with proper procedures
- Determination of notification timeline requirements
- Legal support for operational decisions

**Facilitator Guidance:**
*Legal team should be becoming more active, providing guidance on safe continuation of operations and preparing for potential regulatory requirements.*

### **Media Team Phase 2**
**Primary Activities:**
- Monitoring for external visibility of operational changes
- Preparing statements about temporary operational procedures
- Watching for public concern about port safety

**Key Decisions:**
- Whether to proactively communicate about enhanced safety procedures
- How to frame manual operations positively (backup procedures working)
- When to prepare for potential media inquiries

**Expected Outputs:**
- Draft holding statements about operational resilience
- Social media monitoring for safety concerns
- Coordination with operations on public-facing impacts

**Facilitator Guidance:**
*Media team should be preparing for potential external visibility while emphasizing operational competence and safety maintenance.*

### **Executive Team Phase 2**
**Primary Activities:**
- Receiving briefings on escalated incident status
- Supporting operations team decisions on manual procedures
- Assessing need for enhanced executive involvement

**Key Decisions:**
- Level of executive visibility for incident response
- Support for operations team safety decisions
- Whether to begin stakeholder notifications

**Expected Outputs:**
- Executive endorsement of manual operations procedures
- Enhanced executive monitoring of incident response
- Readiness for potential stakeholder communication

**Facilitator Guidance:**
*Executive team should be more engaged but still supporting team decisions rather than micromanaging. They should show confidence in established procedures.*

### **Incident Coordinator Phase 2**
**Primary Activities:**
- Formally declaring incident status
- Coordinating enhanced communication between all teams
- Managing resource allocation for manual operations

**Key Decisions:**
- Formal incident declaration and notification procedures
- Communication schedule escalation (15-30 minute updates)
- Resource prioritization between investigation and operations

**Expected Outputs:**
- Formal incident declaration and team notifications
- Enhanced coordination schedule implemented
- Clear resource allocation between competing priorities

**Facilitator Guidance:**
*Incident Coordinator should be in full coordination mode, managing the balance between investigation and operational needs.*

---

## **Phase 2 Common Questions and Answers**

### **Technical Team Questions:**
**Q: "Should we isolate Node-04 even though it will affect CCTV?"**  
**A:** Coordinate with operations team. If they can handle manual procedures safely, investigation may justify the isolation.

**Q: "Are we definitely dealing with a cyber attack now?"**  
**A:** Evidence is pointing that way. Focus on systematic investigation and evidence preservation.

**Q: "Should we start full VM investigations?"**  
**A:** Yes, begin systematic VM investigations using the procedures. Watch for trap scripts.

### **Operations Team Questions:**
**Q: "Is it safe to continue operations without CCTV?"**  
**A:** With proper manual procedures and adequate spotter coverage, yes. Your Enhanced Crane Safety procedures should be implemented.

**Q: "How much should we reduce operations?"**  
**A:** Assess based on available personnel for spotting. Typically 50-70% capacity with enhanced safety procedures.

**Q: "Should we halt all operations?"**  
**A:** Only if you cannot ensure safety with manual procedures. Your procedures are designed to handle this situation.

### **Legal Team Questions:**
**Q: "Do we need to notify regulators about CCTV failure?"**  
**A:** Review notification timeline requirements. May need notifications if safety systems are compromised, but manual procedures may satisfy requirements.

**Q: "Are we liable if something happens during manual operations?"**  
**A:** As long as you follow established manual procedures and maintain safety standards, liability is managed.

### **Media Team Questions:**
**Q: "Should we proactively announce that we're using manual procedures?"**  
**A:** Only if operationally beneficial. You can frame it as backup procedures demonstrating operational resilience.

**Q: "What if media ask about safety with CCTV down?"**  
**A:** Emphasize that robust manual procedures ensure continued safe operations.

### **Executive Team Questions:**
**Q: "Should I be more directly involved now?"**  
**A:** Enhanced monitoring yes, but let teams execute their procedures. Be ready for escalation if needed.

**Q: "Are our operations safe?"**  
**A:** Yes, with proper manual procedures. Your operations team has trained for this.

---

# PHASE 3: Multi-System Crisis (60-120 minutes)
**Timeline:** 60-120 minutes into exercise  
**Inject Range:** INJ004A - INJ011F  
**Overall Scenario:** Media pressure increases, multiple systems fail, authentication problems emerge, container misrouting occurs

## **Phase 3 Overview**
The incident becomes a full crisis as multiple systems fail simultaneously, media attention intensifies, and operational impacts become significant. Teams must coordinate complex response while under external pressure.

### **Technical Team Phase 3**
**Primary Activities:**
- Investigating AIS multi-ship blackout (INJ005A)
- Responding to authentication failures for svc_gantry (INJ008A)
- Discovering unauthorized cron jobs and log deletion (INJ016B)
- Managing evidence transfer to vm-audit with chain of custody

**Key Decisions:**
- How to prioritize multiple simultaneous technical failures
- Whether to attempt system restoration or focus on investigation
- How to coordinate evidence preservation across multiple compromised systems

**Expected Outputs:**
- Systematic investigation findings from multiple VMs
- Evidence package transferred to vm-audit with proper chain of custody
- Technical assessment of coordinated attack patterns

**Facilitator Guidance:**
*Technical team should be discovering clear evidence of coordinated attack. They should be finding trap scripts, unauthorized access, and evidence of deliberate system compromise. This is where their investigation procedures are most critical.*

### **Operations Team Phase 3**
**Primary Activities:**
- Managing container misrouting incidents (INJ010B)
- Implementing manual operations across multiple failed systems
- Coordinating with technical team on service account failures
- Managing operational capacity with multiple system failures

**Key Decisions:**
- Whether to halt operations due to multiple system failures
- How to manage container operations with authentication failures
- When to escalate to executive for operations halt decision

**Expected Outputs:**
- Multi-system manual operations implementation
- Container incident management and client communication coordination
- Operational capacity assessment (likely 30-50% normal capacity)

**Facilitator Guidance:**
*Operations team should be stretched but demonstrating competence under pressure. They may need to consider operations halt for safety, but should attempt to maintain critical operations with enhanced procedures.*

### **Legal Team Phase 3**
**Primary Activities:**
- Managing breach classification decisions (evidence of cyber attack)
- Coordinating regulatory notifications for multi-system failure
- Handling insurance communications and liability assessment
- Managing vendor liability issues and contract implications

**Key Decisions:**
- Formal breach classification and notification requirements
- How to handle vendor contract issues during incident
- Whether to delay vendor payments pending investigation
- Insurance notification and claim preparation

**Expected Outputs:**
- Formal breach classification and regulatory notification preparation
- Legal guidance on vendor relationships during incident
- Insurance coordination and liability assessment

**Facilitator Guidance:**
*Legal team should be very active now. This is clearly a reportable incident requiring formal legal response. They should be coordinating multiple legal workstreams while supporting operational decisions.*

### **Media Team Phase 3**
**Primary Activities:**
- Managing social media crisis from anonymous posts (INJ004A)
- Responding to media scraping and vendor leak concerns (INJ004B, INJ004E)
- Preparing for potential interview requests
- Managing internal communication during crisis

**Key Decisions:**
- How to respond to anonymous social media posts
- Whether to proactively address vendor leak concerns
- How to prepare for potential media interview requests
- What information can be shared vs. withheld for investigation

**Expected Outputs:**
- Crisis communication strategy implementation
- Social media monitoring and response protocols
- Prepared statements for potential media inquiries

**Facilitator Guidance:**
*Media team should be managing multiple communication challenges. They need to balance transparency with investigation needs and manage both internal and external communication pressures.*

### **Executive Team Phase 3**
**Primary Activities:**
- Making strategic decisions about operations continuation vs. halt
- Managing board and stakeholder communication
- Supporting legal team on major decisions (breach classification, notifications)
- Considering financial implications of vendor payment delays

**Key Decisions:**
- Whether to halt operations for safety/security reasons
- How much information to share with board and major stakeholders
- Whether to delay vendor payments pending investigation
- Level of external expertise to bring in for response

**Expected Outputs:**
- Strategic decisions on operations continuation
- Stakeholder communication strategy
- Authorization for major legal and financial decisions

**Facilitator Guidance:**
*Executive team should be making tough strategic decisions under pressure. They need to balance operational continuity with safety, legal compliance, and stakeholder confidence.*

### **Incident Coordinator Phase 3**
**Primary Activities:**
- Coordinating complex multi-team response
- Managing resource conflicts between investigation and operations
- Implementing crisis communication protocols
- Preparing for potential external assistance

**Key Decisions:**
- How to prioritize resources between competing urgent needs
- Whether to request external incident response assistance
- How to manage information sharing between teams
- When to escalate to highest levels of organization

**Expected Outputs:**
- Effective coordination of multi-team crisis response
- Resource allocation decisions balancing all team needs
- Crisis communication coordination across all teams

**Facilitator Guidance:**
*Incident Coordinator should be orchestrating a complex response. This is the most challenging period requiring skilled coordination to prevent teams from working at cross-purposes.*

---

## **Phase 3 Common Questions and Answers**

### **Technical Team Questions:**
**Q: "Should we focus on restoration or investigation?"**  
**A:** Investigation and evidence preservation are priorities. Restoration attempts could compromise evidence. Coordinate with operations on manual procedures.

**Q: "We found the trap scripts - should we run them to see what they do?"**  
**A:** NO. Document them but do not execute. Your procedures explicitly warn about these traps.

**Q: "How do we prioritize multiple VM investigations?"**  
**A:** Follow your VM-specific procedures systematically. Start with evidence preservation, then analyze. Use your Multi-System Failure Guide.

### **Operations Team Questions:**
**Q: "Should we halt all operations now?"**  
**A:** Assess safety with current manual procedures. If you can maintain safety with reduced capacity, continue. If not, halt may be necessary.

**Q: "How do we handle the container misrouting with clients?"**  
**A:** Follow Container Operations Emergency Procedures. Coordinate with legal team on client communications.

**Q: "What if crew refuse to work without automated systems?"**  
**A:** Their safety concerns are valid. Don't force operations if crew are not confident in safety.

### **Legal Team Questions:**
**Q: "Is this definitely a reportable breach now?"**  
**A:** Yes, evidence of coordinated cyber attack requires regulatory notification. Use your Breach Classification procedures.

**Q: "Should we delay vendor payments?"**  
**A:** Consider but coordinate with executive team. Review contracts for force majeure provisions.

**Q: "How do we handle multiple notification requirements?"**  
**A:** Use your regulatory timeline compliance procedures. Prioritize by legal requirement deadlines.

### **Media Team Questions:**
**Q: "How do we respond to anonymous social media posts?"**  
**A:** Don't dignify with direct response, but monitor for spread. Prepare factual counter-narrative if needed.

**Q: "Should we proactively address the vendor leak concerns?"**  
**A:** Coordinate with legal team. May be better to address directly than let speculation grow.

### **Executive Team Questions:**
**Q: "Should I halt all operations?"**  
**A:** Get safety assessment from operations team. If they can maintain safety with procedures, support their decision.

**Q: "How much should I tell the board?"**  
**A:** Brief them on situation and response, but avoid speculation about causes while investigation ongoing.

### **Incident Coordinator Questions:**
**Q: "How do I prioritize between investigation and operations?"**  
**A:** Use your Multi-System Failure Coordination Guide. Both are critical - coordinate rather than choosing.

---

# PHASE 4: Final Crisis Management (120+ minutes)
**Timeline:** Final 60+ minutes of exercise  
**Inject Range:** INJ012A - INJ021D  
**Overall Scenario:** Insurance demands, live TV pressure, final breach notifications, and resolution decisions

## **Phase 4 Overview**
The incident reaches peak intensity with insurance companies demanding logs, TV crews on-site requesting interviews, final regulatory deadlines approaching, and organizations needing to make final response decisions while preparing for recovery.

### **Technical Team Phase 4**
**Primary Activities:**
- Completing comprehensive evidence package for all stakeholders
- Coordinating with insurers on technical log requests (INJ012A)
- Finalizing cross-system correlation analysis
- Preparing technical input for final incident reports

**Key Decisions:**
- What technical information can be shared with insurers
- How to present technical findings to non-technical stakeholders
- Whether technical evidence supports specific attribution conclusions

**Expected Outputs:**
- Complete technical investigation report with evidence package
- Technical briefing materials for executive and legal teams
- Recommendations for technical improvements and system hardening

**Facilitator Guidance:**
*Technical team should be completing their investigation and transitioning to support mode for other teams. They should have clear evidence of coordinated attack but may not be able to definitively attribute it.*

### **Operations Team Phase 4**
**Primary Activities:**
- Managing operational capacity during extended incident
- Coordinating with technical team on system restoration readiness
- Handling staff stress and fatigue from extended manual operations
- Planning for transition back to automated operations

**Key Decisions:**
- Whether operations can continue sustainably with current manual procedures
- How to manage crew fatigue and morale during extended incident
- When to begin planning for return to automated operations

**Expected Outputs:**
- Sustained safe operations throughout incident
- Crew fatigue and morale management
- Readiness assessment for return to automated operations

**Facilitator Guidance:**
*Operations team should be showing strain but maintaining professionalism. They should be considering sustainability of current operations and planning for recovery phase.*

### **Legal Team Phase 4**
**Primary Activities:**
- Finalizing breach notification documents (INJ019A)
- Managing insurer demands for immediate log access
- Coordinating with executive team on final legal positions
- Preparing for potential regulatory investigations

**Key Decisions:**
- Final language for formal breach notifications
- How much information to provide to insurers immediately
- Legal strategy for potential regulatory investigations
- Attorney-client privilege protection during information sharing

**Expected Outputs:**
- Final breach notification documents ready for executive approval
- Legal strategy for ongoing regulatory compliance
- Documentation ready for potential legal proceedings

**Facilitator Guidance:**
*Legal team should be under intense pressure to finalize regulatory compliance while protecting organization's legal interests. They need to balance transparency requirements with legal strategy.*

### **Media Team Phase 4**
**Primary Activities:**
- Managing live TV crew requests for immediate interviews (INJ012B, INJ020B)
- Implementing Final Media Deadline Management procedures
- Coordinating final public statements with legal and executive teams
- Managing social media and public perception during crisis peak

**Key Decisions:**
- Whether to participate in live TV interviews or provide written statements
- How to balance transparency with investigation protection
- Final public messaging strategy for crisis resolution

**Expected Outputs:**
- Coordinated response to final media deadline pressure
- Professional management of live media requests
- Consistent public messaging supporting organizational response

**Facilitator Guidance:**
*Media team should be under extreme pressure with TV crews on-site and final deadlines. This tests their Final Media Deadline Management procedures under realistic pressure.*

### **Executive Team Phase 4**
**Primary Activities:**
- Making final strategic decisions under maximum pressure
- Approving final legal documents and public statements
- Managing board and major stakeholder communications
- Preparing for post-incident recovery planning

**Key Decisions:**
- Approval of final breach notification language
- Decision on live TV interview participation
- Strategic direction for post-incident recovery
- Level of external assistance to engage for recovery

**Expected Outputs:**
- Final executive decisions on all major crisis response elements
- Approved legal and communication documents
- Strategic direction for organization's path forward

**Facilitator Guidance:**
*Executive team should be making final high-stakes decisions under maximum pressure. This tests their crisis decision-making under realistic stress.*

### **Incident Coordinator Phase 4**
**Primary Activities:**
- Coordinating final incident response activities across all teams
- Preparing comprehensive incident summary for regulatory submission
- Managing final team coordination under maximum pressure
- Planning transition to recovery phase

**Key Decisions:**
- Final coordination priorities among competing urgent demands
- How to prepare for post-incident transition
- Resource allocation for final push vs. recovery planning

**Expected Outputs:**
- Coordinated completion of all final incident response requirements
- Comprehensive incident documentation for regulatory submission
- Successful coordination through crisis peak

**Facilitator Guidance:**
*Incident Coordinator should be managing the final intense coordination while beginning to plan for exercise conclusion and debrief preparation.*

---

## **Phase 4 Common Questions and Answers**

### **Technical Team Questions:**
**Q: "Should we share all technical details with the insurer?"**  
**A:** Coordinate with legal team. Share what's required but protect investigative details that could compromise ongoing security.

**Q: "Can we definitively say who attacked us?"**  
**A:** Probably not. Focus on what you can prove technically - coordinated attack, specific methods used, systems affected.

**Q: "Should we start system restoration now?"**  
**A:** Coordinate with operations team on their needs vs. investigation completion. Don't restore until investigation complete.

### **Operations Team Questions:**
**Q: "How much longer can we sustain manual operations?"**  
**A:** Assess crew fatigue and safety confidence. If either is compromised, may need to reduce operations further.

**Q: "Should we start planning return to automated operations?"**  
**A:** Yes, but coordinate with technical team on investigation completion and system security verification.

### **Legal Team Questions:**
**Q: "Do I have to approve this breach notification language even if it's not perfect?"**  
**A:** Yes, regulatory deadlines take priority. You can always supplement later with additional information.

**Q: "How much do I have to give the insurers right now?"**  
**A:** What's required by your policy, but you can negotiate timing for complex technical details.

### **Media Team Questions:**
**Q: "Should the CEO do the live TV interview with 15 minutes notice?"**  
**A:** Use your Final Media Deadline Management procedures. If CEO is prepared and legal approves, it may be better than letting them proceed without our input.

**Q: "How do we handle the TV crew at our gates?"**  
**A:** Professional but firm. Offer what you can (statement, background briefing) but don't be pressured into inappropriate access.

### **Executive Team Questions:**
**Q: "Should I approve this breach notification even though it might harm us legally?"**  
**A:** Legal compliance takes priority. Your legal team should have balanced legal protection with regulatory requirements.

**Q: "Do I have to decide about the TV interview right now?"**  
**A:** Yes, they're going live regardless. Better to participate professionally than let them proceed with speculation.

### **Incident Coordinator Questions:**
**Q: "How do I manage all these final deadlines at once?"**  
**A:** Prioritize by legal requirement deadlines first, then stakeholder management. Delegate coordination where possible.

---

## **General Facilitator Notes**

### **Maintaining Realism**
- Don't let teams move too fast through procedures
- Enforce realistic time constraints and pressure
- Help teams coordinate when they're struggling with communication
- Remind teams of their documented procedures when they forget

### **Learning Objectives**
- Teams should experience realistic cyber incident pressure
- Coordination between teams should improve throughout exercise
- Teams should rely on their documented procedures under pressure
- Decision-making should balance competing priorities realistically

### **Common Facilitation Challenges**
- Technical team may want to "solve" everything immediately
- Operations team may be too quick to halt operations or too slow to implement manual procedures
- Legal team may be overly cautious or overly permissive
- Media team may want to over-communicate or under-communicate
- Executive team may want to micromanage or be too hands-off
- Incident Coordinator may struggle with resource prioritization

### **Success Indicators**
- Teams using their documented procedures effectively
- Good coordination and communication between teams
- Realistic decision-making under pressure
- Appropriate escalation and resource allocation
- Professional response to external pressure (media, regulators, insurers)

**Remember:** The goal is realistic learning under pressure, not perfect performance. Help teams succeed while maintaining realistic challenge levels.