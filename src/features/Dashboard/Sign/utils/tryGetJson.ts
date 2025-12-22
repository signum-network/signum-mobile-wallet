export function tryGetJSON(str: string) {
    try { return JSON.parse(str); } catch (e) { return null; }
}
