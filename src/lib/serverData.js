//**********************************************************************************************************************
// AUTHENTICATED USER
//**********************************************************************************************************************
export async function getAuthenticatedUser() {
    const options = {
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache','pragma': 'no-cache'}
    };
    const response = await fetch('/api/users/authenticated', options);
    if(response.ok) {
        return await response.json();
    } else {
        throw 'Not Authenticated';
    }
}
//**********************************************************************************************************************
// PROJECTS
//**********************************************************************************************************************
export async function getProjects() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/projects`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function createProject(project) {
    let error;
    try {
        const options = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(project),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/projects`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function updateProject(id, project) {
    let error;
    try {
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(project),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/projects/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function removeProject(id) {
    let error;
    try {
        const options = {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/projects/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}
//**********************************************************************************************************************
// USERS
//**********************************************************************************************************************
export async function getUsers() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/users/role`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

//**********************************************************************************************************************
// PERSONS
//**********************************************************************************************************************
export async function getPersons() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/persons`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}


export async function createPerson(person) {
    let error;
    try {
        const options = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(person),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/persons`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function updatePerson(id, person) {
    let error;
    try {
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(person),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/persons/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function removePerson(id) {
    let error;
    try {
        const options = {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/persons/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}
//**********************************************************************************************************************
// COMPANIES
//**********************************************************************************************************************
export async function getCompanies() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/companies`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function createCompany(company) {
    let error;
    try {
        const options = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(company),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/companies`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function updateCompany(id, company) {
    let error;
    try {
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(company),
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/companies/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function removeCompany(id) {
    let error;
    try {
        const options = {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
            redirect: 'manual'
        };
        const response = await fetch(`/api/project/companies/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(response.type === 'opaqueredirect') {
                error = new Error('User not authenticated or session expired.');
                loginRedirect();
            } else if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

function loginRedirect() {
    window.location.replace('/login?app=projects');
}