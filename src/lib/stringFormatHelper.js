const spaceCurrency = ' ';
const space1000 = '.';

export function currencyFormat(value, unit) {
    const valueString = String(value);
    return `${valueString.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${space1000}`)}${unit ? `${spaceCurrency}${unit}` : ''}`;
}

export function getSurrname(fullName) {
    if(!fullName || fullName.trim().indexOf(' ') < 0) return fullName;
    const split = fullName.trim().split(' ');
    split.shift();
    return split.join(' ');
}

export function getShortName(fullName) {
    if(!fullName || fullName.trim().indexOf(' ') < 0) return fullName;
    const split = fullName.trim().split(' ');
    const name = split.shift();
    return `${name.charAt(0)}. ${split.join(' ')}`;
}