export const columnDef = [
    {
        field: 'name',
        label: 'Project Name',
        className: 'projects-name',
        sort: 'name'
    },
    {
        field: 'manager',
        label: 'Project Manager',
        className: 'projects-manager',
        sort: 'manager'
    },
    {
        field: 'status',
        label: 'Status',
        className: 'projects-status',
        sort: 'status'
    }
];

export const columnDefBids = [
    {
        field: 'name',
        label: 'Project Name',
        className: 'projects-name',
        sort: null
    },
    {
        field: 'lastContact',
        label: 'Last Contact',
        className: 'projects-last-contact',
        sort: 'lastContact',
        clickable: true
    },
    {
        field: 'status',
        label: 'Status',
        className: 'projects-status',
        sort: 'status'
    }
];