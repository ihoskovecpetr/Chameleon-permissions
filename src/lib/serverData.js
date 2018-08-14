export async function getProjects() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        const response = await fetch(`/api/project/projects`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function sendNewProject(project) {
    let error;
    try {
        const options = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(project)
        };
        const response = await fetch(`/api/project/projects`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function sendUpdateProject(id, project) {
    let error;
    try {
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(project)
        };
        const response = await fetch(`/api/project/projects/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function sendRemoveProject(id) {
    let error;
    try {
        const options = {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        const response = await fetch(`/api/project/projects/${id}`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function getUsers() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        const response = await fetch(`/api/project/users`, options);
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.indexOf("application/json") !== -1 ? await response.json() : null;
        if (response.ok) {
            return  data;
        } else {
            if(data) {
                if(typeof data === 'string') error = new Error(`${data} - ${response.statusText} (${response.status})`);
                else error = new Error(data.error ? data.error : `(${response.status}) ${response.statusText}`);
            } else error = new Error(`${response.statusText} (${response.status})`);
        }
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}