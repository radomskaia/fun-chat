import type { State } from "@/Store/global-store/global-store-types.ts";
import { GlobalStoreTypes } from "@/Store/global-store/global-store-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import { StoreController } from "@/Store/store-controller.ts";

export class GlobalStore extends StoreController<State, GlobalStoreTypes> {
  private static instance: GlobalStore;
  private storageService = DIContainer.getInstance().getService(
    ServiceName.STORAGE,
  );

  private constructor(initValue: State) {
    super(initValue);
    window.addEventListener("beforeunload", () => {
      const user = this.store.getState().user;
      if (user) {
        this.storageService.save(GlobalStoreTypes.USER, user);
      } else {
        this.storageService.remove(GlobalStoreTypes.USER);
      }
    });
  }

  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      const authData = DIContainer.getInstance()
        .getService(ServiceName.STORAGE)
        .load(GlobalStoreTypes.USER, ValidatorTypes.authData);
      const initialState = {
        [GlobalStoreTypes.USER]: authData,
      };
      GlobalStore.instance = new GlobalStore(initialState);
    }
    return GlobalStore.instance;
  }
}
