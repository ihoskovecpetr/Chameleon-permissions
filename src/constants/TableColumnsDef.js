export const ProjectsColumnDef = [
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

export const ActiveBidsColumnDef = [
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

export const CompaniesColumnDef = [
    {
        field: 'name',
        label: 'Company Name',
        className: 'companies-name',
        sort: 'name'
    }
];

export const PeopleColumnDef = [
    {
        field: 'name',
        label: 'Person Name',
        className: 'people-name',
        sort: 'name'
    }
];