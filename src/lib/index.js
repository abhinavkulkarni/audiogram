'use strict';

import fromElement from "./fromElement";
import visualize from "./visualize";
import Helper from "./helper";

function Wave() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

Wave.prototype = {
    fromElement,
    visualize,
    Helper
}

export default Wave
