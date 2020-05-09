import React from 'react';
import Home from './pages/Home';
import Router from 'react-router-dom/BrowserRouter'
import Route from 'react-router-dom/Route'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" component={Home} exact />
            </Router>
        );
    }
}
export default App;
