import type { State } from "@/Store/global-store/global-store-types.ts";
import { GlobalStoreKeys } from "@/Store/global-store/global-store-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { globalStoreReducer } from "@/Store/global-store/global-store-reducer.ts";

export class GlobalStore extends StoreController<
  State,
  {
    type: GlobalStoreKeys;
    payload: State[GlobalStoreKeys];
  }
> {
  private static instance: GlobalStore;
  private storageService = DIContainer.getInstance().getService(
    ServiceName.STORAGE,
  );

  private constructor(
    initValue: State,
    reducer: (
      state: State,
      action: { type: GlobalStoreKeys; payload: State[GlobalStoreKeys] },
    ) => State,
  ) {
    super(initValue, reducer);
    window.addEventListener("beforeunload", () => {
      const user = this.store.getState().user;
      if (user) {
        this.storageService.save(GlobalStoreKeys.USER, user);
      } else {
        this.storageService.remove(GlobalStoreKeys.USER);
      }
    });
  }

  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      const authData = DIContainer.getInstance()
        .getService(ServiceName.STORAGE)
        .load(GlobalStoreKeys.USER, ValidatorTypes.authData);
      const initialState = {
        [GlobalStoreKeys.USER]: authData,
      };
      GlobalStore.instance = new GlobalStore(initialState, globalStoreReducer);
    }
    return GlobalStore.instance;
  }
}
