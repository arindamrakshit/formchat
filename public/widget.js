/* FormChat floating widget. Usage:
   <script src="https://YOUR-APP/widget.js" data-form="SLUG" async></script> */
(function () {
  var s = document.currentScript;
  var slug = s && s.getAttribute("data-form");
  if (!slug) return console.warn("FormChat: missing data-form");
  var origin = new URL(s.src).origin;
  fetch(origin + "/api/public/" + slug)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (form) {
      if (!form) return; // unpublished or missing: render nothing
      var color = s.getAttribute("data-color") || form.color || "#4f46e5";
      var frame = document.createElement("iframe");
      frame.title = form.title;
      Object.assign(frame.style, {
        position: "fixed", right: "20px", bottom: "88px", width: "380px", height: "560px",
        maxWidth: "calc(100vw - 24px)", maxHeight: "calc(100vh - 108px)", border: "0", borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,.25)", display: "none", background: "#fff", zIndex: 2147483646
      });
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Open chat");
      b.textContent = "\uD83D\uDCAC";
      Object.assign(b.style, {
        position: "fixed", right: "20px", bottom: "20px", width: "56px", height: "56px", borderRadius: "50%",
        border: "0", background: color, color: "#fff", fontSize: "24px", cursor: "pointer",
        boxShadow: "0 6px 20px rgba(0,0,0,.3)", zIndex: 2147483647
      });
      var loaded = false;
      b.onclick = function () {
        var open = frame.style.display === "none";
        if (open && !loaded) { frame.src = origin + "/embed/" + slug; loaded = true; }
        frame.style.display = open ? "block" : "none";
        b.textContent = open ? "\u2715" : "\uD83D\uDCAC";
        b.setAttribute("aria-label", open ? "Close chat" : "Open chat");
      };
      document.body.appendChild(frame);
      document.body.appendChild(b);
    })
    .catch(function () {});
})();
