import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectsList from './views/ProjectsList';
import ProjectEdit from './views/ProjectEdit';
import ProjectDetail from './views/ProjectDetail';

import CompaniesList from './views/CompaniesList';
import CompanyEdit from './views/CompanyEdit';

import PeopleList from './views/PeopleList';
import PersonEdit from './views/PersonEdit';

import Box from './views/Box';

import * as ViewTypes from '../constants/ViewTypes';

import {name, version}  from '../../package.json';
import * as FilterTypes from "../constants/FilterTypes";


export default class AppLayout extends React.PureComponent {

    render() {
        //console.log(this.props.appState)
        let AppBody = null;
        switch(this.props.appState.view) {
            case ViewTypes.PROJECTS_LIST:
                AppBody =
                    <ProjectsList
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.selectedProject}

                        filter={this.props.appState.activeBid ? this.props.appState.projectsFilter.filter(filter => filter === FilterTypes.USER_FILTER).concat([FilterTypes.ACTIVE_PROJECTS_FILTER, FilterTypes.NOT_AWARDED_PROJECTS_FILTER]) : this.props.appState.projectsFilter}
                        search={this.props.appState.activeBid ? this.props.appState.activeBidSearch : this.props.appState.projectsSearch}
                        sort={this.props.appState.activeBid ? this.props.appState.activeBidSort : this.props.appState.projectsSort}

                        setFilter={this.props.setProjectsFilter}
                        setSearch={this.props.appState.activeBid ? this.props.setActiveBidSearch : this.props.setProjectsSearch}
                        setSort={this.props.appState.activeBid ? this.props.setActiveBidSort : this.props.setProjectsSort}

                        selectProject={this.props.selectProject}
                        showProject={this.props.showProject}
                        editProject={this.props.editProject}
                        addProject={this.props.addProject}

                        updateProject={this.props.updateProjectDirect} //for active bids inline edit

                        addToBox={this.props.addToBox}
                        setActiveBid={this.props.setActiveBid}
                        activeBid={this.props.appState.activeBid}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
            case ViewTypes.BOX_PROJECT_DETAIL:
            case ViewTypes.PROJECT_DETAIL_NEXT:
                AppBody =
                    <ProjectDetail
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.appState.selectedProject : this.props.appState.view === ViewTypes.PROJECT_DETAIL_NEXT ? this.props.appState.nextDetailId : this.props.appState.view === ViewTypes.BOX_PROJECT_DETAIL ? this.props.appState.selectedBoxItem : null}

                        returnToPreviousView={this.props.returnToPreviousView}

                        selectProjectNext={this.props.selectProjectNext}
                        //TODO person, company

                        editProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.editProject : undefined}
                        removeProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.removeProject : undefined}
                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PROJECT_EDIT:
                AppBody =
                    <ProjectEdit
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.selectedProject}
                        editedData={this.props.appState.editedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.editItem}

                        updateProject={this.props.updateProject}
                        createProject={this.props.createProject}
                        removeProject={this.props.removeProject}
                    />;
                break;
            case ViewTypes.BOX:
                AppBody =
                    <Box
                        box = {this.props.appState.box}

                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}

                        setView={this.props.setView}
                        selectBoxItem={this.props.selectBoxItem}

                        removeFromBox={this.props.removeFromBox}
                        emptyBox={this.props.emptyBox}

                    />;
                break;
            case ViewTypes.COMPANIES_LIST:
                AppBody =
                    <CompaniesList
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedCompany={this.props.appState.selectedCompany}

                        filter={this.props.appState.companiesFilter}
                        search={this.props.appState.companiesSearch}
                        sort={this.props.appState.companiesSort}

                        setFilter={this.props.setCompaniesFilter}
                        setSearch={this.props.setCompaniesSearch}
                        setSort={this.props.setCompaniesSort}

                        selectCompany={this.props.selectCompany}
                        showCompany={this.props.showCompany}
                        editCompany={this.props.editCompany}
                        addCompany={this.props.addCompany}

                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.COMPANY_EDIT:
                AppBody =
                    <CompanyEdit
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedCompany={this.props.appState.selectedCompany}
                        editedData={this.props.appState.editedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.editItem}

                        updateCompany={this.props.updateCompany}
                        createCompany={this.props.createCompany}
                        removeCompany={this.props.removeCompany}
                    />;
                break;
            case ViewTypes.PEOPLE_LIST:
                AppBody =
                    <PeopleList
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedPerson={this.props.appState.selectedPerson}

                        filter={this.props.appState.peopleFilter}
                        search={this.props.appState.peopleSearch}
                        sort={this.props.appState.peopleSort}

                        setFilter={this.props.setPeopleFilter}
                        setSearch={this.props.setPeopleSearch}
                        setSort={this.props.setPeopleSort}

                        selectPerson={this.props.selectPerson}
                        showPerson={this.props.showPerson}
                        editPerson={this.props.editPerson}
                        addPerson={this.props.addPerson}

                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PERSON_EDIT:
                AppBody =
                    <PersonEdit
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedPerson={this.props.appState.selectedPerson}
                        editedData={this.props.appState.editedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.editItem}

                        updatePerson={this.props.updatePerson}
                        createPerson={this.props.createPerson}
                        removePerson={this.props.removePerson}
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
                    view = {this.props.appState.view}
                    activeBid = {this.props.appState.activeBid}
                    setView = {this.props.setView}
                    box = {this.props.appState.box}
                    switchesEnabled = {(this.props.appState.view !== ViewTypes.PROJECT_EDIT && this.props.appState.view !== ViewTypes.PERSON_EDIT && this.props.appState.view !== ViewTypes.COMPANY_EDIT) || Object.keys(this.props.appState.editedData).length === 0}
                />
                <MessageBox message = {this.props.appState.message} setMessage = {this.props.setMessage}/>
                {AppBody}
                <FetchingIndicator open={this.props.appState.fetching}/>
            </div>
        )
    }

}