import Point from "./Modules/Util/Point.js"
import Button from "./Modules/Util/Button.js"
import * as BlockBlock from "./Modules/Blocks/BlockBlock.js"
import * as Block from "./Modules/Blocks/Block.js"
import { getColorAt, getInvertedColorAt } from "./Modules/Util/PixelMan.js"
import VariableManager from "./Modules/Variables/VariableManager.js"
import ConsoleManager from "./Modules/Console/ConsoleManager.js"
import allBlocks from "./Modules/Blocks/AllBlocks.js"
import download from "./Modules/Files/download.js"
import convertToArray from "./Modules/Files/convertToArray.js"
import arrayToBlockList from "./Modules/Files/arrayToBlockList.js"
import Input from "./Modules/Util/Input.js"
import Text from "./Modules/Util/TextE.js"
const event = new Event('accountClick');
const event2 = new Event('sharedClicked');
const event3 = new Event('modsClick');

let menuButtonList = [];
let menuBarButtonList = [];
let selectedBlockBlocks = [];
let inputs = [];
let texts = [];
let blockBlockList = new Array();
let mouseHeld = false;
let contextActive = false;
let contextPoint = new Point(0, 0);
let contextWidth = 200;
let contextHeight = 500;
let buttonList = new Array();
let startSelectionPoint = new Point(0, 0);
let newSelectionPoint = new Point(0, 0);
let debug = false;
let scale = 1;
let speed = 150;
allBlocks.speed = speed;
let menux = 0;
let xoff = 0;
let yoff = 0;
let ctxg;
let variableListWithoutRun = []
let lowerScrollLimit = 0.4
let upperScrollLimit = 2.2
let checker = true;
let cred = {};
let id = undefined;
let name = "Unnamed board"
let title;

// Board movement 
let boardPos = new Point(0, 0);
let middleMouseHeld = false;
let startMMouseHeld = new Point(0, 0);

// https://www.geeksforgeeks.org/how-to-differentiate-mouse-click-and-drag-event-using-javascript/#:~:text=The%20basic%20difference%20between%20a,for%20both%20click%20and%20drag.
let drag = false;
document.addEventListener(
    'mousedown', (e) => {
      if (e.button == 2){
        drag = false;
        console.log("Down")
      }

    });

document.addEventListener(
    'mousemove', (e) => {

      if (e.buttons == 2) {
        drag = true;
        console.log(e.buttons)
      }

    });

document.addEventListener(
    'mouseup', () => {
        drag = false;

      });
        

// On quit, save
function enableStopSave() {
  window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
  
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  });
}
// On quit, save
function disableStopSave() {
  window.onbeforeunload = null;
}

// https://stackoverflow.com/questions/8782005/prevent-window-from-dragging-in-ios5-mobile-browser
document.body.addEventListener('touchmove', function (ev) { 
  ev.preventDefault();
});


export default blockBlockList;

// Stop default right click action
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
})

if (getCookie("auth") != "") {
  fetch("api/user", { method: "POST", body: JSON.stringify({"authtoken" : getCookie("auth")})}).then((res) => {
    res.json().then((text) => {
      const signUpEvent = new CustomEvent('onSignUp', {
        detail: {
            "username" : text.username,
            "password" : "",
            "authtoken" : getCookie("auth")      
        }
      });
      document.body.dispatchEvent(signUpEvent)
    })
  })
}

if (window.location.href.includes("?")) {
  let url = window.location.href;
  id = url.split("?")[1].split("=")[1];
  fetch("api/board", { method: "GET", headers: {"id": id}}).then((res) => {
    res.json().then((text) => {
      if (text.name == "") {
        name = "Unnamed board"
      } else {
        name = text.name;
      }
      title.inputElement.value = name;
      let gsfgfsd = arrayToBlockList(text.body);
      for (let blockBock of gsfgfsd){
        blockBlockList.push(blockBock);
      }

      variableinit();
      orderBlocks();
      // window.history.replaceState({}, 'idiotscript', '/idiotscript/')

    });
  })
}





setup();
function setup() {
    // Setup
    var heldBlockBlock;
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext('2d');
    ctxg = ctx;

    title = new Input("right: 50%", "top: 5px", 240, 30, (e) => {
      name = title.inputElement.value
    })
    title.inputElement.style.textAlign = "center"
    title.inputElement.style.fontSize = "22px"
    title.inputElement.style.transform = "translate(50%, 0%)"
    title.inputElement.value = name;

    new Input("right: 5px", "bottom: 5px; position: absolute", 240, 30, (e) => {
      let target = e.target.children[0]
      ConsoleManager.lastInput = target.value
      target.value = ""
      ConsoleManager.listening = false
    });

    //constructor(position, width, height, action, text) {
    menuBarButtonList.push(new Button(new Point(0, 0), 50, 40, () => {
      contextHeight = 225
      buttonList = new Array()
      contextActive = true;
      contextPoint = new Point(0, 40);
      buttonList.push(new Button(new Point(5, 5 + 40), 190, 50, () => {
        //(convertToArray(blockBlockList))
        download(name.replaceAll(" ", "_") + ".is", convertToArray(blockBlockList))
        disableStopSave()
      }, "Download Board"))
      buttonList.push(new Button(new Point(5, 60 + 40), 190, 50, () => {
        blockBlockList.splice(0, blockBlockList.length)
        document.getElementById("varInput").click();
      }, "Load Board"))
      buttonList.push(new Button(new Point(5, 115 + 40), 190, 50, () => {
        document.getElementById("varInput").click();
      }, "Import Board"))
      buttonList.push(new Button(new Point(5, 170 + 40), 190, 50, () => {
        clearContext();
        contextActive = true;
        contextHeight = 110;
        let inp = new Input("left: 5", "top: 45px", 190, 30, () => {});
        inp.inputElement.placeholder = "Name"
        inputs.push(inp)

        let check = new Input("left: 5", "top: 80px", 15, 15, () => {})
        check.inputElement.type = "checkbox"
        inputs.push(check)

        let newT = new Text("Unlisted", new Point(30, 97));
        texts.push(newT);

      
          inp.inputElement.value = name
        

        buttonList.push(new Button(new Point(5, 105), 190, 40, () => {
          if (cred.authtoken) { 
            let headers = {'Content-Type': 'text/plain', 'authentication': cred.authtoken, "name" : inp.inputElement.value, "unlisted" : check.inputElement.checked}
            if (id) {
              headers.id = id;
            }
  
            fetch('api/board', {  
              method: 'post',
              headers: headers,
              body: arrayToString(convertToArray(blockBlockList)),
            }).then(function(res){
              if (res.status > 299) {
                ConsoleManager.addToConsole("Woah slow down there! Please wait a few minutes before sharing again.")
              } else {
                if (!id) {
                  id = res.headers.get("id");
                  let newURL = window.location.href.split("?")[0] + "?id=" + res.headers.get("id");
                  if (window.isSecureContext)
                  navigator.clipboard.writeText(newURL);
                  ConsoleManager.addToConsole("Link copied to clipboard!")
                  ConsoleManager.addToConsole("Id: " + res.headers.get("id"))
                  window.history.replaceState({}, 'idiotscript', '/?id=' + res.headers.get("id"))
                } else {
                  let newURL = window.location.href.split("?")[0] + "?id=" + id;
                  if (window.isSecureContext)
                  navigator.clipboard.writeText(newURL);
                  ConsoleManager.addToConsole("Link copied to clipboard!")
                  ConsoleManager.addToConsole("Id: " + id)
                  window.history.replaceState({}, 'idiotscript', '/?id=' + id)
                }
              }  
            })
          } else {
            ConsoleManager.addToConsole("You must log in first to share a board! You can do this by clicking on 'Account' on the top   right")
          }
        }, "Share"))


        disableStopSave()
      }, "Share"))
    }, ""));
    menuBarButtonList.push(new Button(new Point(50, 0), 70, 40, () => {
      contextHeight = 115 + 55
      buttonList = new Array()
      contextActive = true;
      contextPoint = new Point(60, 40);
      buttonList.push(new Button(new Point(5 + 60, 5 + 40), 190, 50, () => {

        buttonList = new Array()
        contextHeight = 60;
        contextWidth = 80

        let input = new Input("left: 65px", "top: 45px", 70, 50, () => {
          allBlocks.speed = parseInt(input.inputElement.value);
          speed = parseInt(input.inputElement.value); 
          clearContext();
        });
        input.inputElement.value = allBlocks.speed;
        input.inputElement.style.fontSize = 30;
        inputs.push(input);

      }, "Set speed"))
      buttonList.push(new Button(new Point(5 + 60, 60 + 40), 190, 50, () => {
        blockBlockList.splice(0, blockBlockList.length)
        clearContext();
        id = undefined;
        name = "Unnamed board"
        title.inputElement.value = name;
        window.history.replaceState({}, 'idiotscript', '/')
      }, "Clear board"))
      buttonList.push(new Button(new Point(5 + 60, 60 + 95), 190, 50, () => {
        blockBlockList.splice(0, blockBlockList.length)
        clearContext();
        if(cred.authtoken && id) {
          if (confirm('Are you sure you want to delete this board? This is permanent and cannot be undone'))
          fetch("/api/board", {method: "DELETE", headers: {"authentication": cred.authtoken, "id": id}})
          id = undefined;
          name = "Unnamed board"
          title.inputElement.value = name;
          window.history.replaceState({}, 'idiotscript', '/')

        }
      }, "Delete board"))
    }, ""));

    menuBarButtonList.push(new Button(new Point(120, 0), 50, 40, () => {
      contextHeight = 115
      buttonList = new Array()
      contextActive = true;
      contextPoint = new Point(120, 40);
      buttonList.push(new Button(new Point(5 + 120, 5 + 40), 190, 50, () => {
        runBoard(ctx);
        clearContext();
      }, "Run board"))
      buttonList.push(new Button(new Point(5 + 120, 100), 190, 50, () => {
        debug = true;
        ConsoleManager.addToConsole("Ctr+D to toggle debug mode")
        runBoard(ctx);
        clearContext();
      }, "Run in debug mode"))
    }, ""));

    menuBarButtonList.push(new Button(new Point(170, 0), 80, 40, () => {
      contextHeight = 170
      buttonList = new Array()
      contextActive = true;
      contextPoint = new Point(190, 40);
      buttonList.push(new Button(new Point(5 + 190, 5 + 40), 190, 50, () => {
        clearContext();
        contextHeight = 80
        contextActive = true;
        let limitInput = new Input("left: 199px", "top: 45px", 180, 30, () => {});
        limitInput.inputElement.value = BlockBlock.BlockBlock.numItersAllowed;
        limitInput.inputElement.style.fontSize = "19px"
        inputs.push(limitInput)

        buttonList.push(new Button(new Point(195, 80), 80, 30, () => {
          BlockBlock.BlockBlock.numItersAllowed = parseInt(limitInput.inputElement.value);
          clearContext();
        }, "Set"))
        buttonList.push(new Button(new Point(300, 80), 80, 30, () => {
          clearContext();
        }, "Cancel"))


      }, "Set Recursive limit"))
      buttonList.push(new Button(new Point(5 + 190, 60 + 40), 190, 50, () => {
        clearContext();
        contextHeight = 120
        contextActive = true;
        let limitInput = new Input("left: 199px", "top: 45px", 180, 30, () => {});
        limitInput.inputElement.value = lowerScrollLimit;
        limitInput.inputElement.style.fontSize = "19px"
        inputs.push(limitInput)
        let limitInput2 = new Input("left: 199px", "top: 80px", 180, 30, () => {});
        limitInput2.inputElement.value = upperScrollLimit;
        limitInput2.inputElement.style.fontSize = "19px"
        inputs.push(limitInput2)

        buttonList.push(new Button(new Point(195, 80 + 40), 80, 30, () => {
          lowerScrollLimit = parseFloat(limitInput.inputElement.value);
          upperScrollLimit = parseFloat(limitInput2.inputElement.value);
          clearContext();
        }, "Set"))
        buttonList.push(new Button(new Point(300, 80 + 40), 80, 30, () => {
          clearContext();
        }, "Cancel"))


      }, "Set Scroll limits"))
      buttonList.push(new Button(new Point(5 + 190, 115 + 40), 190, 50, () => {
        checker = !checker
      }, "Checker Pattern"))
    }, ""));

    menuBarButtonList.push(new Button(new Point(250, 0), 70, 40, () => {
      document.body.dispatchEvent(event2);
    }, ""));

    menuBarButtonList.push(new Button(new Point(window.innerWidth - 90, 0), 90, 40, () => {
      document.body.dispatchEvent(event);
    }, ""));
    menuBarButtonList.push(new Button(new Point(320, 0), 50, 40, () => {
      contextHeight = 115
      buttonList = new Array()
      contextActive = true;
      contextPoint = new Point(330, 40);
      buttonList.push(new Button(new Point(330 + 5, 5 + 40), 190, 50, () => {
        document.body.dispatchEvent(event3);
      }, "Mod List"))
      buttonList.push(new Button(new Point(330 + 5, 100), 190, 50, () => {
        ConsoleManager.addToConsole("WIP feature")
      }, "Remove All Mods"))
    }, ""));
    draw();
    const resize = () => {
      canvas.width = (window.innerWidth);
      canvas.height = (window.innerHeight);
      draw();
    }    

    
    let xOffset = 0;
    for (let block of allBlocks.allBlocks) {
      menuButtonList.push(new Button(new Point(10 + xOffset, 50), 80 , 80 , () => {
        if (block.type == "comment"){
          block.arguments = ["Comment"]
        }
        heldBlockBlock = new BlockBlock.BlockBlock([cloneBlock(block)]);
        blockBlockList.push(heldBlockBlock);
        mouseHeld = true;
        enableStopSave();
        //("TEST")
        if (block.name == "On Draw Button" || block.name  == "On Draw Mouse"){
          variableinit();
        }

      }, "TEST"))
      xOffset += 90;
    }

    resize()
    window.addEventListener('resize', resize)


    window.addEventListener('keydown', (e) => {

      if (document.activeElement.type == "text") return;

      if (e.code == "Space") {
        BlockBlock.BlockBlock.callsWithoutWait = 0
        runBoard(ctx);
      }
      if (e.ctrlKey){
        if (e.code == "KeyD") {
          debug = ! debug;
          e.preventDefault();
        }
      }
    }, false)


    function draw() {



      clearEmptyBlockBlocks();
      ctx.fillStyle = 'rgb(100, 100, 100)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);



      ctx.fillStyle = 'rgb(40, 40, 40)';
      ctx.fillRect(window.innerWidth - 250, 0, 250, window.innerHeight);

      ctx.scale(scale, scale);
      ctx.translate(xoff, yoff)

      drawChecker(ctx);
      drawBlocks(ctx);

      ctx.translate(-xoff, -yoff)
      ctx.scale(1/scale, 1/scale);

  
      ctx.fillStyle = 'rgb(40, 40, 40)';
      ctx.fillRect(window.innerWidth - 250, 0, 250, window.innerHeight);




      let yOffset = 60;
      for (let i = ConsoleManager.console.length - 1; i > 0; i--) {
        ctx.fillStyle = 'rgb(200, 200, 200)';

        let lineWidth = 0;
        let line = "";
        let linesBackwards = [];

        for (let word of ConsoleManager.console[i].split(" ")) {
            lineWidth += ctx.measureText(word + " ").width;
            if (lineWidth > 220) {
                lineWidth = 0;
                linesBackwards.push(line)
                line = "";
                yOffset += 20;
            }
            line += word + " "
        }
        linesBackwards.push(line)

        linesBackwards.reverse().forEach((line) => {
          ctx.fillText(line, window.innerWidth - 250 + 5, window.innerHeight - yOffset)
          yOffset += 20;
        })


        if (i < ConsoleManager.console.length - 50) {
          break;
        }
      }


      drawMenu(ctx);

            // Debug Buttons
      
      if (debug){

      }

      // SELECTION

      ctx.fillStyle = 'rgba(100, 100, 150, 0.5)'
      ctx.strokeStyle = 'rgba(100, 100, 180, 1)';
      ctx.lineWidth = 4;
      ctx.fillRect(startSelectionPoint.x, startSelectionPoint.y, newSelectionPoint.x, newSelectionPoint.y);
      ctx.strokeRect(startSelectionPoint.x, startSelectionPoint.y, newSelectionPoint.x, newSelectionPoint.y);
      ctx.lineWidth = 7;
      ctx.fillStyle = "rgba(50, 50, 50, 1)"; 
      ctx.strokeStyle = "rgba(50, 50, 50, 1)"
      
      drawMenuBar(ctx)

      if (contextActive) {
        drawContext(ctx, contextPoint.x, contextPoint.y, contextWidth, contextHeight);
      }

      if (debug) {
        drawDebug(ctx);
      }
      for (let textt of texts) {
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillText(textt.text, textt.position.x, textt.position.y)
      }
    }



    draw();
    document.getElementById('main').addEventListener('mousedown', (e) => {mouseDown(e)})
    document.getElementById('main').addEventListener('touchstart', (e) => {mouseDown(e)})

    function mouseDown(e){

      for (let button of menuButtonList) {
        if (new Point(e.clientX, e.clientY).inSquare(button.position, button.width, button.height) && !contextActive) {
          //(button);
          button.onClick();
          return;
        }
      }
      for (let button of menuBarButtonList) {
        if (new Point(e.clientX, e.clientY).inSquare(button.position, button.width, button.height)) {
          //(button);
          button.onClick();
          return;
        }
      }

      

      if (new Point(e.clientX, e.clientY).inSquare(contextPoint, contextWidth, contextHeight)) {
        for (let button of buttonList) {
          if (new Point(e.clientX , e.clientY).inSquare(button.position, button.width, button.height)) {
            button.onClick();
            return;
          }
        }

      }

      if (contextActive) {
        clearContext();
        return;
      }

      if (e.button == 1 ) {
        middleMouseHeld = true;

        startMMouseHeld = new Point(e.clientX / scale, e.clientY / scale);

        // xoff = e.clientX
        // yoff = e.clientY
        return;
      }
      if (e.button == 2) {
        middleMouseHeld = true;

        startMMouseHeld = new Point(e.clientX / scale, e.clientY / scale);
      }



      clearContext();
      e.preventDefault();
      if (e.button != 2){
        mouseHeld = true;
        startSelectionPoint = new Point(e.clientX , e.clientY);
        selectedBlockBlocks.splice(0, selectedBlockBlocks.length);
      }
      for (let blockBlock of blockBlockList) {
      
        // Check if its the WHOLE BOI
        if (blockBlock.blockList[0] != undefined)
        
        if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(blockBlock.blockList[0].position, 80 , 80 )) {
          heldBlockBlock = blockBlock;
        }

        // Otherwise break it up and create a new block
        for (let i = 0; i < blockBlock.blockList.length; i++) {
          let block = blockBlock.blockList[i];
          if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(block.position, 80 , 80 )) {
            let newBlockBlock = new BlockBlock.BlockBlock(new Array());
            for (let j = i; j < blockBlock.blockList.length; j++) {
              newBlockBlock.blockList.push(blockBlock.blockList[j]);
            }
            blockBlock.blockList.splice(i, blockBlock.blockList.length - i);
            blockBlockList.push(newBlockBlock);
            heldBlockBlock = newBlockBlock;
            return;
          }

        }
      }
      draw();



    }
    
    document.getElementById('main').addEventListener('mouseup', (e) => {mouseUp(e)})
    document.getElementById('main').addEventListener('touchend', (e) => {mouseUp(e)})
    
    function mouseUp (e){
      mouseHeld = false;
      middleMouseHeld = false;

      boardPos = new Point(xoff, yoff)

      if (e.button == 2) {
        if (!drag) {
        clearContext();
        contextActive = true;

        let isntWindow = true;


        for (let blockBlock of blockBlockList) {
          for (let block of blockBlock.blockList) {
            if (blockBlock.blockList.indexOf(block) != 0){
              //("BLOCK")
              //(buttonList)
              if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(block.position, 80 , 80 )) {
                contextHeight = 155;
                isntWindow = false;
                let button = new Button(new Point(e.clientX + 5, e.clientY + 5), 190, 45, () => setVariableName(block, e), "Set Variable Name");
                buttonList.push(button);
  
                let cloneName = (selectedBlockBlocks.length > 0) ? "Clone Selection" : "Clone Block"


                let button2 = new Button(new Point(e.clientX + 5, e.clientY + 105), 190, 45, () => {

                  if (selectedBlockBlocks.length > 0) {
                    let maxY = selectedBlockBlocks[0].blockList[0].position.y;
                    let minY = selectedBlockBlocks[0].blockList[0].position.y;
    
                    for (let blockB of selectedBlockBlocks) {
                      if (blockB.blockList[0].position.y > maxY) maxY = blockB.blockList[0].position.y;
                      if (blockB.blockList[0].position.y < minY) minY = blockB.blockList[0].position.y;
                    }
    
                    let o = maxY - minY;
    
                    for (let blockB of selectedBlockBlocks) {
                      let newnBlockBlock = new BlockBlock.BlockBlock(new Array());
    
                      for (let block of blockB.blockList) {
                        newnBlockBlock.blockList.push(cloneBlock(block));
                      }
    
                      newnBlockBlock.blockList[0].position.y += o;
                      newnBlockBlock.blockList[0].position.y += 90;
                      blockBlockList.push(newnBlockBlock);
                    }
                    selectedBlockBlocks.splice(0, selectedBlockBlocks.length)
                  } else {
                    let newBlock = cloneBlock(block);
                    newBlock.position.y = newBlock.position.y + 90;
                    blockBlockList.push(new BlockBlock.BlockBlock([newBlock]));
                    clearContext();
                  }
                }, cloneName);
                buttonList.push(button2);

                let deleteName = (selectedBlockBlocks.length > 0) ? "Delete Selection" : "Delete Block"

                let button3 = new Button(new Point(e.clientX + 5, e.clientY + 55), 190, 45, () => {
                  if (selectedBlockBlocks.length > 0) {
                    for (let blockB of selectedBlockBlocks) {
                      blockBlockList.splice(blockBlockList.indexOf(blockB), 1);
                    }
                    selectedBlockBlocks.splice(0, selectedBlockBlocks.length)
                    
                  } else {
                    blockBlock.blockList.splice(blockBlock.blockList.indexOf(block), 1);
                  }

                  orderBlocks();
                  clearContext();
                  variableinit();

                }, deleteName);
                buttonList.push(button3);
              }
            }
          }
        }

        for (let blockBlock of blockBlockList) {

          // If on block block as a whole
          if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(blockBlock.blockList[0].position, 80 , 80 )) {
            let offset = 0;
            clearContext();
            contextActive = true;
            //("BLOCK BLOCK")
            isntWindow = false;
            if (blockBlock.blockList[0].name == "Trigger" || blockBlock.blockList[0].type == "comment"){
              offset = 50;
              let button1 = new Button(new Point(e.clientX + 5, e.clientY + 5), 190, 45, () => {
                setVariableName(blockBlock.blockList[0], e)
              }, "Set Variable Name");
              buttonList.push(button1);
            }
            contextHeight = 155 + offset;


            let downloadName = (selectedBlockBlocks.length > 0) ? "Download Selection" : "Download Block Block"

            let button = new Button(new Point(e.clientX + 5, e.clientY + 5 + offset), 190, 45, () => {
              if (selectedBlockBlocks.length > 0) {
                download(blockBlock.blockList[0].name.toLowerCase().replaceAll(" ", "_") + ".is", convertToArray(selectedBlockBlocks))
                disableStopSave()
              } else {
                download(blockBlock.blockList[0].name.toLowerCase().replaceAll(" ", "_") + ".is", convertToArray([blockBlock]))
                disableStopSave()
              }

            }, downloadName);
            buttonList.push(button);

            let deleteName = (selectedBlockBlocks.length > 0) ? "Delete Selection" : "Delete Block Block"

            let button2 = new Button(new Point(e.clientX + 5, e.clientY + 55  + offset), 190, 45, () => {
              if (selectedBlockBlocks.length > 0) {
                for (let blockB of selectedBlockBlocks) {
                  blockBlockList.splice(blockBlockList.indexOf(blockB), 1);
                }
                selectedBlockBlocks.splice(0, selectedBlockBlocks.length)
              } else {
                blockBlockList.splice(blockBlockList.indexOf(blockBlock), 1);
              }

              clearContext();
              draw();
              variableinit();
            }, deleteName);
            buttonList.push(button2);
    
            let cloneName = (selectedBlockBlocks.length > 0) ? "Clone Selection" : "Clone Block Block"
            let button3 = new Button(new Point(e.clientX + 5, e.clientY + 105 + offset), 190, 45, () => {
              if (selectedBlockBlocks.length > 0) {
                let maxY = selectedBlockBlocks[0].blockList[0].position.y;
                let minY = selectedBlockBlocks[0].blockList[0].position.y;

                for (let blockB of selectedBlockBlocks) {
                  if (blockB.blockList[0].position.y > maxY) maxY = blockB.blockList[0].position.y;
                  if (blockB.blockList[0].position.y < minY) minY = blockB.blockList[0].position.y;
                }

                let o = maxY - minY;

                for (let blockB of selectedBlockBlocks) {
                  let newnBlockBlock = new BlockBlock.BlockBlock(new Array());

                  for (let block of blockB.blockList) {
                    newnBlockBlock.blockList.push(cloneBlock(block));
                  }

                  newnBlockBlock.blockList[0].position.y += o;
                  newnBlockBlock.blockList[0].position.y += 90;
                  blockBlockList.push(newnBlockBlock);
                }
                selectedBlockBlocks.splice(0, selectedBlockBlocks.length)
              } else {
                let newnBlockBlock = new BlockBlock.BlockBlock(new Array());

                for (let block of blockBlock.blockList) {
                  newnBlockBlock.blockList.push(cloneBlock(block));
                }
  
                newnBlockBlock.blockList[0].position.y += 90;
                blockBlockList.push(newnBlockBlock);
              }

              draw();
              orderBlocks();
              clearContext();

            }, cloneName);
            buttonList.push(button3);
          }
        }

        if (isntWindow) {
          contextHeight = 205;
          //("WINDOW CLICK")

          let button = new Button(new Point(e.clientX + 5, e.clientY + 5), 190, 45, () => {
            blockBlockList.splice(0, blockBlockList.length)
            clearContext();
            id = undefined;
            name = "Unnamed board"
            title.inputElement.value = name;
            window.history.replaceState({}, 'idiotscript', '/')
          }, "Clear Board");
          buttonList.push(button);
          button = new Button(new Point(e.clientX + 5, e.clientY + 55), 190, 45, () => {
            //(convertToArray(blockBlockList))
            download(name.replaceAll(" ", "_") + ".is", convertToArray(blockBlockList))
            disableStopSave()
          }, "Download Board");
          buttonList.push(button);
          button = new Button(new Point(e.clientX + 5, e.clientY + 105), 190, 45, () => {
            document.getElementById("varInput").click();
          }, "Load Board");
          buttonList.push(button);
          button = new Button(new Point(e.clientX + 5, e.clientY + 155), 190, 45,  () => {

            buttonList = new Array()
            contextHeight = 60;
            contextWidth = 80
    
            let input = new Input(`left: ${contextPoint.x + 5}px`, `top: ${contextPoint.y + 5}px`, 70, 50, () => {
              allBlocks.speed = parseInt(input.inputElement.value);
              speed = parseInt(input.inputElement.value); 
              clearContext();
            });
            input.inputElement.value = allBlocks.speed;
            input.inputElement.style.fontSize = 30;
            inputs.push(input);
    
          }, "Set Board Speed");
          buttonList.push(button);
        }

        contextActive = true;
        contextPoint = new Point(e.clientX , e.clientY);

        }
        console.log("WAS HERE")
        draw();
        return;
      }



      newSelectionPoint = new Point(-1, -1);
      startSelectionPoint = new Point(-1, -1);

      clearEmptyBlockBlocks();

      if (heldBlockBlock != undefined) {
        if (e.clientY < 120) {
          heldBlockBlock.blockList.splice(0, heldBlockBlock.blockList.length)
          heldBlockBlock = undefined;
          return;
        }

        for (let blockBlock of blockBlockList) {
          let pos = blockBlock.blockList[blockBlock.blockList.length -1].position;
          if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(new Point(pos.x + 80 , pos.y), 80 , 80 )) {
            for (let block of heldBlockBlock.blockList) {
              block.position._y = blockBlock.blockList[0].position.y;
              blockBlock.blockList.push(block);
            }

            blockBlockList.splice(blockBlockList.indexOf(heldBlockBlock), 1);

          }
        }
      }
      orderBlocks();
      heldBlockBlock = undefined;


 
    }
    
    
    document.getElementById('main').addEventListener('mousemove', (e) => {mouseMove(e)})
    document.getElementById('main').addEventListener('touchmove', (e) => {mouseMove(e)})

    function mouseMove (e){

      let hovering = false;
      for (let blockBlock of blockBlockList) {
        for (let block of blockBlock.blockList) {
          if (new Point((e.clientX / scale) - xoff , (e.clientY / scale) - yoff ).inSquare(block.position, 80 , 80 )) {
            hovering = true;
          }
        }
      }
      if (hovering) {
        document.getElementById("main").style.cursor = "pointer";
      } else {
        document.getElementById("main").style.cursor = ""
      }

      if (middleMouseHeld || drag) {
        xoff = -(startMMouseHeld.x - (e.clientX / scale)) + boardPos.x;
        yoff = -(startMMouseHeld.y - (e.clientY / scale)) + boardPos.y;
      }

      // getColorAt(ctx, e.clientX - 40, e.clientY - 40)
      if (mouseHeld) {
        let xOffset = 0;
        if (heldBlockBlock != undefined){
          for (let block of heldBlockBlock.blockList) {
            block.position = new Point(((e.clientX / scale - 40) -xoff) + xOffset, (e.clientY / scale - 40) -yoff);
            xOffset += 80;
          }
        }
        orderBlocks();
      }

      clearEmptyBlockBlocks();

      draw();
      if (mouseHeld && heldBlockBlock == undefined) {
        newSelectionPoint = new Point(e.clientX - startSelectionPoint.x, e.clientY - startSelectionPoint.y);

        for (let blockBlock of blockBlockList) {
          if (blockBlock.blockList[0].position.inSquare(adjustPoint(startSelectionPoint), newSelectionPoint.x / scale, newSelectionPoint.y / scale)) {
            if (!selectedBlockBlocks.includes(blockBlock)) {
              selectedBlockBlocks.push(blockBlock)
            }
          }
        }
      }

    }
    clearEmptyBlockBlocks();
    document.body.addEventListener("reloadMenuButtons", () => {
      menuButtonList.splice(0, menuButtonList.length);
      let xOffset = 0;
      for (let block of allBlocks.allBlocks) {
        menuButtonList.push(new Button(new Point(10 + xOffset, 50), 80 , 80 , () => {
          if (block.type == "comment"){
            block.arguments = ["Comment"]
          }
          heldBlockBlock = new BlockBlock.BlockBlock([cloneBlock(block)]);
          blockBlockList.push(heldBlockBlock);
          mouseHeld = true;
          enableStopSave();
          //("TEST")
          if (block.name == "On Draw Button" || block.name  == "On Draw Mouse"){
            variableinit();
          }
    
        }, "TEST"))
        xOffset += 90;
      }
    })


    setInterval(draw, 16);

}

function orderBlocks () {
  let off = 0;
  for (let blockBlock of blockBlockList) {
    for (let i = 0; i < blockBlock.blockList.length; i++) {
      let block = blockBlock.blockList[i];
      if (i > 0) {
        if (i > 0 && blockBlock.blockList[i - 1].type == "comment"){
          block.position.x = blockBlock.blockList[0].position.x + (i * 80) + ((blockBlock.blockList[i - 1].arguments[0].length * 3));
          off += ((blockBlock.blockList[i - 1].arguments[0].length * 3))
        } else {
          block.position.x = blockBlock.blockList[0].position.x + (i * 80) + off;
        }
        block.position.y = blockBlock.blockList[0].position.y;

      }
    }
  }
}

function clearEmptyBlockBlocks() {
  for (let i = 0; i < blockBlockList.length; i++) {
    let blockBlock = blockBlockList[i];
    if (blockBlock.blockList.length == 0) {
      blockBlockList.splice(i, 1);
    }
  }
}

function drawMenuBar(ctx) {
  ctx.fillStyle = "rgb(60, 60, 60)"
  ctx.fillRect(0, 0, window.innerWidth , 40)
  ctx.fillStyle = "rgb(220, 220, 220)"
  ctx.fillText("File", 10, 25)
  // ctx.fillText("Edit", 60, 25)
  ctx.fillText("Board", 110 - 50, 25)
  ctx.fillText("Run", 180 - 50, 25)
  ctx.fillText("Settings", 230 - 50, 25)
  ctx.fillText("Shared", 260, 25)
  ctx.fillText("Mods", 330, 25)
  ctx.fillText((!cred.username) ?"Account" : cred.username, window.innerWidth - 80, 25)
}

function drawDebug(ctx) {

  for (let button of menuButtonList) {
    ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.fillRect(button.position.x, button.position.y, 80 , 80 );
  }
  for (let button of buttonList) {
    ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.fillRect(button.position.x, button.position.y, button.width, button.height);
  }
  for (let button of menuBarButtonList) {
    ctx.fillStyle = 'rgba(200, 200, 0, 0.5)';
    ctx.fillRect(button.position.x, button.position.y, button.width, button.height);
  }
  

  ctx.fillStyle = "rgb(220, 220, 220)"
  ctx.fillRect(0, 140, 200, window.innerHeight)
  ctx.fillStyle = "rgb(20, 20, 20)"

  let y = 150;

  for (let item of Object.keys(VariableManager.variableList)) {
    // if ( VariableManager.variableList[item])
    let testVal = VariableManager.variableList[item];
    let value = testVal;

    if (Array.isArray(testVal) || typeof testVal == 'object') {
      value = JSON.stringify(testVal).replaceAll('"', "").replaceAll(",", ", ")
    }


    ctx.fillText(""+item+" > " + value +"", 30, 10 + y);
    y+= 20;

  }
  y += 50;
  // for (let item of Object.keys(VariableManager.arrays)) {
  //   ctx.fillText(""+item+": [" + VariableManager.arrays[item] +"]", 30, 10 + y);
  //   y+= 20;
  // }

}

function setVariableName (block, e) {
  clearContext();
  contextActive = true;
  contextHeight = block.numArgs.length * 40 + 60;

  let varInputs = []

  let off = 10;
  for (let i = 0; i < block.numArgs.length; i++) {
    let prim = block.numArgs[i]
    let varInput;
    if (!prim) {
      varInput = new Input("left:" + (e.clientX + 10), "top:" + (e.clientY + off), 0, 0, () => {}, variableListWithoutRun)
    } else {
      varInput = new Input("left:" + (e.clientX + 10), "top:" + (e.clientY + off), 0, 0, () => {})
    }



    varInput.inputElement.style.cssText += `font-family: Nunito; position: absolute; background-color: rgb(60, 60, 60); border-radius: 50px; text-decoration: none; width: 180px; height: 25px; border: none; outline: none; color: rgb(150, 150, 150);`

    if (block.arguments[i] == undefined) {
      varInput.inputElement.value = ""
    } else {
      varInput.inputElement.value = block.arguments[i]
    }
    varInputs.push(varInput);
    inputs.push(varInput)
    off += 40
  }
  off += 10

  buttonList.push(new Button(new Point(e.clientX + 5, e.clientY + off), 180 / 2, 25, () => {
    let args = []
    for (let i = 0; i < block.numArgs.length; i++) {
      args.push(varInputs[i].inputElement.value)
    }
    block.arguments = args;

    variableinit();

    clearContext();
  }, "Set"))
  buttonList.push(new Button(new Point(e.clientX + 5 + (190 / 2), e.clientY + off), 190 / 2, 25, () => {
    clearContext();
  }, "Cancel"))

}

function drawChecker(ctx) {
  if (checker){
    ctx.fillStyle = "rgb(90, 90, 90)"

    for (let i = Math.floor(-(((window.innerWidth / scale + xoff) / 140))); i < (((window.innerWidth / scale - xoff) / 140)); i++) {
      for (let j = Math.floor(-(((window.innerHeight / scale + yoff) / 140))); j < (((window.innerHeight / scale - yoff) / 140)); j++) {
        if ((i + j)% 2 == 0) {
            ctx.fillRect((i * 140), (j * 140), 140, 140)
        }
      }
    }
  }
}

function drawBlocks(ctx) {



  for (let blockBlock of blockBlockList) {
    ctx.strokeStyle = "rgba(50, 50, 50, 1)"
    ctx.fillStyle = "rgba(50, 50, 50, 1)"; 

    let off = 0;
    // for (let block of blockBlock.blockList) {
    //   if (block.type == "comment") {
    //     off += (block.arguments[0].length * 3);
    //   }
    // }


    roundRect(ctx, blockBlock.blockList[0].position.x, blockBlock.blockList[0].position.y, (80 * blockBlock.blockList.length) + off, 80 , 15, true, true)

    for (let block of blockBlock.blockList){
      if ((block.position.x + xoff) * scale < -90 * scale) continue;
      if ((block.position.y + yoff) * scale < 150 - (90 * scale)) continue;
      if ((block.position.x + xoff) * scale > window.innerWidth - 260) continue;
      if ((block.position.y + yoff) * scale > window.innerHeight) continue;


      ctx.strokeStyle = "rgba(50, 50, 50, 1)"
      if (block.active) {
        ctx.strokeStyle = "rgba(200, 200, 200, 1)"
      }

      ctx.lineWidth = 7;

      setColorFromType(block, ctx);
      if (block.type != "comment"){
        roundRect(ctx, block.position.x, block.position.y, 80 , 80 , 15, true, true)
      } else {
        roundRect(ctx, block.position.x, block.position.y, (block.arguments[0].length * 3) + 80, 80 , 15, true, true)
      }


      let data = {r: 0, g: 0, b: 0}
      ctx.fillStyle = `rgb(${255 - data.r}, ${255 - data.g}, ${255 - data.b}`;
      ctx.font = "bold 16px Nunito";

      let yOffset = 0;

      let wrapped = wordWrap(ctx, block.name, 60);

      if (block.type == "comment") {
        wrapped = wordWrap(ctx, block.arguments[0] + "", (block.arguments[0].length * 3) + 60);
      }

      for (let str of wrapped) {
        ctx.fillStyle = `rgb(${255}, ${255}, ${255}`;
        ctx.font = "bold 16px Nunito";
  

        if (block.type != "comment"){
          drawStroked(str, block.position.x + 5, block.position.y + 25 + yOffset, ctx);          
        } else {
          drawStroked(str, block.position.x + 5, block.position.y + 25 + yOffset, ctx);
        }
        // ctx.fillText(str, block.position.x + 5, block.position.y + 25 + yOffset);
        yOffset += 20;
      }
      if (block.numArgs.length > 0 && block.type != "comment") {
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillText("[" + block.arguments + "]", block.position.x + 5, block.position.y + 25 + yOffset);
      }
      ctx.strokeStyle = "rgba(50, 50, 50, 1)"

      if (debug) {
        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)'
        ctx.fillRect(block.position.x, block.position.y, 80, 80)
      }

      if (selectedBlockBlocks.includes(blockBlock)) {
        ctx.fillStyle = "rgba(0, 0, 200, 0.4)"
        ctx.strokeStyle = "rgba(50, 50, 200, 0.4)"
        roundRect(ctx, block.position.x, block.position.y, 80 , 80 , 15, true, true)
        ctx.strokeStyle = "rgba(50, 50, 50, 1)"
      }
    }
  }
}


function drawMenu(ctx) {
  
  ctx.fillStyle = 'rgb(50, 50, 50)';
  ctx.fillRect(0, 40, window.innerWidth, 100);
  let xOffset = 0;
  for (let block of allBlocks.allBlocks) {
    // ctx.strokeStyle = "rgba(200, 200, 200, 0)"
    setColorFromType(block, ctx);
    roundRect(ctx, 10 + xOffset + menux, 50, 80 , 80 , 15, true, true)
    let yOffset = 30;
    for (let str of wordWrap(ctx, block.name, 60)) {
      // let data = getColorAt(ctx, block.position.x + 40, block.position.y + 40);
      ctx.fillStyle = `rgb(${255}, ${255}, ${255}`;
      ctx.font = "bold 16px Nunito";

      drawStroked(str, 10 + xOffset + 5 + menux, 10 + yOffset + 40, ctx);
      // ctx.strokeText(str, 10 + xOffset + 5, 10 + yOffset);
      yOffset += 20;
    }
    xOffset += 90;
  }


}

function drawStroked(text, x, y, ctx) {
  ctx.strokeStyle = "rgba(50, 50, 50, 1)"
  ctx.lineWidth = 4;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);
  ctx.lineWidth = 7;
}

function setColorFromType (block, ctx) {
  switch (block.type) {
    case "debug":
      ctx.fillStyle = `rgb(200, 0, 0)`;
      break;
    case "event":
      ctx.fillStyle = `rgb(48, 209, 48)`;
      break;
    case "var":
      ctx.fillStyle = `rgb(210, 60, 60)`;
      break;
    case "trigger":
      ctx.fillStyle = `rgb(20, 120, 200)`;
      break;
    case "draw":
      ctx.fillStyle = `rgb(255, 225, 53)`
      break;
    case "operation":
      ctx.fillStyle = `rgb(134, 41, 227)`
      break;
    default:
      ctx.fillStyle = `rgb(200, 200, 200)`;
      break;
  }
}

function wordWrap(ctx, text, maxWidth) {
  let strarr = [];
  let stringBuilder = "";
  for (let i = 0; i < text.length; i++) {
    let width = ctx.measureText(stringBuilder + text[i]).width;
    if (width < maxWidth) {
      stringBuilder += text[i];
    } else {
      stringBuilder += text[i];
      strarr.push(stringBuilder);
      stringBuilder = "";
    }
  }
  strarr.push(stringBuilder);
  return strarr;
}

document.getElementById("main").addEventListener('wheel', function(e) {
  
  if (e.clientY > 140 || e.clientY < 40) {
    if (e.clientY > 40) {
      let scaledY = e.deltaY * scale;
      scale += scaledY / 1000;

      if (lowerScrollLimit < 0.1) {
        lowerScrollLimit = 0.1
      }
      if (scale < lowerScrollLimit) {
        scale = lowerScrollLimit
      }
      if (scale > upperScrollLimit){
        scale = upperScrollLimit
      }
    }
  } else {
    if ((menuButtonList[menuButtonList.length - 1].position.x - e.deltaY / 4 < window.innerWidth - 140)) {
      return;
    }
    if ((menuButtonList[0].position.x - e.deltaY / 4 > 10)) {
      let off = 10;
      for (let button of menuButtonList) {
        button.position.x = off
        off += 90
      }
      menux = 0
      return;
    }
    for (let button of menuButtonList) {
      button.position.x -= e.deltaY / 4
    }
    menux -= e.deltaY / 4

  }
})

function drawContext(ctx, x, y, width, height) {
  let radius = 10;

  ctx.fillStyle = `rgb(80 , 80 , 80 )`;
  roundRect(ctx, x, y, width, height, radius, true, false)


  for (let button of buttonList) {
    if (!button.draw) continue;
    ctx.fillStyle = `rgb(60, 60, 60)`;
    roundRect(ctx, button.position.x, button.position.y, button.width, button.height, radius, true, false)
    ctx.fillStyle = `rgb(150, 150, 150)`;
    ctx.font = "bold 16px Nunito";

    let yOffset = 0;

    for (let str of wordWrap(ctx, button.text, button.width)) {
      ctx.fillText(str, button.position.x + 5, button.position.y + ((button.height / 2) + 4) + yOffset);
      yOffset += 20;
    }
  }
}

function cloneBlock(block) {
  let cloned = new Block.Block(block.action, block.type, new Point(block.position.x, block.position.y), block.name, block.numArgs, false);
  cloned.arguments = [...block.arguments]
  return cloned;
}


// Thanks Juan! https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas 

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
 function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
}

function adjustPoint(point) {
  return new Point((point.x / scale) -xoff, (point .y / scale) -yoff)
}

function runBoard(ctx) {
        
  let running = false;

  for (let blockBlock of blockBlockList) {
    for (let i = 0; i < blockBlock.blockList.length; i++) {
      let block = blockBlock.blockList[i]
      if (block.active) {
        running = true;
      }
    }
  }
  if (running) {
    // console.log("HALT IT")
    for (let blockBlock of blockBlockList) {
      for (let i = 0; i < blockBlock.blockList.length; i++) {
        let block = blockBlock.blockList[i]
        // block.halt = true;
        if (block.active && i < blockBlock.blockList.length - 1) {
          running = false;
          blockBlock.blockList[i + 1].active = false
          blockBlock.blockList[i + 1].halt = true;
        }
      }
    }

    setTimeout(()=> {
      for (let blockBlock of blockBlockList) {
        for (let i = 0; i < blockBlock.blockList.length; i++) {
          let block = blockBlock.blockList[i]
          block.active = false;
        }
      }
    }, allBlocks.speed + 50)

  } else {
    VariableManager.variableList = {};
    // VariableManager.arrays = {};

    for (let blockBlock of blockBlockList) {
      for (let i = 0; i < blockBlock.blockList.length; i++) {
        let block = blockBlock.blockList[i]
        block.halt = false;
      }
    }

    for (let blockBlock of blockBlockList) {
      for (let i = 0; i < blockBlock.blockList.length; i++) {
        let block = blockBlock.blockList[i]
        if (block.name == "Start") {
          blockBlock.runBlock(i, ctx, speed);
        }
      }
    }

  }
}


function arrayToString(arr) {
  let news = "";
  for (let line of arr) {
    news += line + "\n"
  }
  return news;
}

function variableinit() {
  variableListWithoutRun.splice(0, variableListWithoutRun.length)
  for (let blockBlock of blockBlockList) {
    for (let blockiter of blockBlock.blockList) {
      switch (blockiter.name) {
        case "Create   Var": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Clone Var": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Input Var": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Create Map": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Create Array": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Length Of Array": 
          if (!variableListWithoutRun.includes(blockiter.arguments[1]))
          variableListWithoutRun.push(blockiter.arguments[1])
          break;
        case "Set Rand": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Set Now": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Input Var": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
        case "Get Map Var": 
          if (!variableListWithoutRun.includes(blockiter.arguments[2]))
          variableListWithoutRun.push(blockiter.arguments[2])
          break;
        case "Get Index Of": 
          if (!variableListWithoutRun.includes(blockiter.arguments[2]))
          variableListWithoutRun.push(blockiter.arguments[2])
          break;
        case "String to array": 
          if (!variableListWithoutRun.includes(blockiter.arguments[1]))
          variableListWithoutRun.push(blockiter.arguments[1])
          break;
        case "On Draw Mouse": 
          if (!variableListWithoutRun.includes("e") && !variableListWithoutRun.includes("mouseX") && !variableListWithoutRun.includes("mouseY"))
          variableListWithoutRun.push("e")
          variableListWithoutRun.push("mouseX")
          variableListWithoutRun.push("mouseY")
          console.log(variableListWithoutRun)
          break;
        case "On Draw Button": 
          if (!variableListWithoutRun.includes("e"))
          variableListWithoutRun.push("e")
          break;
        case "Mod Vars": 
          if (!variableListWithoutRun.includes(blockiter.arguments[0]))
          variableListWithoutRun.push(blockiter.arguments[0])
          break;
      }
    }
  }
}

document.body.addEventListener("onSignUp", (e) => {
  document.getElementById("signinbutton").innerText = "Logout"
  cred = e.detail;
}, false)

function clearContext () {
  buttonList = new Array();
  contextWidth = 200;
  contextActive = false;
  for (let i = 0; i < document.getElementById("varInputs").children.length; i++) {
    document.getElementById("varInputs").children[i].value = ""
    document.getElementById("varInputs").children[i].style.top = -100
    document.getElementById("varInputs").children[i].style.left = -100
  }
  document.getElementById("main").focus();

  for (let input of inputs) {
    input.remove();
  }
  inputs.splice(0, inputs.length)
  texts.splice(0, texts.length)
}

document.getElementById("varInput").addEventListener('change', function() {
  loadFile(this.files[0]);
})

document.body.addEventListener('drop', (e) => {
  e.preventDefault()
  if (e.dataTransfer.items) {
    let file = e.dataTransfer.items[0].getAsFile();
    loadFile(file);
  }
})

function loadFile(file) {
  variableinit();
  var fileReader = new FileReader();
  fileReader.onload = function() {
        // blockBlockList.splice(0, blockBlockList.length)
    let gsfgfsd = arrayToBlockList(fileReader.result);
    for (let blockBock of gsfgfsd){
      blockBlockList.push(blockBock);
    }

    variableinit();
    orderBlocks();
  }
  fileReader.readAsText(file);
}

document.body.addEventListener('dragover', (e) => {
  e.preventDefault();
})

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}