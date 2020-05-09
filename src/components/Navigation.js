import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

class Navigation extends React.Component {
    render() {
        return (
            <Nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
                <Container>
                    <span className="navbar-brand">COVID React App</span>
                </Container>
            </Nav>);
    }
}
export default Navigation;
