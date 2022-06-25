export default function convertToArray(blockBlockList) {
    let stringBuilder = new Array();
    for (let blockBLock of blockBlockList) {
        stringBuilder.push("□(" + blockBLock.blockList[0].position.x + ", " + blockBLock.blockList[0].position.y + ")");
        for (let block of blockBLock.blockList) {
            stringBuilder.push(block.name + " | [" + block.arguments + "]");
        }
    }
    return stringBuilder;
}