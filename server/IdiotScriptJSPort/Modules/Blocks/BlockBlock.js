import ConsoleManager from "../Console/ConsoleManager.js";
import { Block } from "./Block.js";

export class BlockBlock {
    // -- Constructors Needed are --
    // Block List
    // Single Block
    // No Block

    blockList;
    running = false;
    static callsWithoutWait = 0;
    static numItersAllowed = 2000;

    constructor (blockList) {
        this.blockList = blockList;
    }

    runBlock (index, ctx, speed) {
        this.running = true;
        for (let block of this.blockList) {
            if (speed < 1) {
                Promise.resolve().then(() => {

                })
            } else {
                setTimeout(() => {
                }, speed)
            }

        }
        this.run(index, ctx, speed);
    }

    run (index, ctx, speed) {
        if (this.blockList[index].type == "trigger"){
            BlockBlock.callsWithoutWait += 1;
        }

        if (this.blockList[index].name == "Wait") {
            BlockBlock.callsWithoutWait = 0;
        }
        if (BlockBlock.callsWithoutWait > BlockBlock.numItersAllowed) {
            let cancel = confirm("It seems like you forgot to include a wait block so it caused an infinite loop. Stop the program?")
            if (cancel) {
                BlockBlock.callsWithoutWait = 0;
                return; // Immediate halt
            }
        }

        if(ConsoleManager.listening) {
            window.setTimeout(() => {this.run(index, ctx, speed)}, 100); /* this checks the flag every 100 milliseconds*/
            // this.blockList[index].active = true
        }
        else {
            index += 1;
            if (index > this.blockList.length - 1 || this.running == false) return;
            this.blockList[index].run(speed);
            if (this.blockList[index].halt == true) {
                this.blockList[index].halt = false;
                return;
            }
            if (speed < 1) {
                Promise.resolve().then(() => {
                    this.runBlock(index, ctx, speed);
                })
            } else {
                setTimeout(() => {
                    this.runBlock(index, ctx, speed);
                }, speed)
            }
        }
        // }
        // checkFlag();
    }

}