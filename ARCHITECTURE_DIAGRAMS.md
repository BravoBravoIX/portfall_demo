# CyberOps Range Ecosystem - Architecture Diagrams

## Overview
This document provides visual representations of the CyberOps Range Ecosystem architecture, showing platform integration, data flows, and deployment options for defense presentations.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CyberOps Range Ecosystem                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    MQTT Control    ┌─────────────────┐                    │
│  │   SCIP-Range    │ ────────────────── │  Portfall-Sim   │                    │
│  │ (Orchestration) │                    │ (Maritime Ops)  │                    │
│  │                 │                    │                 │                    │
│  │ ┌─────────────┐ │                    │ ┌─────────────┐ │                    │
│  │ │Web UI :80   │ │                    │ │React UI :80 │ │                    │
│  │ └─────────────┘ │                    │ └─────────────┘ │                    │
│  │ ┌─────────────┐ │  scenario/control  │ ┌─────────────┐ │                    │
│  │ │API :4000    │ │ ─────────────────► │ │Agent.py     │ │                    │
│  │ └─────────────┘ │                    │ └─────────────┘ │                    │
│  │ ┌─────────────┐ │                    │ ┌─────────────┐ │                    │
│  │ │MQTT :1883   │ │                    │ │MQTT :1883   │ │                    │
│  │ └─────────────┘ │                    │ └─────────────┘ │                    │
│  └─────────────────┘                    └─────────────────┘                    │
│           │                                       ▲                            │
│           │ RF Effects Control                    │ Channel Effects            │
│           ▼                                       │                            │
│  ┌─────────────────┐    Process IQ Data  ────────┘                            │
│  │    RF-Range     │                                                           │
│  │ (EW Simulation) │                                                           │
│  │                 │                                                           │
│  │ ┌─────────────┐ │                                                           │
│  │ │Python DSP   │ │                                                           │
│  │ └─────────────┘ │                                                           │
│  │ ┌─────────────┐ │                                                           │
│  │ │Socket VM    │ │                                                           │
│  │ └─────────────┘ │                                                           │
│  └─────────────────┘                                                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. MQTT Message Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MQTT Message Bus                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                    ┌─────────────────────────────────┐                         │
│                    │        MQTT Broker              │                         │
│                    │    (Eclipse Mosquitto)          │                         │
│                    │                                 │                         │
│                    │  TCP: 1883                      │                         │
│                    │  WebSocket: 9001                │                         │
│                    └─────────────────────────────────┘                         │
│                                     │                                           │
│        ┌────────────────────────────┼────────────────────────────┐              │
│        │                            │                            │              │
│        ▼                            ▼                            ▼              │
│ ┌─────────────┐             ┌─────────────┐             ┌─────────────┐         │
│ │ SCIP-Range  │             │ Portfall-Sim│             │  RF-Range   │         │
│ │             │             │             │             │             │         │
│ │ Publishers: │             │ Publishers: │             │ Publishers: │         │
│ │ • scenario/ │             │ • portfall/ │             │ • rf/       │         │
│ │   control   │             │   logs      │             │   effects   │         │
│ │ • scenario/ │             │ • portfall/ │             │ • rf/       │         │
│ │   status    │             │   events    │             │   status    │         │
│ │             │             │             │             │             │         │
│ │ Subscribers:│             │ Subscribers:│             │ Subscribers:│         │
│ │ • portfall/ │             │ • scenario/ │             │ • scenario/ │         │
│ │   status    │             │   control   │             │   control   │         │
│ │ • rf/       │             │ • rf/       │             │             │         │
│ │   status    │             │   effects   │             │             │         │
│ └─────────────┘             └─────────────┘             └─────────────┘         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Topic Structure:
• scenario/control       → Start/stop/pause commands
• scenario/status        → Platform status updates
• portfall/logs         → System log events
• portfall/events       → AIS, CCTV, Container events
• rf/effects           → Signal processing parameters
• rf/status            → RF system status
```

## 3. Portfall-Sim Internal Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Portfall-Sim Platform                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐                  │
│  │   Frontend      │ ←─────────────────→ │   Backend       │                  │
│  │   (React UI)    │                     │   Services      │                  │
│  │                 │                     │                 │                  │
│  │ ┌─────────────┐ │                     │ ┌─────────────┐ │                  │
│  │ │Dashboard    │ │                     │ │MQTT Bridge  │ │                  │
│  │ │Components   │ │                     │ │(Node.js)    │ │                  │
│  │ └─────────────┘ │                     │ └─────────────┘ │                  │
│  │ ┌─────────────┐ │                     │ ┌─────────────┐ │                  │
│  │ │Team Pages   │ │                     │ │WebSocket    │ │                  │
│  │ │(6 Roles)    │ │                     │ │Server       │ │                  │
│  │ └─────────────┘ │                     │ └─────────────┘ │                  │
│  │ ┌─────────────┐ │                     │ ┌─────────────┐ │                  │
│  │ │Real-time    │ │                     │ │Email Service│ │                  │
│  │ │Components   │ │                     │ │(SMTP)       │ │                  │
│  │ └─────────────┘ │                     │ └─────────────┘ │                  │
│  └─────────────────┘                     └─────────────────┘                  │
│                                                   │                            │
│                                                   ▼                            │
│  ┌─────────────────┐                     ┌─────────────────┐                  │
│  │   Scenario      │    MQTT Events     │   State Store   │                  │
│  │   Agent         │ ←─────────────────→ │   (Redis)       │                  │
│  │   (Python)      │                     │                 │                  │
│  │                 │                     │ ┌─────────────┐ │                  │
│  │ ┌─────────────┐ │                     │ │Session Data │ │                  │
│  │ │Inject       │ │                     │ └─────────────┘ │                  │
│  │ │Executor     │ │                     │ ┌─────────────┐ │                  │
│  │ └─────────────┘ │                     │ │Scenario     │ │                  │
│  │ ┌─────────────┐ │                     │ │State        │ │                  │
│  │ │State        │ │                     │ └─────────────┘ │                  │
│  │ │Tracker      │ │                     │ ┌─────────────┐ │                  │
│  │ └─────────────┘ │                     │ │Team         │ │                  │
│  │ ┌─────────────┐ │                     │ │Progress     │ │                  │
│  │ │MQTT Handler │ │                     │ └─────────────┘ │                  │
│  │ └─────────────┘ │                     └─────────────────┘                  │
│  └─────────────────┘                                                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Multi-Team Interface Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      Team-Based Interface Design                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Executive Team  │  │ Legal/Compliance│  │ Media/Comms     │                │
│  │                 │  │                 │  │                 │                │
│  │ • Email Portal  │  │ • Email Portal  │  │ • Email Portal  │                │
│  │ • Policy Access │  │ • Policy Access │  │ • Policy Access │                │
│  │ • Media Feed    │  │ • Media Feed    │  │ • Media Feed    │                │
│  │ • Exec Summary  │  │ • Legal Docs    │  │ • Social Media  │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Operations Team │  │ Technical Team  │  │ Incident Coord  │                │
│  │                 │  │                 │  │                 │                │
│  │ • AIS Tracking  │  │ • System Health │  │ • Email Portal  │                │
│  │ • CCTV Feeds    │  │ • Comms Status  │  │ • Policy Access │                │
│  │ • Container Mgmt│  │ • Vendor Portal │  │ • Media Feed    │                │
│  │ • Email Portal  │  │ • Email Portal  │  │ • Team Status   │                │
│  │ • Policy Access │  │ • Policy Access │  │                 │                │
│  │ • Media Feed    │  │ • Media Feed    │  │                 │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│                              ┌─────────────────┐                               │
│                              │  Shared Services│                               │
│                              │                 │                               │
│                              │ • MQTT Messages │                               │
│                              │ • Email System  │                               │
│                              │ • Document Store│                               │
│                              │ • Media Feeds   │                               │
│                              │ • Status Updates│                               │
│                              └─────────────────┘                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5. RF-Range Signal Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     RF-Range Signal Processing Architecture                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    File Transfer    ┌─────────────────┐                   │
│  │ Source System   │ ──────────────────► │ RF-Range Input  │                   │
│  │ (CCTV Stream)   │                     │ Directory       │                   │
│  │                 │                     │ /var/app/       │                   │
│  │ • Video Data    │                     │ incoming/       │                   │
│  │ • IQ Samples    │                     │                 │                   │
│  │ • Image Files   │                     │ ┌─────────────┐ │                   │
│  └─────────────────┘                     │ │image-1.jpg  │ │                   │
│                                          │ │image-2.jpg  │ │                   │
│                                          │ │image-3.jpg  │ │                   │
│                                          │ └─────────────┘ │                   │
│                                          └─────────────────┘                   │
│                                                   │                            │
│                                                   ▼                            │
│  ┌─────────────────┐                     ┌─────────────────┐                   │
│  │ Channel Effects │ ◄─────────────────── │ Python DSP      │                   │
│  │ Processor       │                     │ Pipeline        │                   │
│  │                 │                     │                 │                   │
│  │ ┌─────────────┐ │                     │ ┌─────────────┐ │                   │
│  │ │AWGN         │ │                     │ │File Monitor │ │                   │
│  │ │Generator    │ │                     │ └─────────────┘ │                   │
│  │ └─────────────┘ │                     │ ┌─────────────┐ │                   │
│  │ ┌─────────────┐ │                     │ │Image Loader │ │                   │
│  │ │Path Loss    │ │                     │ └─────────────┘ │                   │
│  │ │Calculator   │ │                     │ ┌─────────────┐ │                   │
│  │ └─────────────┘ │                     │ │Effects      │ │                   │
│  │ ┌─────────────┐ │                     │ │Processor    │ │                   │
│  │ │Multipath    │ │                     │ └─────────────┘ │                   │
│  │ │Simulator    │ │                     │ ┌─────────────┐ │                   │
│  │ └─────────────┘ │                     │ │File Writer  │ │                   │
│  └─────────────────┘                     │ └─────────────┘ │                   │
│                                          └─────────────────┘                   │
│                                                   │                            │
│                                                   ▼                            │
│  ┌─────────────────┐    File Transfer    ┌─────────────────┐                   │
│  │ Target System   │ ◄─────────────────── │ RF-Range Output │                   │
│  │ (Portfall CCTV) │                     │ Directory       │                   │
│  │                 │                     │ /var/app/       │                   │
│  │ • Degraded Video│                     │ outgoing/       │                   │
│  │ • Noisy Images  │                     │                 │                   │
│  │ • Error States  │                     │ ┌─────────────┐ │                   │
│  └─────────────────┘                     │ │processed-1  │ │                   │
│                                          │ │processed-2  │ │                   │
│                                          │ │processed-3  │ │                   │
│                                          │ └─────────────┘ │                   │
│                                          └─────────────────┘                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Configuration Parameters:
• SNR Levels: 0dB to 20dB (configurable)
• Noise Types: AWGN, Impulse, Thermal
• Path Loss: Free space, atmospheric
• Effects: Fading, multipath, interference
```

## 6. Deployment Architecture Options

### Cloud Deployment (AWS)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AWS Cloud Deployment                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐                                                           │
│  │ Route 53 DNS    │                                                           │
│  │ Load Balancer   │                                                           │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ Application     │                                                           │
│  │ Load Balancer   │                                                           │
│  │ (ALB)           │                                                           │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │ ECS Cluster     │    │ ECS Cluster     │    │ ECS Cluster     │           │
│  │ SCIP-Range      │    │ Portfall-Sim    │    │ RF-Range        │           │
│  │                 │    │                 │    │                 │           │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │           │
│  │ │Task Def     │ │    │ │Task Def     │ │    │ │Task Def     │ │           │
│  │ │- Frontend   │ │    │ │- UI         │ │    │ │- DSP        │ │           │
│  │ │- API        │ │    │ │- Agent      │ │    │ │- Processor  │ │           │
│  │ │- MQTT       │ │    │ │- Backend    │ │    │ │- Monitor    │ │           │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │ ElastiCache     │    │ RDS PostgreSQL  │    │ S3 Storage      │           │
│  │ (Redis)         │    │ (State Data)    │    │ (Files/Logs)    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │ CloudWatch      │    │ VPC Networking  │    │ IAM Security    │           │
│  │ (Monitoring)    │    │ (Private Subnets│    │ (Roles/Policies)│           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### On-Premise Deployment
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        On-Premise Deployment                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐                                                           │
│  │ Network         │                                                           │
│  │ Load Balancer   │                                                           │
│  │ (NGINX/HAProxy) │                                                           │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │ Server Node 1   │    │ Server Node 2   │    │ Server Node 3   │           │
│  │ SCIP-Range      │    │ Portfall-Sim    │    │ RF-Range        │           │
│  │                 │    │                 │    │                 │           │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │           │
│  │ │Docker       │ │    │ │Docker       │ │    │ │Docker       │ │           │
│  │ │Containers   │ │    │ │Containers   │ │    │ │Containers   │ │           │
│  │ │- Frontend   │ │    │ │- UI         │ │    │ │- DSP        │ │           │
│  │ │- API        │ │    │ │- Agent      │ │    │ │- Processor  │ │           │
│  │ │- MQTT       │ │    │ │- Backend    │ │    │ │- Monitor    │ │           │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │           │
│  │                 │    │                 │    │                 │           │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │           │
│  │ │Local Storage│ │    │ │Local Storage│ │    │ │Local Storage│ │           │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │ Shared Storage  │    │ Database Server │    │ Monitoring      │           │
│  │ (NFS/CIFS)      │    │ (Redis/Postgres)│    │ (Prometheus)    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Network Infrastructure                                                      │
│  │ • Firewall Rules                                                          │
│  │ • VPN Access                                                              │
│  │ • Network Segmentation                                                    │
│  │ • Air-Gap Capability                                                      │
│  └─────────────────────────────────────────────────────────────────────────────┘
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 7. Data Flow and Integration Points

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Data Flow Architecture                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐                                                           │
│  │ External        │                                                           │
│  │ Integrations    │                                                           │
│  │                 │                                                           │
│  │ • LDAP/AD       │                                                           │
│  │ • SMTP/Email    │                                                           │
│  │ • Monitoring    │                                                           │
│  │ • Logging       │                                                           │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │                        API Gateway Layer                                   │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │REST APIs    │  │MQTT Bridge  │  │WebSocket    │  │File Transfer│       │
│  │ │• Scenarios  │  │• Real-time  │  │• Live Data  │  │• Bulk Data  │       │
│  │ │• Teams      │  │• Commands   │  │• Dashboards │  │• Logs       │       │
│  │ │• Metrics    │  │• Events     │  │• Alerts     │  │• Images     │       │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│           │                        │                        │                  │
│           ▼                        ▼                        ▼                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ SCIP-Range      │  │ Portfall-Sim    │  │ RF-Range        │               │
│  │ Data Stores     │  │ Data Stores     │  │ Data Stores     │               │
│  │                 │  │                 │  │                 │               │
│  │ • Scenarios     │  │ • Exercise Data │  │ • Signal Data   │               │
│  │ • Team Progress │  │ • Team Sessions │  │ • Processing    │               │
│  │ • System Status │  │ • Event Logs    │  │ • Parameters    │               │
│  │ • Metrics       │  │ • Communications│  │ • File Queue    │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 8. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Security Architecture                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ External Security Perimeter                                                 │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │Firewall     │  │VPN Gateway  │  │Web App      │  │DDoS         │       │
│  │ │Rules        │  │(IPSec/SSL)  │  │Firewall     │  │Protection   │       │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│                                      │                                         │
│                                      ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Application Security Layer                                                  │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │Authentication│ │Authorization│  │Session      │  │Input        │       │
│  │ │• LDAP/AD    │  │• RBAC       │  │Management   │  │Validation   │       │
│  │ │• MFA        │  │• Team Roles │  │• Timeouts   │  │• Sanitization│      │
│  │ │• SSO        │  │• Permissions│  │• Encryption │  │• Rate Limiting│     │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│                                      │                                         │
│                                      ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Platform Security Layer                                                     │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │Container    │  │Network      │  │Data         │  │Audit        │       │
│  │ │Isolation    │  │Segmentation │  │Encryption   │  │Logging      │       │
│  │ │• Namespaces │  │• VLANs      │  │• At Rest    │  │• All Actions│       │
│  │ │• Resource   │  │• Micro-seg  │  │• In Transit │  │• Compliance │       │
│  │ │  Limits     │  │• Zero Trust │  │• Key Mgmt   │  │• Forensics  │       │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Compliance & Monitoring                                                     │
│  │                                                                             │
│  │ • Security Event Correlation                                               │
│  │ • Vulnerability Scanning                                                   │
│  │ • Patch Management                                                         │
│  │ • Backup & Recovery                                                        │
│  │ • Incident Response                                                        │
│  └─────────────────────────────────────────────────────────────────────────────┘
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 9. Performance and Scaling Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      Performance & Scaling Architecture                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Load Balancing & Distribution                                               │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │Geographic   │  │Application  │  │Database     │  │Message      │       │
│  │ │Distribution │  │Load Balancer│  │Clustering   │  │Queue        │       │
│  │ │• Multi-Region│ │• Round Robin│  │• Master/    │  │• MQTT       │       │
│  │ │• CDN        │  │• Health     │  │  Replica    │  │• Redis      │       │
│  │ │• Edge       │  │  Checks     │  │• Sharding   │  │  Cluster    │       │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│                                      │                                         │
│                                      ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Horizontal Scaling                                                          │
│  │                                                                             │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ │Auto Scaling │  │Container    │  │Resource     │  │Performance  │       │
│  │ │Groups       │  │Orchestration│  │Monitoring   │  │Optimization │       │
│  │ │• CPU/Memory │  │• Kubernetes │  │• Metrics    │  │• Caching    │       │
│  │ │• Request    │  │• Docker     │  │• Alerts     │  │• Compression│       │
│  │ │  Volume     │  │  Swarm      │  │• Scaling    │  │• Minification│      │
│  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  └─────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┤
│  │ Performance Metrics                                                         │
│  │                                                                             │
│  │ • Response Time: <200ms (single platform), <500ms (cross-platform)        │
│  │ • Throughput: 1000 requests/second per platform                           │
│  │ • Concurrent Users: 30 per platform, 90 total ecosystem                   │
│  │ • Uptime: 99.9% availability during exercises                             │
│  │ • Scalability: Linear scaling to 10x base capacity                        │
│  └─────────────────────────────────────────────────────────────────────────────┘
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

These architecture diagrams illustrate the comprehensive, enterprise-grade design of the CyberOps Range Ecosystem:

### Key Architectural Strengths:
1. **Modular Design**: Independent platforms that integrate seamlessly
2. **Scalable Architecture**: Horizontal scaling with cloud-native patterns
3. **Security-First**: Multi-layer security with defense-in-depth approach
4. **Real-Time Capability**: MQTT messaging for instant cross-platform communication
5. **Flexible Deployment**: Cloud, on-premise, hybrid, and tactical options
6. **Performance Optimized**: Sub-second response times with high concurrency
7. **Integration Ready**: API-first design with extensive integration points

### Defense Applications:
- **Multi-Domain Operations**: Coordinated training across maritime, space, and RF domains
- **Joint Exercises**: Multi-service and coalition training capabilities
- **Classified Environments**: Air-gapped deployment with full security controls
- **Tactical Deployment**: Mobile and field-deployable configurations
- **Rapid Scaling**: Dynamic resource allocation for large-scale exercises

This architecture provides the foundation for transformational defense training capabilities, combining operational realism with enterprise-grade reliability and security.