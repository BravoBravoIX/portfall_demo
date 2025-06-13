import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ logs, scenarioState }) => {
  // Calculate log type distribution
  const logCounts = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(logCounts),
    datasets: [
      {
        data: Object.values(logCounts),
        backgroundColor: [
          '#2196f3',  // access - blue
          '#4caf50',  // auth - green
          '#ff9800',  // system - orange
          '#f44336',  // error - red
        ],
      },
    ],
  };

  // Calculate log frequency over time (last 10 entries)
  const recent = logs.slice(-10);
  const barChartData = {
    labels: recent.map((log, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: 'Timestamp',
        data: recent.map(() => 1),
        backgroundColor: recent.map(log => {
          switch(log.type) {
            case 'access': return '#2196f3';
            case 'auth': return '#4caf50';
            case 'system': return '#ff9800';
            case 'error': return '#f44336';
            default: return '#ccc';
          }
        }),
      },
    ],
  };

  return (
    <Container>
      <h2>Portfall Dashboard</h2>
      <p>Scenario: {scenarioState.scenario_name || 'Default Scenario'}</p>
      <p>Status: {scenarioState.scenario_active ? 'Active' : 'Inactive'}</p>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>Log Type Distribution</Card.Header>
            <Card.Body>
              {Object.keys(logCounts).length > 0 ? (
                <Pie data={pieChartData} />
              ) : (
                <p className="text-center">No logs available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Recent Log Activity</Card.Header>
            <Card.Body>
              {recent.length > 0 ? (
                <Bar 
                  data={barChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              ) : (
                <p className="text-center">No logs available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>Recent Logs</Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {logs.slice(-5).reverse().map((log) => (
                <div key={log.id} className={`log-entry ${log.type}`}>
                  <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div><strong>Type:</strong> {log.type}</div>
                  <div><strong>Message:</strong> {log.message}</div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-center">No logs available</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
