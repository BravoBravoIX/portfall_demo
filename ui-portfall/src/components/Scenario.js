import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const Scenario = ({ scenarioState, updateScenarioState }) => {
  const [formState, setFormState] = useState({
    scenario_active: true,
    log_frequency: 5,
    event_types: ['access', 'auth', 'system', 'error'],
    scenario_name: 'Network Security Monitoring Exercise'
  });
  
  const [message, setMessage] = useState(null);
  const messageTimeoutRef = useRef(null);
  
  // Update local state when props change
  useEffect(() => {
    if (scenarioState) {
      setFormState(prevState => ({
        ...prevState,
        ...scenarioState
      }));
    }
  }, [scenarioState]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateScenarioState(formState);
    setMessage({ variant: 'success', text: 'Scenario settings updated successfully!' });
    
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    // Clear message after 3 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
      messageTimeoutRef.current = null;
    }, 3000);
  };
  
  const handleCheckboxChange = (type) => {
    const updatedTypes = formState.event_types.includes(type)
      ? formState.event_types.filter(t => t !== type)
      : [...formState.event_types, type];
      
    setFormState(prevState => ({
      ...prevState,
      event_types: updatedTypes
    }));
  };
  
  return (
    <Container>
      <h2>Scenario Configuration</h2>
      
      {message && (
        <Alert variant={message.variant}>
          {message.text}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>General Settings</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="scenarioName">
                  <Form.Label>Scenario Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formState.scenario_name || ''}
                    onChange={(e) => setFormState(prev => ({...prev, scenario_name: e.target.value}))}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="scenarioActive">
                  <Form.Check 
                    type="switch"
                    id="scenario-active-switch"
                    label="Scenario Active"
                    checked={formState.scenario_active}
                    onChange={(e) => setFormState(prev => ({...prev, scenario_active: e.target.checked}))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header>Log Settings</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3" controlId="logFrequency">
              <Form.Label>Log Frequency (seconds between logs)</Form.Label>
              <Form.Control 
                type="number" 
                min="1"
                max="60"
                value={formState.log_frequency || 5}
                onChange={(e) => setFormState(prev => ({...prev, log_frequency: parseInt(e.target.value, 10)}))}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Event Types</Form.Label>
              <div>
                <Form.Check 
                  inline
                  type="checkbox"
                  id="event-type-access"
                  label="Access"
                  checked={formState.event_types?.includes('access')}
                  onChange={() => handleCheckboxChange('access')}
                />
                <Form.Check 
                  inline
                  type="checkbox"
                  id="event-type-auth"
                  label="Authentication"
                  checked={formState.event_types?.includes('auth')}
                  onChange={() => handleCheckboxChange('auth')}
                />
                <Form.Check 
                  inline
                  type="checkbox"
                  id="event-type-system"
                  label="System"
                  checked={formState.event_types?.includes('system')}
                  onChange={() => handleCheckboxChange('system')}
                />
                <Form.Check 
                  inline
                  type="checkbox"
                  id="event-type-error"
                  label="Error"
                  checked={formState.event_types?.includes('error')}
                  onChange={() => handleCheckboxChange('error')}
                />
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Scenario;