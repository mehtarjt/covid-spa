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
            link: "Hello",
            graphData: {},
            graphLayout: { width: 1200, height: 800, yaxis: { type: "log" } },
            graphConfig: { responsive: true },
            graphHtml: "",
            message: "",
            messageType: "",
            url: CONSTANTS.BASE_URL + "graphrest/?countries=Spain,%20France,%20Italy,%20US,%20Denmark,%20Sweden,%20Canada,%20Australia,%20Germany,%20Poland,%20India,%20China,%20United%20Kingdom"
        }
    }


    FetchGraph = () => {
        fetch(this.state.url)
            .then(res => res.json())
            .then((data) => {
                var graphData = this.PrepareGraphData(JSON.parse(data))
                this.setState({ graphData: graphData })
                this.setState({ message: "" })
            })
            .catch(error => {
                this.setState({
                    message: "Unable to load the graph! " + error,
                    messageType: "danger"
                })
            })
    }

    PrepareGraphData = (rawJson) => {
        var result = []
        for (var key in rawJson) {
            if (key.endsWith("Deaths"))
                result.push({
                    x: rawJson["xAxis"],
                    y: rawJson[key],
                    name: key,
                    type: 'scatter',
                    mode: 'lines',
                })
        }
        console.log(result)
        return result
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
                    data={this.state.graphData}
                    layout={this.state.graphLayout}
                    config={this.state.graphConfig}
                />
            </Container >
        );
    }
}
export default Graph;
