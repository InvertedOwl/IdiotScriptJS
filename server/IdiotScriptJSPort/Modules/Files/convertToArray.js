export default function convertToArray(blockBlockList) {
    let stringBuilder = new Array();
    for (let blockBLock of blockBlockList) {
        stringBuilder.push("□(" + blockBLock.blockList[0].position.x + ", " + blockBLock.blockList[0].position.y + ")");
        for (let block of blockBLock.blockList) {
            let args = "";
            for (let i = 0; i < block.arguments.length; i++) {
                if (i < block.arguments.length-1) {
                    args += encodeURIComponent(block.arguments[i]) + ",";
                } else {
                    args += encodeURIComponent(block.arguments[i])
                }
            }
            stringBuilder.push(block.name + " | [" + args + "]");
        }
    }
    return stringBuilder;
}