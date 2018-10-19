export const ProjectsColumnDef = [
    {
        field: 'name',
        label: 'Project Name',
        className: 'project-name',
        sort: 'name'
    },
    {
        field: 'client',
        label: 'Client',
        className: 'project-client',
        sort: 'client'
    },
    {
        field: 'producer',
        label: 'Project Producer',
        className: 'project-producer',
        sort: 'producer'
    },
    {
        field: 'manager',
        label: 'Project Manager',
        className: 'project-manager',
        sort: 'manager'
    },
    {
        field: 'supervisor',
        label: 'Project Supervisor',
        className: 'project-supervisor',
        sort: 'supervisor'
    },
    {
        field: 'status',
        label: 'Status',
        className: 'project-status',
        sort: 'status'
    }
];

export const ActiveBidsColumnDef = [
    {
        field: 'name',
        label: 'Project Name',
        className: 'bid-name',
        sort: 'name'
    },
    {
        field: 'client',
        label: 'Client',
        className: 'bid-client',
        sort: 'client'
    },
    {
        field: 'team',
        label: 'Team',
        className: 'bid-team',
        sort: null
    },
    {
        field: 'status',
        label: 'Status',
        className: 'bid-status',
        sort: 'status',
        inline: true
    },
    {
        field: 'budget',
        label: 'Budget',
        className: 'bid-budget',
        sort: null
    },
    {
        field: 'go-ahead',
        label: 'Go Ahead',
        className: 'bid-go-ahead',
        sort: 'go-ahead'
    },
    {
        field: 'last-contact',
        label: 'Contacted',
        className: 'bid-last-contact',
        sort: 'last-contact',
        inline: true
    }
];

export const CompaniesColumnDef = [
    {
        field: 'name',
        label: 'Company Name',
        className: 'company-name',
        sort: 'name'
    },
    {
        field: 'business',
        label: 'Business',
        className: 'company-business',
        sort: null
    },
    {
        field: 'contact',
        label: 'Contact',
        className: 'company-contact',
        sort: null
    }
];

export const PersonsColumnDef = [
    {
        field: 'name',
        label: 'Person Name',
        className: 'person-name',
        sort: 'name'
    },
    {
        field: 'company',
        label: 'Company',
        className: 'person-company',
        sort: 'company'
    },
    {
        field: 'profession',
        label: 'Profession',
        className: 'person-profession',
        sort: null
    },
    {
        field: 'contact',
        label: 'Contact',
        className: 'person-contact',
        sort: null
    }
];