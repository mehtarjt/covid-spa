import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class AlertPanel extends React.Component {
    isLoading = this.props.message.toUpperCase().includes("LOADING")
    render() {
        if (this.props.message == "")
            return (<span></span>)
        else
            return (
                <Alert variant={this.props.messageType} >
                    <Row>
                        <Col sm="11">{this.props.message}</Col>
                        <Col sm="1">
                            <Spinner animation="grow" variant={this.props.messageType}></Spinner>
                        </Col>
                    </Row>
                </Alert >
            );
    }
}
export default AlertPanel;