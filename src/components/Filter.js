import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import { Multiselect } from 'multiselect-react-dropdown';
import * as CONSTANTS from "../constants"

class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.setParentState = this.props.setParentState
        this.countries = React.createRef();
        this.infoType = "deaths"
        this.infoTypeRadio = 2
        this.addParamsCheckbox = [1]
        this.logScale = true
        this.byPop = false
        this.state = {
            countryList: [],
            selectedCountries: ["Spain", "France", "Italy", "US", "Denmark", "Sweden", "Canada", "Australia", "Germany", "Poland", "India", "China", "United Kingdom"]
        }
    }

    FetchCountries = () => {
        fetch(CONSTANTS.BASE_URL + "countries/")
            .then(res => res.json())
            .then((data) => {
                var countries = data.countries.replace("[", "").replace("]", "").replace(/["']/g, "").split(",")
                this.setState({ countryList: countries })
            })
            .catch(error => { console.log(error) })
    }

    componentDidMount() {
        this.FetchCountries()
    }

    HandleReload = () => {
        var selectedCountries = this.countries.current.getSelectedItems()
        var params = "graphrest/?countries="
        params += selectedCountries.toString();
        var urlWithParams = CONSTANTS.BASE_URL + encodeURI(params)
        this.setParentState({ url: urlWithParams, message: "Loading graph...", messageType: "info" })
    }

    HandleParameters = () => {
        var infoType = this.infoTypeRadio
        var addParam = this.addParamsCheckbox
        if (infoType === 1 && !addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.CONFIRMED });
        else if (infoType === 1 && addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.CONFIRMEDMIL });
        else if (infoType === 2 && !addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.DEATHS });
        else if (infoType === 2 && addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.DEATHSMIL });
        else if (infoType === 3 && !addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.RECOVERED });
        else if (infoType === 3 && addParam.includes(2))
            this.setParentState({ infoType: CONSTANTS.RECOVEREDMIL });

        if (addParam.includes(1))
            this.setParentState({ graphLayout: { autoresize: true, yaxis: { type: "log", fixedrange: true }, xaxis: { type: "date", fixedrange: true }, legend: { "orientation": "h" } }, })
        else
            this.setParentState({ graphLayout: { autoresize: true, yaxis: { type: "linear", fixedrange: true }, xaxis: { type: "date", fixedrange: true }, legend: { "orientation": "h" } }, })
    }

    OnInfoTypeChange = (value) => {
        this.infoTypeRadio = value
        this.HandleParameters()
    }

    OnAddParamChange = (value) => {
        this.addParamsCheckbox = value
        this.HandleParameters()
    }

    render() {
        return (
            <Container fluid >
                <Row style={{ backgroundColor: "#DFDFDF" }}>
                    <Form onSubmit={e => { e.preventDefault(); }}>
                        <Col lg="auto">
                            Countries <Multiselect
                                style={{ searchBox: { backgroundColor: "#FFFFFF" } }}
                                isObject={false}
                                ref={this.countries}
                                options={this.state.countryList}
                                selectedValues={this.state.selectedCountries}
                                placeholder="Type country name here"
                            />

                        </Col>
                        <Col lg="4">
                            <Button type="reset" variant="outline-primary" style={{ margin: "10px", marginLeft: "0px" }}>Reset Countries</Button>
                            <Button type="button" variant="primary" onClick={this.HandleReload} style={{ margin: "10px" }}>Reload Countries</Button>
                        </Col>
                    </Form>
                </Row>
                <Row >
                    <Col style={{ marginTop: "20px" }}>
                        Filters:<br />
                        <ToggleButtonGroup id="infoTypeRadio" className="mb-2" type="radio" name="infoTypeRadio" defaultValue={2} onChange={this.OnInfoTypeChange} style={{ margin: "10px", marginLeft: "0px" }}>
                            <ToggleButton variant="outline-secondary" value={1}>Confirmed</ToggleButton>
                            <ToggleButton variant="outline-secondary" value={2}>Deaths</ToggleButton>
                            <ToggleButton variant="outline-secondary" value={3}>Recovered</ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup id="addParamsCheckbox" className="mb-2" type="checkbox" name="addParamsCheckbox" defaultValue={[1]} onChange={this.OnAddParamChange} style={{ margin: "10px", marginLeft: "0px" }}>
                            <ToggleButton variant="outline-secondary" value={1}>Log Scale</ToggleButton>
                            <ToggleButton variant="outline-secondary" value={2}>By Population (in million)</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>

            </Container >
        );
    }
}
export default Filter;
