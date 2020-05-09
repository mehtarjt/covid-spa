import React from 'react';
import EmbGraph from '../components/EmbGraph';
import Navigation from '../components/Navigation';

class Home extends React.Component {
    render() {
        return (
            <>
                <Navigation />
                <EmbGraph />
            </>
        );
    }
}
export default Home;
