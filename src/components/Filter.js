import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import { Multiselect } from 'multiselect-react-dropdown';

class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.baseUrl = "https://covid-svc.herokuapp.com/"
        //this.baseUrl = "http://127.0.0.1:8000/"
        this.setParentState = this.props.setParentState
        this.callback = this.props.callback
        this.countries = React.createRef();
        this.infoType = "deaths"
        this.logScale = true
        this.byPop = false
        this.state = {
            countryList: [],
            selectedCountries: ["Spain", "France", "Italy", "US", "Denmark", "Sweden", "Canada", "Australia", "Germany", "Poland", "India", "China", "United Kingdom"]
        }
    }

    FetchCountries = () => {
        fetch(this.baseUrl + "countries/")
            .then(res => res.json())
            .then((data) => {
                var countries = data.countries.replace("[", "").replace("]", "").replace(/["']/g, "").split(",")
                console.log(countries)
                this.setState({ countryList: countries })
            })
            .catch(error => { console.log(error) })
    }

    componentDidMount() {
        this.FetchCountries()
    }
    HandleReload = () => {
        var params = "infoType=" + this.infoType
        params += "&logScale=" + this.logScale
        params += "&byPop=" + this.byPop
        var selectedCountries = this.countries.current.getSelectedItems()
        params += "&countries="
        params += selectedCountries.toString();
        var urlWithParams = this.baseUrl + "embgraph/?" + encodeURI(params)
        this.setParentState({ url: urlWithParams, message: "Loading graph...", messageType: "info" })
    }

    OnInfoTypeChange = (value) => {
        switch (value) {
            case 1:
                this.infoType = "confirmed";
                break;
            case 2:
                this.infoType = "deaths";
                break;
            case 3:
                this.infoType = "recovered";
                break;
        }
    }

    OnAddParamChange = (value) => {
        this.logScale = value.includes(1)
        this.byPop = value.includes(2)
    }

    render() {
        return (
            //this.HandleReload();
            <Form onSubmit={e => { e.preventDefault(); }}>
                <Alert variant="secondary">
                    <Form.Group as={Row} controlId="formHorizontalCountries">
                        <InputGroup.Prepend>
                            &nbsp;&nbsp;&nbsp;
                            <InputGroup.Text>Countries</InputGroup.Text>
                            <Multiselect
                                style={{ searchBox: { backgroundColor: "#FFFFFF", width: "950px" } }}
                                isObject={false}
                                ref={this.countries}
                                options={this.state.countryList}
                                selectedValues={this.state.selectedCountries}
                                placeholder="Type country name here"
                            />
                        </InputGroup.Prepend>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalGraphParams">
                        <Col lg="4">
                            <ButtonGroup className="mb-2">
                                <ToggleButtonGroup id="infoTypeRadio" type="radio" name="infoTypeRadio" defaultValue={2} onChange={this.OnInfoTypeChange}>
                                    <ToggleButton variant="outline-secondary" value={1}>Confirmed</ToggleButton>
                                    <ToggleButton variant="outline-secondary" value={2}>Deaths</ToggleButton>
                                    <ToggleButton variant="outline-secondary" value={3}>Recovered</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonGroup>
                        </Col>
                        <Col lg="5">
                            <ToggleButtonGroup id="addParamsCheckbox" type="checkbox" name="addParamsCheckbox" defaultValue={[1]} onChange={this.OnAddParamChange}>
                                <ToggleButton variant="outline-secondary" value={1}>Log Scale</ToggleButton>
                                <ToggleButton variant="outline-secondary" value={2}>By Population (in million)</ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                        <Col lg="auto">
                            <Button type="reset" variant="outline-primary">Reset Countries</Button>&nbsp;
                            <Button type="button" variant="primary" onClick={this.HandleReload}>Reload</Button>
                        </Col>
                    </Form.Group>
                </Alert>
            </Form>
        );
    }
}
export default Filter;
