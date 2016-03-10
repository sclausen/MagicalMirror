import {bootstrap} from "angular2/platform/browser";
import {JSONP_PROVIDERS, HTTP_PROVIDERS} from "angular2/http";
import {App} from "./components";

bootstrap(App, [JSONP_PROVIDERS, HTTP_PROVIDERS]);

// Hide the mouse cursor in fullscreenmode after 3 seconds without movement

let mouseMoveTimer = null,
  isCursorVisible = true;

function hideCursor() {
  // isFullscreen
  if (!screenTop && !screenY) {
    mouseMoveTimer = null;
    document.body.style.cursor = "none";
    isCursorVisible = false;
  }
}

document.onmousemove = () => {
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer);
  }
  if (!isCursorVisible) {
    document.body.style.cursor = "default";
    isCursorVisible = true;
  }
  mouseMoveTimer = setTimeout(hideCursor, 3000);
};
