# Portfall Maritime Cybersecurity Simulation - Demo Guide

## Demo Overview
**Target Audience**: Maritime cybersecurity training stakeholders
**Duration**: 20-25 minutes
**Format**: MS Teams screen share with PowerPoint + Live Demo
**Objective**: Showcase capabilities for upcoming maritime scenario exercises

---

## Part 1: PowerPoint Overview (8-10 minutes)

### Slide 1-2: Problem Statement
- **Challenge**: Maritime cybersecurity incidents are complex, multi-stakeholder crises
- **Training Gap**: Need realistic scenarios with authentic technical and business pressures
- **Real Impact**: Port operations, safety systems, regulatory compliance, public trust

### Slide 3-4: Portfall Solution Architecture
- **JSON-driven scenario engine**: 1,795 lines of realistic crisis events
- **Real-time multi-dashboard simulation**: MQTT-based live updates
- **Role-based crisis management training**: 6+ concurrent team perspectives
- **Time-compressed realism**: 2-hour crisis in 20-minute simulation

### Slide 5-6: Training Capabilities Matrix
```
Technical Teams    → System diagnostics, forensic analysis, incident containment
Operations Teams   → Business continuity, safety protocols, manual procedures  
Executive Teams    → Strategic decisions, media response, regulatory compliance
Legal Teams        → Insurance claims, breach notifications, liability management
Media Teams        → Crisis communications, public relations, stakeholder management
Incident Coord     → Multi-team coordination, timeline tracking, decision logging
```

### Slide 7-8: Scenario Realism Features
- **Authentic Maritime Context**: AIS tracking, CCTV surveillance, container routing systems
- **Realistic Stakeholder Network**: Vendors, insurers, regulators, media, government
- **Escalating Complexity**: 4 distinct crisis phases with increasing severity
- **Multi-Vector Attack**: Combines cyber intrusion with operational disruption
- **Evidence Trail**: Forensic artifacts for technical investigation training

### Slide 9: Technical Architecture
- **Frontend**: React-based role-specific dashboards
- **Backend**: Python scenario engine with MQTT messaging
- **Data Flow**: Real-time updates via WebSocket connections
- **Containerized**: Docker-based deployment for easy setup
- **Customizable**: JSON scenario files for different threat scenarios

---

## Part 2: Live System Demonstration (12-15 minutes)

### Demo Segment 1: Scenario Engine (3 minutes)
**"Let me show you how this actually works..."**

1. **Start Fresh Scenario**
   - Show scenario control interface at http://localhost:3000
   - Launch new scenario from T+0
   - **Talk Track**: "Everything is driven by our JSON scenario file with 100+ realistic events scheduled across 4 crisis phases"

2. **Show Initial Events** (T+2-5)
   - Email notifications appearing in real-time
   - AIS anomaly starting (ships disappearing)
   - **Talk Track**: "Notice how it starts subtle - just like real incidents. Teams initially see routine operational issues"

### Demo Segment 2: Multi-System Impact (4 minutes)
**"Watch how technical failures cascade into business problems..."**

1. **AIS Dashboard** (60 seconds)
   - Navigate to `/ais` 
   - Ships disappearing from tracking map
   - **Talk Track**: "Maritime operations depend on vessel visibility. Loss of AIS creates navigation safety concerns"

2. **CCTV System** (60 seconds)
   - Switch to `/cctv`
   - Camera blackouts at critical berths
   - **Talk Track**: "Visual confirmation is essential for port safety. Multiple camera failures indicate systematic attack"

3. **Container Operations** (60 seconds)
   - Navigate to `/containers`
   - Routing errors, misplaced cargo alerts
   - **Talk Track**: "Now we have client complaints, operational disruption, and potential safety hazards with misrouted containers"

4. **Email Communications** (60 seconds)
   - Switch to `/email`
   - Show vendor leak notifications, client complaints, regulatory inquiries
   - **Talk Track**: "External stakeholders are demanding answers. Information leaks create reputational risk"

### Demo Segment 3: Multi-Role Crisis Response (3 minutes)
**"Different teams see different aspects of the same crisis..."**

1. **Technical Team View** (45 seconds)
   - Navigate to `/technical`
   - System logs, authentication failures, forensic evidence
   - **Talk Track**: "Technical teams focus on threat containment and evidence collection for investigation"

2. **Executive Team View** (45 seconds)
   - Switch to `/executive`
   - Strategic decisions, business impact summaries
   - **Talk Track**: "Leadership needs high-level situation awareness for strategic decisions and stakeholder management"

3. **Legal Team View** (45 seconds)
   - Navigate to `/legal`
   - Insurance queries, regulatory notifications, compliance requirements
   - **Talk Track**: "Legal manages regulatory compliance, insurance claims, and liability exposure"

4. **Media Dashboard** (45 seconds)
   - Switch to `/media`
   - Social media activity, news coverage, public pressure
   - **Talk Track**: "Public pressure builds through social media and news coverage, requiring crisis communications"

### Demo Segment 4: Advanced Features (2 minutes)
**"The system provides sophisticated crisis management capabilities..."**

1. **Real-time Progression** (60 seconds)
   - Show live event timeline advancing
   - Multiple dashboards updating simultaneously
   - **Talk Track**: "All teams see the crisis evolving in real-time, forcing coordination and rapid decision-making"

2. **Scenario Flexibility** (60 seconds)
   - Mention JSON customization capabilities
   - Role-based access and perspectives
   - **Talk Track**: "Scenarios are easily customized for your specific threats, stakeholders, and learning objectives"

---

## Part 3: Q&A and Application Discussion (5 minutes)

### Key Talking Points

#### Scalability & Implementation
- **Multi-team Support**: Supports 6+ concurrent teams with role-specific views
- **Easy Deployment**: Docker-based setup, minimal technical requirements
- **Customization**: JSON scenarios easily modified for your specific environment and threats
- **Integration Ready**: MQTT architecture supports connection to real port management systems

#### Training Effectiveness
- **Realistic Pressure**: Time-compressed scenarios create authentic decision pressure
- **Cross-functional Coordination**: Forces teams to communicate and coordinate responses
- **Performance Metrics**: Built-in logging for performance assessment and after-action review
- **Repeatable Exercises**: Same scenario can be run multiple times with different outcomes

#### Flexibility for Maritime Context
- **Threat Scenarios**: Easily adapt for ransomware, insider threats, supply chain attacks
- **Stakeholder Networks**: Customize for your specific regulatory and business environment
- **System Integration**: Can connect to actual port management systems for higher fidelity
- **Progressive Difficulty**: Scenarios can escalate based on team performance

### Expected Questions & Responses

**Q: How long does setup take?**
A: Complete deployment in under 10 minutes with Docker. Scenario customization depends on complexity but typically 2-4 hours for new scenarios.

**Q: Can it handle our specific port systems?**
A: Yes, the MQTT architecture is designed for integration with real maritime systems like AIS feeds, port management software, and security cameras.

**Q: How do you measure training effectiveness?**
A: Built-in logging captures all decisions, response times, and team coordination. After-action reports show communication patterns and decision quality.

**Q: What about different threat scenarios?**
A: JSON scenario files make it easy to create ransomware attacks, insider threats, supply chain compromises, or physical security breaches.

---

## Demo Success Metrics

### Primary Objectives
- [ ] Demonstrate realistic maritime crisis simulation
- [ ] Show multi-stakeholder coordination challenges
- [ ] Highlight technical sophistication and customization
- [ ] Prove scalability for their upcoming exercises

### Secondary Objectives
- [ ] Generate interest in pilot deployment
- [ ] Identify specific customization requirements
- [ ] Establish timeline for potential implementation
- [ ] Gather feedback for enhancement priorities

---

## Technical Requirements for Demo

### Pre-Demo Checklist
- [ ] All Docker services running (`docker-compose up -d`)
- [ ] Fresh scenario state (reset if needed)
- [ ] Browser bookmarks for quick navigation
- [ ] Screen sharing tested and optimized
- [ ] Backup screenshots prepared

### Demo Day Setup
1. **Start Services**: Follow startup instructions
2. **Test Navigation**: Verify all dashboards load correctly
3. **Launch Scenario**: Begin from clean state
4. **Monitor Timing**: Keep segments within allocated time
5. **Engage Audience**: Ask for feedback and questions throughout