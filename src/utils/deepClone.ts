/**
 * Creates a deep clone of the provided object. The cloning process converts
 * the object to a JSON string and then parses it back into an object, effectively
 * creating a new instance with the same structure and value as the original object.
 *
 * @template T The type of the object to be cloned.
 * @param {T} o The object to be deep cloned.
 * @returns {T} A new object that is a deep clone of the input object.
 */
export const deepClone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
