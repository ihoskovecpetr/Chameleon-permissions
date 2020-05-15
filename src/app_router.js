import React from 'react';
import {
    Switch,
    Route,
    NavLink,
    Redirect,
    useHistory,
    BrowserRouter as Router
  } from "react-router-dom";
import AppLayout from './components/AppLayout';
import AppBody from './components/AppBody';

import './app.scss';
import SearchListContainer from './components/element/SearchListContainer';

export default function App_router(props){

    console.log("AppRouteer location: ", location)

return(
    <Router>
        <Switch>
        {/* <Route exact path="/permissions"> */}
            <Route exact path="/">
                <AppLayout {...props}>
                </AppLayout>
            </Route>
            {/* <Route path="/permissions/search/:id"> */}
            <Route path="/search/:id">
                    <AppLayout {...props}>
                        "List of searches"
                    </AppLayout>
            </Route>    
            {/* <Route path="/permissions/project/:id"> */}
            <Route path="/project/:id">
                    <AppLayout {...props}>
                        <AppBody />
                    </AppLayout>
            
            </Route>
            {/* <Route path="/permissions/searchlist">    */}
            <Route path="/searchlist">
                    <AppLayout {...props}>
                        <SearchListContainer location={location} />
                    </AppLayout>
            </Route>   
        </Switch>
    </Router>)
}



