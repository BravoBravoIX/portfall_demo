# PortFall Simulation Platform

## Overview

PortFall Sim is a sophisticated cybersecurity incident response training platform that simulates a multi-faceted cyber attack on a fictional port terminal operation (Southgate Terminal). The application provides a realistic, time-based scenario where participants must respond to escalating security incidents, make critical decisions, and coordinate responses across multiple teams.

## Core Features

### Real-Time Scenario Engine
- **75-minute scripted cyber incident scenario** with precise timing and escalation
- **Automated event injection system** that delivers emails, system alerts, and incidents at predetermined times
- **Dynamic state management** tracking scenario progress and participant actions
- **Phase-based progression** through four distinct incident phases:
  - Phase 1 (0-15 min): Initial Detection & Insurance Assessment
  - Phase 2 (15-35 min): Vendor Compromise & Escalation
  - Phase 3 (35-55 min): Regulatory Compliance & Crisis Management
  - Phase 4 (55-75 min): Executive Decisions & Resolution

### Multi-Channel Communication System
- **Email simulation** with realistic corporate email interface
- **System alerts** for technical incidents and anomalies
- **Team chat functionality** for incident response coordination
- **Executive notifications** for critical decision points

### Comprehensive Dashboard Interface
- **Real-time incident timeline** showing all events as they occur
- **System status monitors** for critical infrastructure:
  - Container Management System
  - Network Infrastructure
  - CCTV Security System
  - AIS Vessel Tracking
  - Gantry Operations
- **Active alerts panel** displaying current security incidents
- **Participant action tracking** for post-exercise analysis

## User Interface Design

### Visual Styling
The application employs a professional, security-focused design language:

- **Color Scheme:**
  - Primary: Deep blue (#003366) for headers and primary navigation
  - Secondary: Light blue (#4A90E2) for interactive elements
  - Alert Colors: Red (#DC3545) for critical, orange (#FFC107) for warnings
  - Background: Clean white (#FFFFFF) with light gray (#F8F9FA) panels
  - Text: Dark gray (#212529) for optimal readability

- **Typography:**
  - Primary font: -apple-system, BlinkMacSystemFont for native OS integration
  - Monospace font for technical data and logs
  - Clear hierarchy with varied font weights and sizes

### Navigation Structure

#### Top Navigation Bar
- **Logo/Brand:** "PortFall Sim" with port terminal icon
- **Main Menu Items:**
  - Dashboard (home icon)
  - Emails (envelope icon)
  - Documents (folder icon)
  - Systems (server icon)
  - Teams (users icon)
- **Status Indicators:**
  - Current scenario time
  - Phase indicator
  - Active alerts counter

#### Dashboard Layout
The dashboard uses a responsive grid layout with:
- **Header Section:** Scenario title and current phase
- **Timeline Panel:** Scrollable event history with timestamps
- **Systems Grid:** 2x3 grid of system status cards
- **Alerts Sidebar:** Priority-sorted active incidents
- **Quick Actions:** Buttons for common response actions

### Key Pages

#### 1. Dashboard Page
**Purpose:** Central command center for incident response
**Features:**
- Real-time scenario clock with pause/resume controls
- Event timeline with color-coded entries by type
- System health indicators with status badges
- Active incident queue with severity levels
- Quick access to recent emails and documents

#### 2. Email Interface
**Purpose:** Simulate corporate email for scenario communications
**Layout:**
- **Inbox:** Three-column layout (folders, message list, preview)
- **Message Display:** Full email rendering with headers and attachments
- **Folders:** Inbox, Sent, Drafts, scenario-specific folders
**Features:**
- Unread message indicators
- Priority flags for critical emails
- Search functionality
- Attachment handling for scenario documents

#### 3. Documents Repository
**Purpose:** Access to policies, procedures, and reference materials
**Organization:**
- **Policies & Procedures:** Official company documentation
- **Quick Reference Cards:** Role-specific decision guides
- **Incident Forms:** Templates for required notifications
- **Legal & Compliance:** Regulatory requirements and frameworks
**Features:**
- Document preview with syntax highlighting
- Search across all documents
- Bookmark frequently used resources
- Version tracking for updated procedures

#### 4. Systems Console
**Purpose:** Technical view of infrastructure status
**Displays:**
- **Network Topology:** Visual representation of terminal networks
- **System Logs:** Real-time log streaming from affected systems
- **Performance Metrics:** Bandwidth, latency, system load
- **Security Indicators:** Firewall status, intrusion detection alerts
**Interactive Elements:**
- Log filtering and search
- System command interface (simulated)
- Incident correlation tools

#### 5. Team Coordination
**Purpose:** Multi-team communication and task management
**Sections:**
- **Team Channels:** Dedicated spaces for each response team
- **Task Board:** Kanban-style task tracking
- **Decision Log:** Record of key decisions made
- **Resource Allocation:** Track team availability and assignments

### Interactive Components

#### Status Cards
Each system status card includes:
- **Icon:** System-specific icon (container, network, camera, ship, crane)
- **Status Badge:** Operational, Degraded, Critical, Offline
- **Metrics:** Key performance indicators
- **Last Update:** Timestamp of last status change
- **Action Button:** Quick access to system details

#### Alert Notifications
Alert design follows severity levels:
- **Critical (Red):** Immediate action required
- **Warning (Orange):** Attention needed
- **Info (Blue):** Informational updates
- **Success (Green):** Positive confirmations

Each alert includes:
- Severity icon
- Timestamp
- Brief description
- "View Details" action link

#### Data Tables
Used throughout for logs, emails, and records:
- Sortable column headers
- Pagination controls
- Row selection for bulk actions
- Responsive design for mobile viewing
- Export functionality for reports

### Responsive Design
The application adapts to different screen sizes:
- **Desktop (>1200px):** Full multi-column layouts
- **Tablet (768-1199px):** Condensed navigation, stacked panels
- **Mobile (<768px):** Single column, collapsible sections

### Accessibility Features
- **ARIA labels** for all interactive elements
- **Keyboard navigation** support throughout
- **High contrast mode** option
- **Screen reader optimizations**
- **Focus indicators** for keyboard users

## Technical Implementation

### Frontend Architecture
- **HTML5** with semantic markup
- **CSS3** with Bootstrap framework
- **Vanilla JavaScript** for interactivity
- **WebSocket connections** for real-time updates

### Backend Services
- **Python Flask** API server
- **MQTT broker** for event distribution
- **Docker** containerization
- **Nginx** reverse proxy

### Data Flow
1. Scenario engine triggers timed events
2. Events published via MQTT
3. Web clients receive updates via WebSocket
4. UI updates dynamically without page refresh
5. User actions logged for analysis

## Use Cases

### Training Scenarios
- **Incident Response Teams:** Practice coordination and decision-making
- **Legal/Compliance:** Navigate regulatory requirements under pressure
- **Executive Leadership:** Strategic crisis management
- **Technical Teams:** System recovery and investigation

### Assessment Capabilities
- Track participant response times
- Log all decisions and actions
- Generate post-exercise reports
- Identify areas for improvement

### Customization Options
- Modify scenario timing and events
- Add custom email templates
- Update system configurations
- Create role-specific experiences

## Getting Started

### Access Points
- **Main Application:** http://localhost:3000
- **Admin Console:** http://localhost:3000/admin
- **API Documentation:** http://localhost:8000/docs
- **Email Interface:** http://localhost:8025 (MailHog)

### User Roles
- **Participants:** Access to scenario interface
- **Facilitators:** Control scenario flow
- **Administrators:** Full system configuration
- **Observers:** Read-only access for evaluation

This platform provides a comprehensive, realistic environment for cybersecurity incident response training, combining technical accuracy with user-friendly design to create an effective learning experience.