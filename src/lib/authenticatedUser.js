export async function getAuthenticatedUser() {
    //return {name: 'Miroslav Kozel', role: ['booking:admin']}
    const options = {
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'cache-control': 'no-cache','pragma': 'no-cache'}
    };
    const response = await fetch('/remote-user', options);
    if(response.ok) {
        return await response.json();
    } else {
        throw 'Not Authenticated';
    }
}

