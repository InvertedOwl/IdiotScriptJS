export function getColorAt (ctx, x, y) {
    let data = ctx.getImageData(x, y, 1, 1).data;

    return {
        "r": data[0],
        "g": data[1],
        "b": data[2]
    }
}
export function getInvertedColorAt (ctx, x, y) {
    let data = ctx.getImageData(x, y, 1, 1).data;

    return {
        "r": 255 - data[0],
        "g": 255 - data[1],
        "b": 255 - data[2]
    }
}