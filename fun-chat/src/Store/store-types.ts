export type StoreCallback<S> = (state: Partial<S>, type?: keyof S) => void;
