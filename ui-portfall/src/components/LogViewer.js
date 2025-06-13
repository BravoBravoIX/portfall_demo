import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';

const LogViewer = ({ logs }) => {
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs based on type and search term
  const filteredLogs = logs.filter(log => {
    // Apply type filter
    if (filterType && log.type !== filterType) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const messageMatches = log.message && log.message.toLowerCase().includes(searchLower);
      const userMatches = log.user && log.user.toLowerCase().includes(searchLower);
      const ipMatches = log.ip && log.ip.toLowerCase().includes(searchLower);
      const resourceMatches = log.resource && log.resource.toLowerCase().includes(searchLower);
      const componentMatches = log.component && log.component.toLowerCase().includes(searchLower);
      
      return messageMatches || userMatches || ipMatches || resourceMatches || componentMatches;
    }
    
    return true;
  });

  return (
    <Container>
      <h2>Log Viewer</h2>
      
      <Card className="mb-4">
        <Card.Header>Log Filters</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group controlId="filterType">
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="access">Access</option>
                  <option value="auth">Authentication</option>
                  <option value="system">System</option>
                  <option value="error">Error</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={8}>
              <Form.Group controlId="searchTerm">
                <Form.Label>Search</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Search in logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          Logs ({filteredLogs.length})
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="float-end"
            onClick={() => {
              setFilterType('');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        </Card.Header>
        <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.slice().reverse().map((log) => (
              <div key={log.id} className={`log-entry ${log.type}`}>
                <div className="d-flex justify-content-between">
                  <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                  <div><strong>Type:</strong> {log.type}</div>
                </div>
                <div><strong>Message:</strong> {log.message}</div>
                
                {log.user && <div><strong>User:</strong> {log.user}</div>}
                {log.ip && <div><strong>IP:</strong> {log.ip}</div>}
                {log.resource && <div><strong>Resource:</strong> {log.resource}</div>}
                {log.component && <div><strong>Component:</strong> {log.component}</div>}
                {log.status && <div><strong>Status:</strong> {log.status}</div>}
                {log.error_code && <div><strong>Error Code:</strong> {log.error_code}</div>}
              </div>
            ))
          ) : (
            <p className="text-center">No logs match the current filters</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LogViewer;
