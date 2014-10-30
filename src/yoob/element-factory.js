/*
 * This file is part of yoob.js version 0.7-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Functions for creating elements.
 *
 * I dunno -- maybe just setting innerHTML would be better.
 */

yoob.makeCanvas = function(container, width, height) {
    var canvas = document.createElement('canvas');
    if (width) {
        canvas.width = width;
    }
    if (height) {
        canvas.height = height;
    }
    container.appendChild(canvas);
    return canvas;
};

yoob.makeButton = function(container, label) {
    var button = document.createElement('button');
    button.innerHTML = label;
    container.appendChild(button);
    return button;
};

yoob.checkBoxNumber = 0;
yoob.makeCheckbox = function(container, checked, labelText, fun) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = 'cfzzzb_' + yoob.checkBoxNumber;
    checkbox.checked = checked;
    var label = document.createElement('label');
    label.htmlFor = 'cfzzzb_' + yoob.checkBoxNumber;
    yoob.checkBoxNumber += 1;
    label.appendChild(document.createTextNode(labelText));
    
    container.appendChild(checkbox);
    container.appendChild(label);

    if (fun) {
        checkbox.onchange = function(e) {
            fun(checkbox.checked);
        }
    }
    return checkbox;
};

yoob.makeSlider = function(container, min, max, value) {
    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = value;
    container.appendChild(slider);
    return slider;
};

yoob.makeParagraph = function(container, innerHTML) {
    var p = document.createElement('p');
    p.innerHTML = innerHTML;
    container.appendChild(p);
    return p;
};
