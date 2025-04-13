export const APP_NAME = "Fun Chat";

export const LS_PREFIX = "radomskaia--fun-chat--";

// Common constants
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const EMPTY_STRING = "";
export const MS_IS_SECOND = 1000;
export const SYMBOLS = {
  HASH: "#",
  BRACKET: {
    OPEN: "(",
    CLOSE: ")",
  },
};

export const PAGE_PATH = {
  MAIN: "/",
  LOGIN: "/login",
  ABOUT: "/about",
  NOT_FOUND: "404",
} as const;

// Messages
export const MESSAGES = {
  ROUTE_NOT_FOUND: "Route not found",
  NOT_INITIALIZED: "Class is not initialized",
  PAGE_NOT_FOUND: "Sorry, page not found",
  INVALID_DATA: "Invalid data",
} as const;

export const ERROR_MESSAGES = {
  PATH_REQUIRED: "Path is required",
  INVALID_DATA: "Invalid data",
  NO_LISTENERS: "No listeners for event type",
  ABORTED: "Aborted",
  RACE_STOPPED: "Race stopped by user",
  FETCH: "Error while fetching data: ",
  SERVICE_NOT_FOUND: "Service not found",
  INVALID_SERVICE: "Invalid service",
  CONTAINER_NOT_FOUND: "Container not found",
} as const;

export const ATTRIBUTES = {
  FILL: "fill",
  ARIA_LABEL: "aria-label",
} as const;
