export const LAYOUT_HEADER_HEIGHT = "75px";
export const MOBILE_LAYOUT_HEADER_HEIGHT = "64px";

export const LAYOUT_FOOTER_HEIGHT = "143px";
export const MOBILE_LAYOUT_FOOTER_HEIGHT = "132.5px";

export const FULL_SCREEN_HEIGHT = `calc(100vh - ${LAYOUT_HEADER_HEIGHT} - ${LAYOUT_FOOTER_HEIGHT})`;

export const MOBILE_FULL_SCREEN_HEIGHT = `calc(100vh - ${MOBILE_LAYOUT_HEADER_HEIGHT} - ${MOBILE_LAYOUT_FOOTER_HEIGHT})`;

export const PAGE_MIN_HEIGHT = [
  MOBILE_FULL_SCREEN_HEIGHT,
  MOBILE_FULL_SCREEN_HEIGHT,
];
