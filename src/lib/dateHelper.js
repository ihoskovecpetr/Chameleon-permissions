import moment from 'moment';
/*
moment.updateLocale('en', {
    relativeTime : {
        future: '> %s',
        past: '%s <'
    }
});
*/

//moment.now = () => +new Date(2025, 10, 7);

export function daysToString(date, today, before) {
    if(!date) return '---';
    if(!today) today = moment().startOf('day');
    else today = moment(today).startOf('days');
    let days;
    if(typeof date === 'number') {
        days = date;
    } else if(typeof date === 'string') {
        date = moment(date).startOf('day');
        days = date.diff(today, 'days');
    } else {
        date = moment(date).startOf('day');
        days = date.diff(today, 'days');
    }
    if(typeof days === 'undefined') return '?';
    //if(!before) days = -days;
    if(days === 0) return 'Today';
    if(before && days > 0) return 'Today+';
    if(days === 1) return 'Tomorrow';
    if(days === -1) return 'Yesterday';
    return moment.duration(days , 'days').humanize(!before);
}