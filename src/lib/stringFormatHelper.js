const spaceCurrency = ' ';
const space1000 = '.';

// export function currencyFormat(value, unit) {
//     const valueString = String(value);
//     return `${valueString.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${space1000}`)}${unit ? `${spaceCurrency}${unit}` : ''}`;
// }

// export function getSurrname(fullName) {
//     if(!fullName || fullName.trim().indexOf(' ') < 0) return fullName;
//     const split = fullName.trim().split(' ');
//     split.shift();
//     return split.join(' ');
// }

// export function getShortName(fullName) {
//     if(!fullName || fullName.trim().indexOf(' ') < 0) return fullName;
//     const split = fullName.trim().split(' ');
//     const name = split.shift();
//     return `${name.charAt(0)}. ${split.join(' ')}`;
// }

// export function getCnFromAdString(AdString) {
    
// if(typeof AdString === "string"){

//     const CN = AdString.split(',')[0]
//     return [CN.split('=')[1]];

//   }else if(typeof AdString === "array"){
//         return [`Arrray on results`];
//       }
// }

export function getSeparatedManagedObjects(AdObj) {

    const fullGroups = AdObj.managedObjects.map(group => {
        const CN = group.split(',')[0]
        return CN.split('=')[1];
    })

    const result = AdObj.managedObjects.map(group => {
        const CN = group.split(',')[0]
        const fullName = CN.split('=')[1];
        return fullName.split('_adv_')[0];
    })

    const originalResult = result.filter((v,i) => result.indexOf(v) === i)
    const resultObj = {}

    originalResult.map(origGroup => {
        resultObj[origGroup] = fullGroups.filter((anyGroup,index) => anyGroup.includes(origGroup))
    })

    return resultObj
    }

export function getSeparatedMemberOf(AdObj) {

    const fullGroups = AdObj.memberOf.map(group => {
        const CN = group.split(',')[0]
        return CN.split('=')[1];
    })

    const result = AdObj.memberOf.map(group => {
        const CN = group.split(',')[0]
        const fullName = CN.split('=')[1];
        return fullName.split('_adv_')[0];
    })

    const originalResult = result.filter((v,i) => result.indexOf(v) === i)
    const memberSeparated = {}

    originalResult.map(origGroup => {
        memberSeparated[origGroup] = fullGroups.filter((anyGroup,index) => anyGroup.includes(origGroup))
    })

    console.log("memberSeparated :>>>> ", memberSeparated)

    return memberSeparated
    }