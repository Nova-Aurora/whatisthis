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
        dragging: false
    }
}
function newpaint(canvas) {
    const matrix = new DOMMatrix;
    const pattern = canvas.ctx.createPattern(canvas.img, 'repeat');
    pattern.setTransform(matrix.translateSelf(canvas.ox, canvas.oy));
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
    window.onmousedown = () => {canvas.dragging = true};
    window.onmouseup = () => {canvas.dragging = false};
    window.onmousemove = event => {
        if (!canvas.dragging) {return}
        canvas.ox = (((canvas.ox + event.movementX) / canvas.ctx.canvas.width) % 1) * canvas.ctx.canvas.width;
        canvas.oy = ((((canvas.oy + event.movementY) / canvas.ctx.canvas.height) % 1) * canvas.ctx.canvas.height);
        newpaint(canvas);
    }
}