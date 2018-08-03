export async function getProjects() {
    //throw 'Fake fetching error.';
    const projects = new Array(Math.round(Math.random() * 1500)).fill(0);
    await delay(300);
    return projects.map((item, index) => {
        return {
            id: index,
            value: Math.round(Math.random() * 1000)
        }
    })
}

function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}