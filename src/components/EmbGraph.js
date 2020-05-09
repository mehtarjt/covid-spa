import React from 'react';
import Filter from "./Filter"
import AlertPanel from './AlertPanel';
import Container from 'react-bootstrap/Container';

class EmbGraph extends React.Component {

    constructor(props) {
        super(props)
        this.baseUrl = "https://covid-svc.herokuapp.com/"
        //this.baseUrl = "http://127.0.0.1:8000/"
        this.state = {
            link: "Hello",
            graphHtml: "",
            message: "",
            messageType: "",
            url: this.baseUrl + "embgraph/?infoType=deaths&logScale=true&byPop=false&countries=Spain,%20France,%20Italy,%20US,%20Denmark,%20Sweden,%20Canada,%20Australia,%20Germany,%20Poland,%20India,%20China,%20United%20Kingdom"
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
