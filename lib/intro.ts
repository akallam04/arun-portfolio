import { PROFILE } from "./data";

/**
 * The first-visit intro. It runs as a plain script in <head>, before React, so the overlay is
 * there on the first paint and nothing depends on hydration. It plays once per browser session,
 * only on Home with no #section in the URL, never with reduced motion. Without JavaScript the
 * overlay stays display: none. Any click, key, wheel or touch ends it at once. States on <html>:
 * data-intro="wait" (sky cover, waiting for the font), "play" (name and line), "glide" (name flies
 * into the nav wordmark while Home rises in), then "done".
 */
export const INTRO_KEY = "intro-played";

export const INTRO_SCRIPT = `(function () {
  var d = document.documentElement;
  try {
    if (location.pathname !== "/" || location.hash) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("${INTRO_KEY}")) return;
    sessionStorage.setItem("${INTRO_KEY}", "1");
  } catch (e) {
    return;
  }
  d.setAttribute("data-intro", "wait");
  var timers = [];
  var events = ["pointerdown", "keydown", "wheel", "touchstart"];
  function end() {
    if (d.getAttribute("data-intro") === "done") return;
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    d.setAttribute("data-intro", "done");
    for (var j = 0; j < events.length; j++) removeEventListener(events[j], end, true);
  }
  for (var k = 0; k < events.length; k++) addEventListener(events[k], end, { capture: true, passive: true });
  function glide() {
    try {
      var root = document.getElementById("intro");
      var name = root && root.querySelector(".intro-name");
      var lockup = root && root.querySelector(".intro-lockup");
      var mark = document.querySelector('header nav a[href="#home"]');
      if (!name || !lockup || !mark) return end();
      var from = name.getBoundingClientRect();
      var box = lockup.getBoundingClientRect();
      lockup.style.width = box.width + "px";
      lockup.style.height = box.height + "px";
      var to = mark.getBoundingClientRect();
      var cs = getComputedStyle(mark);
      var s = name.style;
      s.position = "fixed";
      s.margin = "0";
      s.left = to.left + "px";
      s.top = to.top + "px";
      s.fontSize = cs.fontSize;
      s.lineHeight = cs.lineHeight;
      s.letterSpacing = cs.letterSpacing;
      var end1 = name.getBoundingClientRect();
      s.transformOrigin = "0 0";
      s.transition = "none";
      s.transform = "translate(" + (from.left - end1.left) + "px," + (from.top - end1.top) + "px) scale(" + from.width / end1.width + ")";
      name.getBoundingClientRect();
      s.transition = "transform 560ms cubic-bezier(0.2, 0.75, 0.2, 1)";
      s.transform = "none";
      d.setAttribute("data-intro", "glide");
    } catch (e) {
      end();
    }
  }
  var started = false;
  function start() {
    if (started || d.getAttribute("data-intro") !== "wait") return;
    started = true;
    d.setAttribute("data-intro", "play");
    timers.push(setTimeout(glide, 600));
    timers.push(setTimeout(end, 1250));
  }
  // Show the name only once its font is ready, so it never swaps mid-intro. Wait at most 300 ms.
  timers.push(setTimeout(start, 300));
  try {
    document.fonts.load('800 1em "Archivo"').then(start, start);
  } catch (e) {
    start();
  }
})();`;

export const INTRO_HTML = `<div class="intro-bg"></div><div class="intro-stage"><span class="intro-lockup"><span class="intro-name">${PROFILE.name}</span><span class="intro-line"></span></span></div>`;
