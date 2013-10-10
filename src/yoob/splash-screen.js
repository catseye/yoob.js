/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An adapter-type thing which displays a div element with some inner HTML
 * (typically containing a message or logo or such) and a "Proceed" button,
 * all in place of a given element.  When the button is clicked, the div is
 * hidden, the given element is displayed, and the passed-in callback
 * is invoked.
 *
 * The intention is to allow a "splash screen", which may contain a disclaimer
 * or similar, warning of epileptic seizures or nudity or whatever, before the
 * "main canvas" or whatever is actually displayed and started.  Yeah.
 */
yoob.splashScreen = function(cfg) {
    var innerHTML = cfg.innerHTML;
    var buttonText = cfg.buttonText || "Proceed";
    var elementId = cfg.elementId;

    var elem = document.getElementById(elementId);
    var coveringDiv = document.createElement("div");
    //alert(elem.style.width);
    coveringDiv.style.left = elem.offsetLeft + 'px';
    coveringDiv.style.top = elem.offsetTop + 'px';
    coveringDiv.style.width = elem.offsetWidth + 'px';
    coveringDiv.style.height = elem.offsetHeight + 'px';
    coveringDiv.style.position = "absolute";
    coveringDiv.style.border = elem.style.border;
    coveringDiv.style.background = cfg.background || '#ffffff';
    // high z-order
    coveringDiv.innerHTML = innerHTML;
    // append button
    // button onclick = function that hides this div and runs callback
    document.body.appendChild(coveringDiv);
};
