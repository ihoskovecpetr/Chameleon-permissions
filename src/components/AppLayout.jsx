import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectList from './views/ProjectList';
import ProjectEdit from './views/ProjectEdit';
import ProjectDetail from './views/ProjectDetail';

import CompanyList from './views/CompanyList';
import CompanyEdit from './views/CompanyEdit';
import CompanyDetail from './views/CompanyDetail';

import PersonList from './views/PersonList';
import PersonEdit from './views/PersonEdit';
import PersonDetail from './views/PersonDetail';

import Box from './views/Box';

import * as ViewTypes from '../constants/ViewTypes';

import {name, version}  from '../../package.json';
import * as FilterTypes from "../constants/FilterTypes";


export default class AppLayout extends React.PureComponent {
    render() {
        let AppBody = null;
        const {type, selected, editable} = this.props.appState.view;
        switch(type) {
            case ViewTypes.PROJECT_LIST:
                AppBody =
                    <ProjectList
                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selected={selected}

                        filter={this.props.appState.activeBid ? this.props.appState.projectsFilter.filter(filter => filter === FilterTypes.USER_FILTER).concat([FilterTypes.ACTIVE_PROJECTS_FILTER, FilterTypes.NOT_AWARDED_PROJECTS_FILTER]) : this.props.appState.projectsFilter}
                        search={this.props.appState.activeBid ? this.props.appState.activeBidSearch : this.props.appState.projectsSearch}
                        sort={this.props.appState.activeBid ? this.props.appState.activeBidSort : this.props.appState.projectsSort}

                        setFilter={this.props.setProjectsFilter}
                        setSearch={this.props.appState.activeBid ? this.props.setActiveBidSearch : this.props.setProjectsSearch}
                        setSort={this.props.appState.activeBid ? this.props.setActiveBidSort : this.props.setProjectsSort}

                        select={this.props.selectProject}
                        show={this.props.showProject}
                        edit={this.props.editProject}
                        add={this.props.addProject}

                        update={this.props.updateProject} //for active bids inline edit

                        addToBox={this.props.addToBox}
                        setActiveBid={this.props.setActiveBid}
                        activeBid={this.props.appState.activeBid}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
                AppBody =
                    <ProjectDetail
                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selected={selected}
                        editable={editable}

                        returnToPreviousView={this.props.returnToPreviousView}

                        showProjec={this.props.showProject}
                        showPerson={this.props.showPerson}
                        showCompany={this.props.showCompany}
                        edit={this.props.editProject}
                        remove={this.props.removeProject}
                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PROJECT_EDIT:
                AppBody =
                    <ProjectEdit
                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selected={selected}
                        editedData={this.props.appState.projectEditedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.changeProjectEditedData}

                        update={this.props.updateProject}
                        create={this.props.createProject}
                        remove={this.props.removeProject}

                        box = {this.props.appState.box}

                        addPerson = {this.props.addPerson}
                        addCompany = {this.props.addCompany}
                    />;
                break;
            case ViewTypes.COMPANY_LIST:
                AppBody =
                    <CompanyList
                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selected={selected}

                        filter={this.props.appState.companiesFilter}
                        search={this.props.appState.companiesSearch}
                        sort={this.props.appState.companiesSort}

                        setFilter={this.props.setCompaniesFilter}
                        setSearch={this.props.setCompaniesSearch}
                        setSort={this.props.setCompaniesSort}

                        select={this.props.selectCompany}
                        show={this.props.showCompany}
                        edit={this.props.editCompany}
                        add={this.props.addCompany}

                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.COMPANY_DETAIL:
                AppBody =
                    <CompanyDetail
                        projects={this.props.projects}
                        //persons={this.props.persons}
                        //companies={this.props.companies}
                        //users={this.props.users}
                        user={this.props.user}

                        company={this.props.companies[selected] ? this.props.companies[selected] : {}}
                        editable={editable}

                        returnToPreviousView={this.props.returnToPreviousView}

                        showProjectNext={this.props.showProjectNext}
                        showPersonNext={this.props.showPersonNext}
                        showCompanyNext={this.props.showCompanyNext}
                        edit={this.props.editCompany}
                        remove={this.props.removeCompany}
                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.COMPANY_EDIT:
                AppBody =
                    <CompanyEdit
                        //projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        //users={this.props.users}
                        user={this.props.user}

                        company={selected ? this.props.companies[selected] ? this.props.companies[selected] : {} : null}
                        editedData={this.props.appState.companyEditedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.changeCompanyEditedData}

                        update={this.props.updateCompany}
                        create={this.props.createCompany}
                        remove={this.props.removeCompany}

                        setJustAddedObject={this.props.setJustAddedObject}
                        addPerson = {this.props.addPerson}
                    />;
                break;
            case ViewTypes.PERSON_LIST:
                AppBody =
                    <PersonList
                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selected={selected}

                        filter={this.props.appState.personsFilter}
                        search={this.props.appState.personsSearch}
                        sort={this.props.appState.personsSort}

                        setFilter={this.props.setPersonsFilter}
                        setSearch={this.props.setPersonsSearch}
                        setSort={this.props.setPersonsSort}

                        select={this.props.selectPerson}
                        show={this.props.showPerson}
                        edit={this.props.editPerson}
                        add={this.props.addPerson}

                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PERSON_DETAIL:
                AppBody =
                    <PersonDetail
                        projects={this.props.projects}
                        //persons={this.props.persons}
                        //companies={this.props.companies}
                        //users={this.props.users}
                        user={this.props.user}

                        person={this.props.persons[selected] ? this.props.persons[selected] : {}}
                        editable={editable}

                        returnToPreviousView={this.props.returnToPreviousView}

                        showProjectNext={this.props.showProjectNext}
                        showPersonNext={this.props.showPersonNext}
                        showCompanyNext={this.props.showCompanyNext}

                        edit={this.props.editPerson}
                        remove={this.props.removePerson}
                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PERSON_EDIT:
                AppBody =
                    <PersonEdit
                        //projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}
                        //users={this.props.users}
                        user={this.props.user}

                        person={selected ? this.props.persons[selected] ? this.props.persons[selected] : {} : null}
                        editedData={this.props.appState.personEditedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.changePersonEditedData}

                        update={this.props.updatePerson}
                        create={this.props.createPerson}
                        remove={this.props.removePerson}

                        setJustAddedObject={this.props.setJustAddedObject}
                        addCompany = {this.props.addCompany}
                    />;
                break;
            case ViewTypes.BOX_LIST:
                AppBody =
                    <Box
                        box = {this.props.appState.box}

                        projects={this.props.projects}
                        persons={this.props.persons}
                        companies={this.props.companies}

                        setView={this.props.setView}
                        select={this.props.selectBoxItem}

                        remove={this.props.removeFromBox}
                        emptyBox={this.props.emptyBox}

                    />;
                break;
        }
        return (
            <div className={'app-layout'}>
                <AppHeader
                    appName = {name}
                    appVersion = {version}
                    user = {this.props.user}
                    refresh = {this.props.getData}
                    //logout = {this.props.logout}
                    //home = {this.props.home}
                    view = {this.props.appState.view.type}
                    activeBid = {this.props.appState.activeBid}
                    setView = {this.props.setView}

                    projectNoEditData = {Object.keys(this.props.appState.projectEditedData).length === 0}
                    companyNoEditData = {Object.keys(this.props.appState.companyEditedData).length === 0}
                    personNoEditData = {Object.keys(this.props.appState.personEditedData).length === 0}

                    box = {this.props.appState.box}
                />
                <MessageBox message = {this.props.appState.message} setMessage = {this.props.setMessage}/>
                {AppBody}
                <FetchingIndicator open={this.props.appState.fetching}/>
            </div>
        )
    }

}