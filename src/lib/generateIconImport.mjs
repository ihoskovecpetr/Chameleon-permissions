import * as Icons from '../constants/Icons.mjs';

const icons = {};

for(const iconId of Object.keys(Icons)) {
    let iconDef = Icons[iconId];
    if(!Array.isArray(iconDef)) iconDef = ['fas', iconDef];
    if(!icons[iconDef[0]]) icons[iconDef[0]] = [];
    const iconName = `fa${iconDef[1].replace(/^([a-z])/, g => g.toUpperCase()).replace(/-[a-z]/g, g => g[1].toUpperCase())}`;
    if(icons[iconDef[0]].indexOf(iconName) < 0) icons[iconDef[0]].push(iconName);
}

let allNames = [];
for(const prefix of Object.keys(icons)) {
    switch (prefix) {
        case 'fas':
            console.log(`import {${icons[prefix].map(name => `${name} as ${prefix}_${name}`).join(', ')}} from '@fortawesome/free-solid-svg-icons';`);
            allNames = allNames.concat(icons[prefix].map(name => `${prefix}_${name}`));
            break;

        case 'far':
            console.log(`import {${icons[prefix].map(name => `${name} as ${prefix}_${name}`).join(', ')}} from '@fortawesome/free-regular-svg-icons';`);
            allNames = allNames.concat(icons[prefix].map(name => `${prefix}_${name}`));
            break;

        case 'fab':
            console.log(`import {${icons[prefix].map(name => `${name} as ${prefix}_${name}`).join(', ')}} from '@fortawesome/free-brands-svg-icons';`);
            allNames = allNames.concat(icons[prefix].map(name => `${prefix}_${name}`));
            break;
    }
}

console.log();
console.log(`library.add(${allNames.join(', ')});`);



