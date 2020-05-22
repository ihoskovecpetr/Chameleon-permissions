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

export default function AppRouter(props){


return(
    <Router>
        <Switch>
            {/* <Route exact path="/permissions"> */}
            <Route exact path="/permissions">
                <AppLayout {...props}>
                    <SearchListProjectsContainer location={location} />
                </AppLayout>
            </Route>  
            {/* <Route path="/permissions/search_people">    */}
            <Route path="/permissions/search_people">
                    <AppLayout {...props}>
                        <SearchListPersonContainer location={location} />
                    </AppLayout>
            </Route>  
            {/* <Route path="/permissions/project/:id"> */}
            <Route path="/permissions/project/:id">
                    <AppLayout {...props}>
                        <AllProjectsContainer />
                    </AppLayout>
            
            </Route>
            {/* <Route path="/permissions/person/:id"> */}
            <Route path="/permissions/person/:id">
                    <AppLayout {...props}>
                        <PersonContainer />
                    </AppLayout>
            
            </Route> 
            <Route path="">

            <NavLink to="/permissions"><p>Router did not match anything, click to go to root</p></NavLink>
            
            </Route> 
        </Switch>
    </Router>)
}



