import React from 'react';
import Filter from "./Filter"
import AlertPanel from './AlertPanel';
import Container from 'react-bootstrap/Container';
import * as CONSTANTS from "../constants"

class EmbGraph extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            link: "Hello",
            graphHtml: "",
            message: "",
            messageType: "",
            url: CONSTANTS.BASE_URL + "embgraph/?infoType=deaths&logScale=true&byPop=false&countries=Spain,%20France,%20Italy,%20US,%20Denmark,%20Sweden,%20Canada,%20Australia,%20Germany,%20Poland,%20India,%20China,%20United%20Kingdom"
        }
    }

    FetchGraph = () => {
        fetch(this.state.url)
            .then(res => res.json())
            .then((data) => {
                this.setState({ graphHtml: data.graphHtml })
                var graphDiv = document.getElementById('graphDiv')
                if (graphDiv != null) {
                    var arr = graphDiv.getElementsByTagName('script')
                    for (var n = 0; n < arr.length; n++)
                        eval(arr[n].innerHTML)
                    this.setState({ message: "" })
                }
            })
            .catch(error => {
                this.setState({
                    message: "Unable to load the graph! " + error,
                    messageType: "danger"
                })
            })
    }

    SetParentState = (newState) => {
        document.getElementById('graphDiv').innerHTML = ""
        this.setState(newState, this.FetchGraph)
    }

    componentDidMount() {
        this.setState({ message: "Loading graph...", messageType: "info" })
        this.FetchGraph()
    }

    render() {
        return (
            <Container>
                <br />
                <Filter setParentState={this.SetParentState} />
                <AlertPanel message={this.state.message} messageType={this.state.messageType} />
                <div id="graphDiv" dangerouslySetInnerHTML={{ __html: this.state.graphHtml }}></div>
            </Container>
        );
    }
}
export default EmbGraph;
