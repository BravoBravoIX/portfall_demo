import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = ({ isConnected }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Portfall</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/logs">Logs</Nav.Link>
            <Nav.Link as={Link} to="/scenario">Scenario</Nav.Link>
          </Nav>
          <Navbar.Text>
            <span 
              className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
