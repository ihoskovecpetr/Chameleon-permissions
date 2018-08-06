export async function getProjects() {
    let error;
    try {
        const options = {
            credentials: 'same-origin',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        const response = await fetch(`/api/project/projects`, options);
        const data = await response.json();
        if (response.ok) return  data;
        else error = new Error(data && data.error ? data.error : `${response.status}: ${response.statusText}`);
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
        const data = await response.json();
        if (response.ok) return data;
        else error = new Error(data && data.error ? data.error : `${response.status}: ${response.statusText}`);
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}

export async function updateProject(project) {
    let error;
    try {
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(project)
        };
        const response = await fetch(`/api/project/projects/${project._id}`, options);
        const data = await response.json();
        if (response.ok) return data;
        else error = new Error(data && data.error ? data.error : `${response.status}: ${response.statusText}`);
    } catch (e) {
        error = e;
    }
    if(error) throw error;
}