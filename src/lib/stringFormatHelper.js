const spaceCurrency = ' ';
const space1000 = '.';

export function currencyFormat(value, unit) {
    const valueString = String(value);
    return `${valueString.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${space1000}`)}${unit ? `${spaceCurrency}${unit}` : ''}`;
}