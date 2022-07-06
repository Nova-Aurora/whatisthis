async function loadimg(src) {
    let img;
    const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = src;
    });
    await imageLoadPromise;
    return img;

}

async function getRenderingContext(canvasElement, imagesrc) {
    const img = loadimg(imagesrc);
    const ctx = canvasElement.getContext('2d', { alpha: false });
    return {
        img: await img,
        ctx: ctx,
        ox: 0,
        oy: 0,
        zoom: 1,
        dragging: false,
        lastX: 0,
        lastY: 0,
    }
}
function newpaint(canvas) {
    const matrix = new DOMMatrix;
    const pattern = canvas.ctx.createPattern(canvas.img, 'repeat');
    pattern.setTransform(matrix.translateSelf(canvas.ox, canvas.oy).scaleSelf(canvas.zoom));
    canvas.ctx.fillStyle = pattern;
    canvas.ctx.fillRect(0, 0, canvas.ctx.canvas.width, canvas.ctx.canvas.height);

}

export async function startCanvas(canvasElement, imagesrc) {
    const canvas = await getRenderingContext(canvasElement, imagesrc);
    const resize = () => {
        canvas.ctx.canvas.width = window.innerWidth;
        canvas.ctx.canvas.height = window.innerHeight;
        newpaint(canvas);
    }
    resize();
    window.onresize = resize;
    window.onmousedown = window.ontouchstart = () => { canvas.dragging = true };
    //window.ontouchstart = () => {canvas.dragging = true};
    window.onmouseup = window.ontouchend = () => { canvas.dragging = false };
    //window.ontouchend = () => {canvas.dragging = false};
    window.onmousemove = event => {
        if (!canvas.dragging) { return }
        canvas.ox = (((canvas.ox + event.movementX) / canvas.ctx.canvas.width) % 1) * canvas.ctx.canvas.width;
        canvas.oy = ((((canvas.oy + event.movementY) / canvas.ctx.canvas.height) % 1) * canvas.ctx.canvas.height);
        newpaint(canvas);
    }
    window.ontouchmove = event => {
        if (!canvas.dragging) { return }
        if (event.touches.length === 1) {
            const movementX = event.changedTouches[0].clientX - canvas.lastX;
            const movementY = event.changedTouches[0].clientY - canvas.lastY;
            console.log(`X: ${movementX} Y: ${movementY}`);
            canvas.ox = (((canvas.ox + movementX) / canvas.ctx.canvas.width) % 1) * canvas.ctx.canvas.width;
            canvas.oy = ((((canvas.oy + movementY) / canvas.ctx.canvas.height) % 1) * canvas.ctx.canvas.height);
            newpaint(canvas);
        }
    }
}