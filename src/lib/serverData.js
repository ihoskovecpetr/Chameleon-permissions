const CHAMELEON_API = `/api/v1/chameleon`;
const APPLICATION_NAME = 'permissions';
const API_VERSION = 'v1';
const APPLICATION_API = `/api/${API_VERSION}/${APPLICATION_NAME}`;

//**********************************************************************************************************************
// AUTHENTICATED USER
//**********************************************************************************************************************
export async function getAuthenticatedUser() {
    const options = {
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache','pragma': 'no-cache'}
    };
    const response = await fetch(`${CHAMELEON_API}/users/authenticated`, options);
    if(response.ok) {
        return await response.json();
    } else {
        throw 'Not Authenticated';
    }
}
//**********************************************************************************************************************
// LOGOUT
//**********************************************************************************************************************
export async function logout() {
    const options = {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache','pragma': 'no-cache'}
    };
    const response = await fetch('/authenticate', options);
    if(!response.ok) throw 'Not removed';
}

//**********************************************************************************************************************
// PROJECTS
//**********************************************************************************************************************
export async function getProjects() {
    return await fetchServer('GET', '/');
}

export async function getK2Projects() {
    console.time("Pre getK2Projects")
    const a = await fetchServer('GET', '/k2_projects');
    console.timeEnd("Pre getK2Projects")
    return a
}


//**********************************************************************************************************************
// AD GROUPS
//**********************************************************************************************************************
export async function getMyGroups() {
    return await fetchServer('GET', '/my_groups');
}

export async function getGroupMembers(groupName) {
    return await fetchServer('POST', '/group_members', groupName);
}

export async function getGroupsMembers(groupsNamesArr) {
    return await fetchServer('POST', '/groups_members', groupsNamesArr);
}

export async function getProjectGroupsMembers(project_name) {
    return await fetchServer('POST', '/project/groups_with_members', {project_name: project_name});
}
//SAVE NEW MEMBERS to group 

export async function saveGroupMembers(group_name, currentEditMemb) {
    return await fetchServer('POST', `/save/${group_name}`, {users: currentEditMemb});
}

// export async function addGroupMembers(groupName, usersArr) {
//     return await fetchServer('POST', '/add_members', {group: groupName, usersArr: usersArr});
// }

// export async function removeGroupMembers(groupName, user) {
//     console.log("removeGroupMembers: BODY: ", groupName, user)
//     return await fetchServer('POST', '/remove_members', {group: groupName, user: user});
// }



//**********************************************************************************************************************
// USERS
//**********************************************************************************************************************
export async function getUsers() {
    return await fetchServer('GET', '/users/role');
}

export async function getUsersByRole(roleArr) {
    return await fetchServer('POST', `/users/by_role`, {rolesArr: roleArr});
}

//**********************************************************************************************************************
// PERSONS
//**********************************************************************************************************************
export async function getPersons() {
    return await fetchServer('GET', '/persons');
}


export async function createPerson(person) {
    return await fetchServer('POST', '/persons', person);
}

export async function updatePerson(id, person) {
    return await fetchServer('PUT', `/persons/${id}`, person);
}

export async function removePerson(id) {
    return await fetchServer('DELETE', `/persons/${id}`);
}
//**********************************************************************************************************************
// COMPANIES
//**********************************************************************************************************************
export async function getCompanies() {
    return await fetchServer('GET', '/companies');
}

export async function createCompany(company) {
    return await fetchServer('POST', '/companies', company);
}

export async function updateCompany(id, company) {
    return await fetchServer('PUT', `/companies/${id}`, company);
}

export async function removeCompany(id) {
    return await fetchServer('DELETE', `/companies/${id}`);
}

//**********************************************************************************************************************
// FETCH SERVER
//**********************************************************************************************************************
export async function fetchServer(method, path, data) {
    const body = data ?  JSON.stringify(data) : undefined;
    let error;
    try {
        const options = {
            method: method.toUpperCase(),
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        if((options.method === 'PUT' || options.method === 'POST') && body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = body;
        }
        console.time("fetchX" + path)
        const response = await fetch(`${APPLICATION_API}${path}`, options);
        console.timeEnd("fetchX" + path)
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            if(data) return data;
            else return;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                window.location.replace(`/login?app=${APPLICATION_NAME}`);
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch(e) {
        error = e;
    }
    if(error) throw error;
}