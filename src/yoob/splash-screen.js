/*
 * This file is part of yoob.js version 0.5
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An adapter-type thing which displays a div element with some inner HTML
 * (typically containing a message or logo or such) and a "Proceed" button,
 * all in place of a given element.  When the button is clicked, the div is
 * hidden, the given element is displayed, and the passed-in `onproceed`
 * callback is invoked.
 *
 * The intention is to allow a "splash screen", which may contain a disclaimer
 * or similar, warning of epileptic seizures or nudity or whatever, before the
 * "main canvas" or whatever is actually displayed and started.  Yeah.
 */
yoob.showSplashScreen = function(cfg) {
    var elem = document.getElementById(cfg.elementId);
    var coveringDiv = document.createElement("div");
    coveringDiv.style.left = elem.offsetLeft + 'px';
    coveringDiv.style.top = elem.offsetTop + 'px';
    coveringDiv.style.width = elem.offsetWidth + 'px';
    coveringDiv.style.height = elem.offsetHeight + 'px';
    coveringDiv.style.position = "absolute";
    coveringDiv.style.border = elem.style.border;
    coveringDiv.style.background = cfg.background || '#ffffff';
    if (parseInt(elem.style.zIndex) === NaN) {
        coveringDiv.style.zIndex = 100;
    } else {
        coveringDiv.style.zIndex = parseInt(elem.style.zIndex) + 1;
    }
    coveringDiv.innerHTML = cfg.innerHTML;
    var button = document.createElement("button");
    button.innerHTML = cfg.buttonText || "Proceed";
    button.onclick = function() {
        coveringDiv.style.display = 'none';
        (cfg.onproceed || function() {})();
    };
    coveringDiv.appendChild(button);
    document.body.appendChild(coveringDiv);
};
