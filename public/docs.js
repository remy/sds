/* eslint-env browser */

if (window.location.hash) {
  const details = document.querySelector(window.location.hash);

  if (details) {
    details.open = true;
    details.scrollIntoView();
  }
}
