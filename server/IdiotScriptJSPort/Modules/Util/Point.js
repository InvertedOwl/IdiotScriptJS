export default class Point {
    static scale = 1;
    _x;
    _y;
    constructor (x, y) {
        this._x = x;
        this._y = y;
    }

    // Getters and setters
    get x(){
        return this._x / Point.scale;
    }
    get y() {
        return this._y / Point.scale;
    }

    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }

    // Distance function
    distanceTo(point) {
        let val = Math.sqrt(Math.pow(point.x - this._x, 2) + Math.pow(point.y - this._y, 2));
        return val;
    }

    inSquare(point, width, height) {
        if (this.x > point.x && this.y > point.y && this.x < point.x + width && this.y < point.y + height) {
            return true;
        }
        if (this.x < point.x && this.y < point.y && this.x > point.x + width && this.y > point.y + height) {
            return true;
        }
        if (this.x > point.x && this.y < point.y && this.x < point.x + width && this.y > point.y + height) {
            return true;
        }
        if (this.x < point.x && this.y > point.y && this.x > point.x + width && this.y < point.y + height) {
            return true;
        }
        return false;
    }
    inPointSquare(point, point2) {
        if (this.x > point.x && this.y > point.y && this.x < point2.x && this.y < point2.y) {
            return true;
        }
        return false;
    }
}