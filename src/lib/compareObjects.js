export default function areEquivalent(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
};