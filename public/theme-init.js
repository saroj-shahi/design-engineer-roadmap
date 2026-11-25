// Apply a saved theme choice before first paint (see useTheme in src/components/ui.tsx)
// and promote the non-blocking Google Fonts stylesheet once loaded.
(function () {
  var colors = { light: "#f7f6f2", dark: "#131312" };
  try {
    var t = localStorage.getItem("de-guide:theme");
    if (t === "light" || t === "dark") {
      document.documentElement.dataset.theme = t;
      var meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = colors[t];
    }
  } catch (e) {}

  var fonts = document.getElementById("google-fonts");
  if (fonts) {
    if (fonts.sheet) fonts.media = "all";
    fonts.addEventListener("load", function () {
      fonts.media = "all";
    });
  }
})();
