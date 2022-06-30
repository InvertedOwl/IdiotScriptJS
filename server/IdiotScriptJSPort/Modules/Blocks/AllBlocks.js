import blockBlockList from "../../main.js";
import ConsoleManager from "../Console/ConsoleManager.js";
import Point from "../Util/Point.js"
import VariableManager from "../Variables/VariableManager.js";
import * as Block from "./Block.js"



export default class allBlocks {
    static windctx = undefined;
    static speed;
    static polyPoint = [];
    static allBlocks = [
        new Block.Block(() => {
            allBlocks.windctx = undefined;
            VariableManager.variableList = {};
            // VariableManager.arrays = {};
        }, "event", new Point(50, 50), "Start", [], false),
        new Block.Block(() => {}, "event", new Point(50, 50), "On Draw Button", 0, false),
        new Block.Block(() => {}, "event", new Point(50, 50), "On Draw Mouse", 0, false),

        new Block.Block((block, ctx, speed) => {
        }, "comment", new Point(210, 50), "Comment", [true]),

        new Block.Block((block, ctx, speed) => {
        }, "var", new Point(130, 50), "No op", []),

        new Block.Block((block, ctx, speed) => {
            VariableManager.newVar(block.arguments[0], block.arguments[1]);
        }, "var", new Point(130, 50), "Create   Var", [true, true]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.newVar(block.arguments[0], VariableManager.getVar(block.arguments[1]));
        }, "var", new Point(130, 50), "Clone Var", [true, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.removeVar(block.arguments[0]);
        }, "var", new Point(130, 50), "Remove Var", [false]),
        new Block.Block((block, ctx, speed) => {
            ConsoleManager.listening = true

            function checkFlag() {
                if(ConsoleManager.listening) {
                   window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
                } else {
                    VariableManager.newVar(block.arguments[0], ConsoleManager.lastInput);
                }
            }
            checkFlag();

        }, "var", new Point(130, 50), "Input Var", [true]),
        new Block.Block((block, ctx, speed) => {
            
            VariableManager.setVar(block.arguments[0], Math.random());
        }, "var", new Point(210, 50), "Set Rand", [true]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], new Date().getTime());
        }, "var", new Point(210, 50), "Set Now", [true]),
        new Block.Block((block, ctx, speed) => { 
            if (Array.isArray(VariableManager.getVar(block.arguments[0])) || typeof VariableManager.getVar(block.arguments[0]) == 'object') {
                ConsoleManager.addToConsole(JSON.stringify(VariableManager.getVar(block.arguments[0])).replaceAll('"', "").replaceAll(",", ", ") + "", ctx); 
            } else {
                ConsoleManager.addToConsole(VariableManager.getVar(block.arguments[0]) + "", ctx); 
            }

        }, "var", new Point(290, 50), "Print Var", [false]),
        new Block.Block((block, ctx, speed) => { 
            ConsoleManager.addToConsole(String.fromCharCode(parseInt(VariableManager.getVar(block.arguments[0]))))
        }, "var", new Point(290, 50), "Print Var ASCII", [false]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0].toString()] = new Array();
        }, "var", new Point(290, 50), "Create Array", [true]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0].toString()].push(VariableManager.getVar(block.arguments[1]))
        }, "var", new Point(290, 50), "Array Push", [false, false]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0].toString()].push(block.arguments[1])
        }, "var", new Point(290, 50), "Push Primitive", [false, true]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0].toString()][parseFloat(VariableManager.getVar(block.arguments[1]))] = VariableManager.getVar(block.arguments[2])
        
        }, "var", new Point(290, 50), "Set Index Of", [false, false, false]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[2].toString(), VariableManager.variableList[block.arguments[0].toString()][parseFloat(VariableManager.getVar(block.arguments[1]))])
        }, "var", new Point(290, 50), "Get Index Of", [false, false, true]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0].toString()].splice(parseFloat(VariableManager.getVar(block.arguments[1])), 1)
        }, "var", new Point(290, 50), "Remove Index", [false, false]),

        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[1].toString(), VariableManager.variableList[block.arguments[0].toString()].length)
        }, "var", new Point(290, 50), "Length Of Array", [false, true]),

        new Block.Block((block, ctx, speed) => {
            ConsoleManager.addToConsole(block.arguments[0] + "", ctx);
        }, "var", new Point(290, 50), "Print Primitive", [true]),

        // Maps
        new Block.Block((block, ctx, speed) => {
            VariableManager.newVar(block.arguments[0], {})
        }, "var", new Point(290, 50), "Create Map", [true]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0]][VariableManager.variableList[block.arguments[1]]] = VariableManager.variableList[block.arguments[2]]
        }, "var", new Point(290, 50), "Set Map Var", [false, false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[0]][block.arguments[1]] = block.arguments[2]
        }, "var", new Point(290, 50), "Set Map Primitive", [false, false, true]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.variableList[block.arguments[2]] = VariableManager.variableList[block.arguments[0]][VariableManager.variableList[block.arguments[1]]]
        }, "var", new Point(290, 50), "Get Map Var", [false, false, true]),


        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], parseFloat(VariableManager.getVar(block.arguments[0])) + parseFloat(VariableManager.getVar(block.arguments[1])));
        }, "operation", new Point(290, 50), "Add Vars", [false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], parseFloat(VariableManager.getVar(block.arguments[0])) * parseFloat(VariableManager.getVar(block.arguments[1])));
        }, "operation", new Point(290, 50), "Multiply Vars", [false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], parseFloat(VariableManager.getVar(block.arguments[0])) / parseFloat(VariableManager.getVar(block.arguments[1])));
        }, "operation", new Point(290, 50), "Divide Vars", [false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], parseFloat(VariableManager.getVar(block.arguments[0])) - parseFloat(VariableManager.getVar(block.arguments[1])));
        }, "operation", new Point(290, 50), "Subtract Vars", [false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], Math.floor(VariableManager.getVar(block.arguments[0])));
        }, "operation", new Point(290, 50), "Floor Float", [false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], Math.sin(VariableManager.getVar(block.arguments[0])));
        }, "operation", new Point(290, 50), "Sin", [false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], Math.cos(VariableManager.getVar(block.arguments[0])));
        }, "operation", new Point(290, 50), "Cos", [false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], Math.tan(VariableManager.getVar(block.arguments[0])));
        }, "operation", new Point(290, 50), "Tan", [false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], parseFloat(VariableManager.getVar(block.arguments[1])) % parseFloat(VariableManager.getVar(block.arguments[2])));
        }, "operation", new Point(290, 50), "Mod Vars", [true, false, false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.setVar(block.arguments[0], VariableManager.getVar(block.arguments[0]) + VariableManager.getVar(block.arguments[1]));
        }, "operation", new Point(290, 50), "Concatinate Vars", [false, false]),
        new Block.Block((block, ctx, speed) => {
            block.halt = true;
            setTimeout(() => {
                for (let blockBLock of blockBlockList)
                {
                    for (let i = 0; i < blockBLock.blockList.length; i++) {
                        if (blockBLock.blockList[i] == block) {
                            block.halt = false;
                            blockBLock.runBlock(i, ctx, allBlocks.speed)
                        }
                    }
                }

            }, parseFloat(VariableManager.getVar(block.arguments[0])));
        }, "operation", new Point(290, 50), "Wait", [false]),
        new Block.Block((block, ctx, speed) => {
            allBlocks.speed = parseFloat(VariableManager.getVar(block.arguments[0]));
        }, "operation", new Point(290, 50), "Set BB Speed", [false]),
        new Block.Block((block, ctx, speed) => {
            VariableManager.newVar(block.arguments[1], VariableManager.getVar(block.arguments[0]).split(""));
        }, "operation", new Point(290, 50), "String to array", [false, true]),
        new Block.Block((block, ctx, speed) => {

        }, "trigger", new Point(290, 50), "Trigger", [true]),
        
        new Block.Block((block, ctx, speed) => {
            for (let blockBLock of blockBlockList)
            {
                for (let i = 0; i < blockBLock.blockList.length; i++) {
                    if (blockBLock.blockList[i].arguments[0] == block.arguments[0] && blockBLock.blockList[i].name == "Trigger") {
                        block.halt = true;

                        if (speed < 1) {
                            Promise.resolve().then(() => {
                                blockBLock.runBlock(i, ctx, allBlocks.speed)
                            })
                        }  else {
                            setTimeout(() => {
                                blockBLock.runBlock(i, ctx, allBlocks.speed)
                            }, speed);
                        }                       
                    }
                }   
            }
        }, "trigger", new Point(290, 50), "Jump", [true]),
        new Block.Block((block, ctx, speed) => {
            for (let blockBLock of blockBlockList)
            {
                //("BRUH")

                for (let i = 0; i < blockBLock.blockList.length; i++) {
                    if (blockBLock.blockList[i].arguments[0] == VariableManager.getVar(block.arguments[0]).toString() && blockBLock.blockList[i].name == "Trigger") {
                        block.halt = true;
                        if (speed < 1) {
                            Promise.resolve().then(() => {
                                blockBLock.runBlock(i, ctx, allBlocks.speed)
                            })
                        } 
                        else {
                            setTimeout(() => {
                                blockBLock.runBlock(i, ctx, allBlocks.speed)
                            }, speed);
                        }  

                    }
                }   
            }
        }, "trigger", new Point(290, 50), "Jump ToVar", [false]),
        new Block.Block((block, ctx, speed) => {
            if (VariableManager.getVar(block.arguments[1]) == VariableManager.getVar(block.arguments[2])){
                for (let blockBLock of blockBlockList)
                {
                    for (let i = 0; i < blockBLock.blockList.length; i++) {
                        if (blockBLock.blockList[i].arguments[0] == block.arguments[0] && blockBLock.blockList[i].name == "Trigger") {
                            block.halt = true;

                            if (speed < 1) {
                                Promise.resolve().then(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                })
                            } 
                            else {
                                setTimeout(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                }, speed);
                            }  
                        }
                    }   
                }
            }
        }, "trigger", new Point(290, 50), "Jump If = ", [true, false, false]),
        new Block.Block((block, ctx, speed) => {
            if (VariableManager.getVar(block.arguments[1]) != VariableManager.getVar(block.arguments[2])){
                for (let blockBLock of blockBlockList)
                {
                    for (let i = 0; i < blockBLock.blockList.length; i++) {
                        if (blockBLock.blockList[i].arguments[0] == block.arguments[0] && blockBLock.blockList[i].name == "Trigger") {
                            block.halt = true;

                            if (speed < 1) {
                                Promise.resolve().then(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                })
                            }   
                            else {
                                setTimeout(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                }, speed);
                            }  
                        }
                    }   
                }
            }
        }, "trigger", new Point(290, 50), "Jump If  !=", [true, false, false]),
        new Block.Block((block, ctx, speed) => {
            if (parseFloat(VariableManager.getVar(block.arguments[1])) > parseFloat(VariableManager.getVar(block.arguments[2]))){
                for (let blockBLock of blockBlockList)
                {
                    for (let i = 0; i < blockBLock.blockList.length; i++) {
                        if (blockBLock.blockList[i].arguments[0] == block.arguments[0] && blockBLock.blockList[i].name == "Trigger") {
                            block.halt = true;

                            if (speed < 1) {
                                Promise.resolve().then(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                })
                            }   
                            else {
                                setTimeout(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                }, speed);
                            }  
                        }
                    }   
                }
            }
        }, "trigger", new Point(290, 50), "Jump If >", [true, false, false]),
        new Block.Block((block, ctx, speed) => {
            if (parseFloat(VariableManager.getVar(block.arguments[1])) < parseFloat(VariableManager.getVar(block.arguments[2]))){
                for (let blockBLock of blockBlockList)
                {
                    for (let i = 0; i < blockBLock.blockList.length; i++) {
                        if (blockBLock.blockList[i].arguments[0] == block.arguments[0] && blockBLock.blockList[i].name == "Trigger") {
                            block.halt = true;

                            if (speed < 1) {
                                Promise.resolve().then(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                })
                            }   
                            else {
                                setTimeout(() => {
                                    blockBLock.runBlock(i, ctx, allBlocks.speed)
                                }, speed);
                            }  
                        }
                    }   
                }
            }
        }, "trigger", new Point(290, 50), "Jump If <", [true, false, false]),
        new Block.Block((block, ctx, speed) => {
            let wind = window.open("", "littleWindow", "location=center,resizable=no,width=390,height=369");
            wind.document.write("<style>body { margin: 0; }</style><link href='https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' rel='stylesheet'><canvas id='windcanvas' width='400' height='400' style='margin: 0;'><title>IS JS Draw Window</title>")
            var canvas = wind.document.getElementById('windcanvas');

            wind.addEventListener("keydown", (e) => {
                VariableManager.setVar("e", e.keyCode)
                e.preventDefault()
                for (let blockBlock of blockBlockList) {
                    for (let i = 0; i < blockBlock.blockList.length; i++) {
                        let block = blockBlock.blockList[i]
                        if (block.name == "On Draw Button") {
                            allBlocks.speed = speed;
                            blockBlock.runBlock(i, ctx, allBlocks.speed);
                        }
                    }
                }
            })

            wind.addEventListener('mousedown', (e) => {
                VariableManager.setVar("e", e.button)
                VariableManager.setVar("mouseX", e.clientX)
                VariableManager.setVar("mouseY", e.clientY)
                e.preventDefault()
                for (let blockBlock of blockBlockList) {
                    for (let i = 0; i < blockBlock.blockList.length; i++) {
                        let block = blockBlock.blockList[i]
                        if (block.name == "On Draw Mouse") {
                            allBlocks.speed = speed;
                            blockBlock.runBlock(i, ctx, allBlocks.speed);
                        }
                    }
                }
            })

            allBlocks.windctx = canvas.getContext('2d');  
            allBlocks.windctx.font = "bold 25px Nunito";
            wind.document.close()

        }, "draw", new Point(290, 50), "Draw     Window", 0),
        new Block.Block((block, ctx, speed) => {
            
            allBlocks.windctx.fillText(VariableManager.getVar(block.arguments[0]).toString(), parseFloat(VariableManager.getVar(block.arguments[1])), parseFloat(VariableManager.getVar(block.arguments[2])))


        }, "draw", new Point(290, 50), "Draw Var", [false, false, false]),
        new Block.Block((block, ctx, speed) => {
            allBlocks.windctx.fillRect(parseFloat(VariableManager.getVar(block.arguments[0])), parseFloat(VariableManager.getVar(block.arguments[1])), parseFloat(VariableManager.getVar(block.arguments[2])), parseFloat(VariableManager.getVar(block.arguments[2])))
        }, "draw", new Point(290, 50), "Draw Square", [false, false, false]),

        new Block.Block((block, ctx, speed) => {
            allBlocks.windctx.fillRect(parseFloat(VariableManager.getVar(block.arguments[0])), parseFloat(VariableManager.getVar(block.arguments[1])), parseFloat(VariableManager.getVar(block.arguments[2])), parseFloat(VariableManager.getVar(block.arguments[3])))
        }, "draw", new Point(290, 50), "Draw Rect", [false, false, false, false]),

        new Block.Block((block, ctx, speed) => {
            let oldCol = allBlocks.windctx.fillStyle;
            allBlocks.windctx.fillStyle = 'rgb(255, 255 ,255)'
            allBlocks.windctx.fillRect(0, 0, 500, 500)
            allBlocks.windctx.fillStyle = oldCol
            
        }, "draw", new Point(290, 50), "Clear", []),

        new Block.Block((block, ctx, speed) => {
            allBlocks.windctx.fillStyle = block.arguments[0]
        }, "draw", new Point(290, 50), "Set Color", [true]),

        new Block.Block((block, ctx, speed) => {
            this.polyPoint = new Array();
        }, "draw", new Point(290, 50), "Start Poly", []),
        new Block.Block((block, ctx, speed) => {
            this.polyPoint.push(new Point(parseFloat(VariableManager.getVar(block.arguments[0])), parseFloat(VariableManager.getVar(block.arguments[1]))))
        }, "draw", new Point(290, 50), "Set Point", [false, false]),
        new Block.Block((block, ctx, speed) => {
            allBlocks.windctx.beginPath();
            allBlocks.windctx.moveTo(this.polyPoint[0].x, this.polyPoint[0].y);

            for (let i = 1; i < this.polyPoint.length; i++) {
                allBlocks.windctx.lineTo(this.polyPoint[i].x, this.polyPoint[i].y)
            }

            allBlocks.windctx.closePath();
            allBlocks.windctx.fill();
        }, "draw", new Point(290, 50), "End Poly", []),
        

    ]
}