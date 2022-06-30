import AllBlocks from "../Blocks/AllBlocks.js";
import * as Block from "../Blocks/Block.js";
import * as BlockBlock from "../Blocks/BlockBlock.js";
import Point from "../Util/Point.js";

export default function arrayToBlockList (str) {

    let blockBlockList = [];
    let strBroken = str.split("□")
    strBroken.splice(0, 1);
    for (let i = 0; i < strBroken.length; i++) {
        let blockBlockS = strBroken[i];

        let lines = blockBlockS.split("\n");

        let blockBlock = new BlockBlock.BlockBlock([]);

        let coords = lines[0].split(", ");

        let test = coords[1].substring(0, coords[1].length - 1);
        let y = parseInt(test)
        let x = parseInt(coords[0].substring(1))



        for (let i = 0; i < lines.length; i++) {
            let block;
            for (let exBlock of AllBlocks.allBlocks) {
                if (lines[i].split(" | ")[0] == exBlock.name) {
                    block = cloneBlock(exBlock);
                    let args = lines[i].split(" | ")[1];
                    args = decodeURIComponent(args);
                    block.arguments = args.substring(1, args.length - 1).split(",");
                    if (i == 1) {
                        block.position = new Point(x, y);
                    }
                }
            }
            if (block != undefined) {
                blockBlock.blockList.push(block);
            }
        }
        blockBlockList.push(blockBlock);
    }
    return blockBlockList;

    function cloneBlock(block) {
        let cloned = new Block.Block(block.action, block.type, new Point(block.position.x, block.position.y), block.name, block.numArgs, false);
        cloned.arguments = [...block.arguments]
        return cloned;
    }
}