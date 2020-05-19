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

import './app.scss';
import SearchListProjectsContainer from './components/element/SearchListProjectsContainer';
import SearchListPersonContainer from './components/element/SearchListPersonContainer';
import AllProjectsContainer from './components/element/Project/AllProjectsContainer';
import PersonContainer from './components/element/Person/PersonContainer';

export default function App_router(props){


return(
    <Router>
        <Switch>
            {/* <Route exact path="/permissions"> */}
            <Route exact path="/">
                <AppLayout {...props}>
                    <SearchListProjectsContainer location={location} />
                </AppLayout>
            </Route>  
            {/* <Route path="/permissions/search_people">    */}
            <Route path="/search_people">
                    <AppLayout {...props}>
                        <SearchListPersonContainer location={location} />
                    </AppLayout>
            </Route>  
            {/* <Route path="/permissions/project/:id"> */}
            <Route path="/project/:id">
                    <AppLayout {...props}>
                        <AllProjectsContainer />
                    </AppLayout>
            
            </Route>
            {/* <Route path="/permissions/person/:id"> */}
            <Route path="/person/:id">
                    <AppLayout {...props}>
                        <PersonContainer />
                    </AppLayout>
            
            </Route> 
        </Switch>
    </Router>)
}



