
export class Block {
    action;
    type;
    position;
    name;
    numArgs;
    manualPrimitive;
    active = false;
    arguments = [];
    halt = false;

    constructor (action, type, position, name, numArgs, manualPrimitive) {
        this.action = action;
        this.type = type;
        this.position = position;
        this.name = name;
        this.numArgs = numArgs;
        this.manualPrimitive
    }

    run (speed) {
        // this.active = true;
        this.activate(speed)
        this.action(this, undefined, speed);

    }

    activate(speed) {
        if (speed < 1) {
            this.active = true;
            return;
        }


        this.active = true;

        setTimeout(() => {
            if (this.active == true) {
                this.active = false;
            }
        }, speed);                

    }
}