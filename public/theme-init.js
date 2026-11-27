// The guide has one dark theme. Drop any old light/dark choice saved by earlier versions.
(function () {
  try {
    localStorage.removeItem("de-guide:theme");
  } catch (e) {}
})();
