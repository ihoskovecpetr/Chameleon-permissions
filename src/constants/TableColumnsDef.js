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
        sort: 'name'
    },
    {
        field: 'client',
        label: 'Client',
        className: 'projects-client',
        sort: 'client'
    },
    {
        field: 'team',
        label: 'Team',
        className: 'projects-team',
        sort: null
    },
    {
        field: 'status',
        label: 'Status',
        className: 'projects-status',
        sort: 'status',
        inline: true
    },
    {
        field: 'budget',
        label: 'Budget',
        className: 'projects-budget',
        sort: null
    },
    {
        field: 'go-ahead',
        label: 'Go Ahead',
        className: 'projects-go-ahead',
        sort: 'go-ahead'
    },
    {
        field: 'last-contact',
        label: 'Contacted',
        className: 'projects-last-contact',
        sort: 'last-contact',
        inline: true
    }
];