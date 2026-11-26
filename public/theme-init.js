// The guide has one dark theme. Drop any old light/dark choice saved by earlier versions,
// and promote the non-blocking Google Fonts stylesheet once loaded.
(function () {
  try {
    localStorage.removeItem("de-guide:theme");
  } catch (e) {}

  var fonts = document.getElementById("google-fonts");
  if (fonts) {
    if (fonts.sheet) fonts.media = "all";
    fonts.addEventListener("load", function () {
      fonts.media = "all";
    });
  }
})();
