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
import SearchListProjectsContainer from './components/element/SearchLists/SearchListProjectsContainer';
import SearchListPersonContainer from './components/element/SearchLists/SearchListPersonContainer';
import AllProjectsContainer from './components/element/Project/AllProjectsContainer';
import PersonContainer from './components/element/Person/PersonContainer';
import ProjectContainer from "./components/element/Project/ProjectContainer"

export default function AppRouter(props){

    console.log("App Router location: ", props)

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
            <Route exact path="/permissions/project/:id">
                    <AppLayout {...props}>
                        <AllProjectsContainer projectGroups={true}/>
                    </AppLayout>
            
            </Route>
            <Route path="/permissions/project/:id/overview">
                    <AppLayout {...props}>
                        <AllProjectsContainer projectGroups={false}/>
                    </AppLayout>
            
            </Route>
            {/* <Route path="/permissions/person/:id"> */}
            <Route path="/permissions/person/:id">
                    <AppLayout {...props}>
                        <PersonContainer />
                    </AppLayout>
            
            </Route> 
            <Route path="">
                <AppLayout {...props}>
                    <NavLink to="/permissions"><p>Router did not match anything, click to go to root</p></NavLink>
                </AppLayout>
            </Route> 
        </Switch>
    </Router>)
}



