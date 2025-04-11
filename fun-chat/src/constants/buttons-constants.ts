// Buttons
export const BUTTON_TEXT = {
  BACK: "back",
  CROSS: "cross",
  CONFIRM: "confirm",
  THEME: "theme",
} as const;
export const BUTTON_TITLE = {
  THEME: "Change theme",
} as const;
export const SVG_CONFIG = {
  NAMESPACE_SVG: "http://www.w3.org/2000/svg",
  NAMESPACE_XLINK: "http://www.w3.org/1999/xlink",
  QUALIFIED_NAME: "xlink:href",
  ROLE: "img",
} as const;
const SPRITE_PATH = "./sprite.svg#";
export const ICON_PATH = {
  THEME: {
    ON: SPRITE_PATH + "theme-light",
    OFF: SPRITE_PATH + "theme-dark",
  },
} as const;
export const BUTTON_TYPES = {
  SUBMIT: "submit",
} as const;
