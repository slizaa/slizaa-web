// See: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
// See: 
export function setupCanvas(canvas: HTMLCanvasElement, context: any, customWidth?: number, customHeight?: number): number {

    const width = customWidth ||
        canvas.width || // attr, eg: <canvas width='400'>
        canvas.clientWidth; // keep existing width

    const height = customHeight ||
        canvas.height ||
        canvas.clientHeight;
    const deviceRatio = window.devicePixelRatio || 1;

    const bsRatio = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    const ratio = deviceRatio / bsRatio;

    // Adjust canvas if ratio =/= 1
    if (deviceRatio !== bsRatio) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        context.scale(ratio, ratio);
    }
    return ratio;
};
