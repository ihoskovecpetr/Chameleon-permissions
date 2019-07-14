const CHAMELEON_API = `/api/v1/chameleon`;
const APPLICATION_NAME = 'projects';
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

export async function createProject(project) {
    return await fetchServer('POST', '/', project);
}

export async function updateProject(id, project) {
    return await fetchServer('PUT', `/${id}`, project);
}

export async function removeProject(id) {
    return await fetchServer('DELETE', `/${id}`);
}
//**********************************************************************************************************************
// USERS
//**********************************************************************************************************************
export async function getUsers() {
    return await fetchServer('GET', '/users/role');
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
async function fetchServer(method, path, data) {
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
        const response = await fetch(`${APPLICATION_API}${path}`, options);
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