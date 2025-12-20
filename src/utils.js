
export var imageCount = 0;

export function loadImage(url, angles, steps, offsetX) {
    imageCount++;
    var i = new Image();
    i.onload = function () {
        imageCount--;
        i.offsetX = offsetX ? ((i.height / angles) >> 2) : 0;
    }
    i.src = url;
    if (typeof angles != "undefined" && typeof steps != "undefined") {
        i.angles = angles;
        i.steps = steps;
    }
    return i;
}

export function load(img, callback) {
    if (img.complete) callback();
    else img.addEventListener('load', callback, false);
}

export function remove(ar, v) {
    var i = ar.indexOf(v);
    if (i >= 0) ar.splice(i, 1);
}

export function randomx(level, s) {
    return Math.floor(Math.random() * (level.floor.map[0].length) * s);
}

export function randomy(level, s) {
    return Math.floor(Math.random() * (level.floor.map.length) * s);
}
