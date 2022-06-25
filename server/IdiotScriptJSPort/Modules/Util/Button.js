export default class Button {
    position;
    width;
    height;
    action;
    text;
    draw = true;

    constructor(position, width, height, action, text) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.action = action;
        this.text = text;
    }

    onClick() {
        this.action();
    }
}
