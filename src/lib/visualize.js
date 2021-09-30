import drawWave from "./visuals/drawWave.js"

//options:type,colors,stroke
export default function visualize(data, canvasId, options = {}, frame) {
    //make a clone of options
    options = {...options}
    //options
    if (!options.stroke) options.stroke = 1;
    if (!options.colors) options.colors = ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"];

    let canvas = document.getElementById(canvasId);

    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    let h = canvas.height;
    let w = canvas.width;

    ctx.strokeStyle = options.colors[0];
    ctx.lineWidth = options.stroke;
    ctx.globalAlpha = 0.25;

    let typeMap = {
        "wave": drawWave,
    }

    let frameRateMap = {
        "wave": 1,
    }

    const functionContext = {
        data, options, ctx, h, w, Helper: this.Helper, canvasId
    }

    if (typeof options.type == "string") options.type = [options.type]

    options.type.forEach(type => {
        //abide by the frame rate
        if (frame % frameRateMap[type] === 0) {
            //clear canvas
            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();

            typeMap[type](functionContext)
        }
    })
}