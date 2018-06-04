export  function getAuthenticatedUser() {
    return fetch('/remote-user',
        {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
                'pragma': 'no-cache'
            }
        })
        .then(response => {
            return response.json()
                .then(data => {
                    if(response.ok) return data;
                    else return Promise.reject({status: response.status, data})
                })
        });
}

