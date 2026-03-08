type ResettableStore = {
  getState: () => { reset: () => void };
  persist: { getOptions: () => { name?: string } };
};

const registry: ResettableStore[] = [];

/**
 * Registers a ResettableStore instance into the registry.
 *
 * @param {ResettableStore} store - The store instance to be registered. This store
 * must implement a reset mechanism that allows it to be cleared or reset when necessary.
 */
export const registerStore = (store: ResettableStore) => {
  registry.push(store);
};

/**
 * Resets the state of all stores in the registry.
 *
 * This function iterates through each store within the registry
 * and invokes its reset method to revert its state to the
 * initial configuration. It is typically used to clear stored
 * states or reinitialize the application-wide data held by each store.
 */
export const resetAllStores = () => {
  console.log("Resetting stores and clearing persisted data...");
  registry.forEach(store => {
    console.log("Resetting store:", store.persist.getOptions().name);
    store.getState().reset();
  });
};
