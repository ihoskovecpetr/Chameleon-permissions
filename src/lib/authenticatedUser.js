export  async function getAuthenticatedUser(/*callback*/) {
    /*let remoteUser;
    const req = new XMLHttpRequest();
    req.open('GET', "/remote-user", true);
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (req.status !== 200) {
            return;
        }
        remoteUser = JSON.parse(req.responseText);
        console.log(`Remote user: ${remoteUser.user} [${remoteUser.name}], role: ${remoteUser.role}`);
        callback(remoteUser);
    };*/
    return {user: 'miroslav.kozel', name: 'Miroslav Kozel', role: []};
    //return Promise.reject('No user authenticated!!')
}

