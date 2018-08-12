export async function getProjects() {
    const projects = [
        {_id: 0, name: 'Name0', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 1, name: 'Name1', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 2, name: 'Name2', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 3, name: 'Name3', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 4, name: 'Name4', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 5, name: 'Name5', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 6, name: 'Name6', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 7, name: 'Name7', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 8, name: 'Name8', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 9, name: 'Name9', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 10, name: 'Name10', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 11, name: 'Name11', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 12, name: 'Name12', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 13, name: 'Name13', status: 'SEND', manager: 'Magdalena Halamová'},
        {_id: 14, name: 'Name14', status: 'SEND', manager: 'Magdalena Halamová'}
    ];
    return projects;
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

export async function createProject(project) {
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

export async function updateProject(id, project) {
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

export async function removeProject(id) {
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