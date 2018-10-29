import * as Icons from './Icons';

export const PRODUCER = {id: 'PRODUCER', sort: 1, label: 'Producer', role: ['booking:producer', 'booking:manager'], multi: false, auto: true, icon: Icons.ICON_ROLE_PRODUCER};
export const MANAGER = {id: 'MANAGER', sort: 2, label: 'Manager', role: 'booking:manager', multi: false, auto: true, icon: Icons.ICON_ROLE_MANAGER};
export const MANAGER_2 = {id: 'MANAGER_2', sort: 3, label: 'Manager 2nd', role: 'booking:manager', multi: true, auto: false, icon: Icons.ICON_ROLE_MANAGER};
export const SUPERVISOR = {id: 'SUPERVISOR', sort: 4, label: 'Supervisor', role: 'booking:supervisor', false: true, auto: true, icon: Icons.ICON_ROLE_SUPERVISOR};
export const SUPERVISOR_2 = {id: 'SUPERVISOR_2', sort: 5, label: 'Supervisor 2nd', role: 'booking:supervisor', multi: true, auto: false, icon: Icons.ICON_ROLE_SUPERVISOR};
export const LEAD_2D = {id: 'LEAD_2D', sort: 6, label: '2D lead', role: 'booking:lead2D', multi: false, auto: true, icon: Icons.ICON_ROLE_LEAD_2D};
export const LEAD_3D = {id: 'LEAD_3D', sort: 7, label: '3D lead', role: 'booking:lead3D', multi: false, auto: true, icon: Icons.ICON_ROLE_LEAD_3D};
export const LEAD_MP = {id: 'LEAD_MP', sort: 8, label: 'MP lead', role: 'booking:leadMP', multi: false, auto: true, icon: Icons.ICON_ROLE_LEAD_MP};
export const COLORIST = {id: 'COLORIST', sort: 9, label: 'Colorist', role: 'booking:colorist', multi: false, auto: true, icon: Icons.ICON_ROLE_COLORIST};
export const DIRECTOR = {id: 'DIRECTOR', sort: 10, label: 'Director', role: ['booking:producer', 'booking:manager', 'booking:supervisor', 'booking:lead2D', 'booking:lead3D', 'booking:leadMP'], multi: false, auto: false, icon: Icons.ICON_ROLE_DIRECTOR};