/* Landing interactions — pure vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-reveal for sections and list entries.
  var targets = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  // Current year in footer.
  var yr = document.getElementById("year");
  if (yr) { yr.textContent = String(new Date().getFullYear()); }
})();
