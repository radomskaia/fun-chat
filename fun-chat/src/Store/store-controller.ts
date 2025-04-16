import { Store } from "@/Store/store.ts";
import { StoreObserver } from "@/Store/store-observer.ts";
import type { State, StoreCallback } from "@/Store/store-types.ts";
import { StoreTypes } from "@/Store/store-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { ValidatorTypes } from "@/types/validator-types.ts";

export class StoreController {
  private static instance: StoreController;
  private store = Store.getInstance();
  private observer = StoreObserver.getInstance();
  private storageService = DIContainer.getInstance().getService(
    ServiceName.STORAGE,
  );

  private constructor() {
    window.addEventListener("beforeunload", () => {
      const user = this.store.getState().user;
      if (user) {
        this.storageService.save(StoreTypes.USER, user);
      } else {
        this.storageService.remove(StoreTypes.USER);
      }
    });

    const authData = this.storageService.load(
      StoreTypes.USER,
      ValidatorTypes.authData,
    );
    this.store.init({ [StoreTypes.USER]: authData });
  }

  public static getInstance(): StoreController {
    if (!StoreController.instance) {
      StoreController.instance = new StoreController();
    }
    return StoreController.instance;
  }

  public getState<A extends StoreTypes>(type?: A): State | State[A] {
    const state = this.store.getState();
    if (type) {
      return state[type];
    }
    return state;
  }

  public subscribe(listener: StoreCallback, type?: StoreTypes): () => void {
    let unsubscribe: () => void;
    unsubscribe = type
      ? this.observer.subscribe(listener, type)
      : this.store.subscribe(listener);
    return unsubscribe;
  }

  public dispatch<A extends StoreTypes>(type: A, payload: State[A]): void {
    this.store.dispatch(type, payload);
  }
}
