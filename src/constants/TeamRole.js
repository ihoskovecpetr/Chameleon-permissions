import * as Icons from './Icons';

export const PRODUCER = {id: 'PRODUCER', sort: 1, label: 'Producer', role: ['booking:producer', 'booking:manager'], multi: false, icon: Icons.ICON_ROLE_PRODUCER};
export const MANAGER = {id: 'MANAGER', sort: 2, label: 'Manager', role: 'booking:manager', multi: false, icon: Icons.ICON_ROLE_MANAGER};
export const SUPERVISOR = {id: 'SUPERVISOR', sort: 3, label: 'Supervisor', role: 'booking:supervisor', multi: true, icon: Icons.ICON_ROLE_SUPERVISOR};
export const LEAD_2D = {id: 'LEAD_2D', sort: 4, label: '2D lead', role: 'booking:lead2D', multi: false, icon: Icons.ICON_ROLE_LEAD_2D};
export const LEAD_3D = {id: 'LEAD_3D', sort: 5, label: '3D lead', role: 'booking:lead3D', multi: false, icon: Icons.ICON_ROLE_LEAD_3D};
export const LEAD_MP = {id: 'LEAD_MP', sort: 6, label: 'MP lead', role: 'booking:leadMP', multi: false, icon: Icons.ICON_ROLE_LEAD_MP};
export const COLORIST = {id: 'COLORIST', sort: 7, label: 'Colorist', role: 'booking:colorist', multi: false, icon: Icons.ICON_ROLE_COLORIST};