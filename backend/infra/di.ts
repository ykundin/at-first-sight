export interface DIDeps {
  store: any;
}

interface DIStore {
  current: DIDeps;
}

export interface DIManager {
  get(): DIDeps;
  setMany(deps: DIDeps): void;
}

const store: DIStore = {
  current: {} as any,
};

export const DI: DIManager = {
  get() {
    return store.current;
  },

  setMany(deps) {
    store.current = deps;
  },
};
