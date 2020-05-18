import React from 'react';
import Filter from "./Filter"
import AlertPanel from './AlertPanel';
import Container from 'react-bootstrap/Container';
import Plot from 'react-plotly.js';
import * as CONSTANTS from "../constants"

class Graph extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            graphRawData: {},
            graphStructuredData: {},
            yAxisType: { type: "log" },
            graphLayout: { width: 1200, height: 800, yaxis: { type: "log" }, xaxis: { type: "date" } },
            graphConfig: { responsive: true },
            infoType: CONSTANTS.DEATHS,
            message: "",
            messageType: "",
            url: CONSTANTS.BASE_URL + "graphrest/?countries=Spain,%20France,%20Italy,%20US,%20Denmark,%20Sweden,%20Canada,%20Australia,%20Germany,%20Poland,%20India,%20China,%20United%20Kingdom"
        }
    }


    FetchGraph = () => {
        fetch(this.state.url)
            .then(res => res.json())
            .then((data) => {
                var graphData = JSON.parse(data)
                this.setState({ graphRawData: graphData })
                this.setState({ graphStructuredData: this.StructureGraphData() })
                this.setState({ message: "" })
            })
            .catch(error => {
                this.setState({
                    message: "Unable to load the graph! " + error,
                    messageType: "danger"
                })
            })
    }

    StructureGraphData = () => {
        var infoTypes = CONSTANTS.INFOTYPES
        var graphStructuredData = {};
        for (var i = 0; i < infoTypes.length; i++) {
            var infoType = infoTypes[i]
            var result = []
            for (var key in this.state.graphRawData) {
                if (key.endsWith(infoType))
                    result.push({
                        x: this.state.graphRawData[CONSTANTS.DATES],
                        y: this.state.graphRawData[key],
                        name: key,
                        type: 'scatter',
                        mode: 'lines',
                    })
            }
            graphStructuredData[infoType] = result
        }
        return graphStructuredData
    }

    SetParentState = (newState) => {
        this.setState(newState, this.FetchGraph)
    }

    componentDidMount() {
        this.setState({ message: "Loading graph...", messageType: "info" })
        this.FetchGraph()
    }

    render() {
        return (
            <Container fluid>
                <br />
                <Filter setParentState={this.SetParentState} />
                <AlertPanel message={this.state.message} messageType={this.state.messageType} />
                <Plot
                    data={this.state.graphStructuredData[this.state.infoType]}
                    layout={this.state.graphLayout}
                    config={this.state.graphConfig}
                />
            </Container >
        );
    }
}
export default Graph;
