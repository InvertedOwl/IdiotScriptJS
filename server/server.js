// Main is 86
// idiotscript is 87

const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs')
const crypto = require("crypto");
// const puppeteer = require('puppeteer');
const { allowedNodeEnvironmentFlags } = require("process");
const { default: rateLimit } = require("express-rate-limit");
const { default: fetch } = require('node-fetch')
const apiDest = "https://brohouse.dev"

let limiter = rateLimit({
    windowMs: 30 * 60000, // 30 minutes
    max: 30,
    message: "Please wait before using this request again.",
	standardHeaders: true,
	legacyHeaders: false,
})

app.use("/api/board/", limiter)

app.use(express.static(__dirname + '/IdiotScriptJSPort'));
app.use(bodyParser.text());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/IdiotScriptJSPort/index.html');
})

app.get('/api/board/:username', (req, res) => {
    var allShared = JSON.parse(fs.readFileSync(__dirname + "/../database/shared.json").toString());
    let boardList = [];

    for (let id of Object.keys(allShared)) {
        board = allShared[id];
        if (!board.username) continue;
        if (board.unlisted) continue;
        if (board.username.toLowerCase() == req.params.username.toLowerCase()) {
            boardList.push({
                body: board.body,
                id: id,
                user: board.username,
                name: board.name
            });
        }
    }
    if (boardList.length == 0) {
        res.status("404").send("Found no boards with owner " + req.params.username);
    }
    else {
        res.status(200).send(boardList);
    }
})

// app.get('/api/preview/board/:id', (req, res) => {
//     (async () => {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         await page.goto("https://brohouse.dev/idiotscript/?id=" + req.params.id);
//         await page.setViewport({width: 1920, height: 1080, deviceScaleFactor:0.5})
//         await page.waitForTimeout(50)
//         await page.screenshot({
//             path: __dirname + "/preview.png",
//             clip: {
//                 x: 0,
//                 y: 140,
//                 width: 1920-300,
//                 height: 1080-200
//             }
//         });
//         res.status(200).sendFile(__dirname + "/preview.png");
//         await browser.close();
//       })();

// })

app.get('/api/boards', (req, res) => {
    var allShared = JSON.parse(fs.readFileSync(__dirname + "/../database/shared.json").toString());
    let boards = {}
    let sharedList = Object.keys(allShared);

    for (let i = 0; i < sharedList.length; i++) {
        let sh = sharedList[i]
        if (allShared[sh].unlisted) {
            sharedList.splice(i, 1)
        }
    }

    if (req.headers.order && req.headers.limit && req.headers.offset) {
        let limit = req.headers.limit;
        let offset = req.headers.offset;
        if (req.headers.order == "new") {
            sharedList.reverse()
        }

        sharedList.splice(0, parseInt(offset));
        if (limit <= sharedList.length)
        sharedList.splice(limit, sharedList.length-limit)
        let boards = {}
        for (let boardData of sharedList) {
            boards[boardData] = {
                username: allShared[boardData].username,
                name: allShared[boardData].name
            }
        }
        res.status(200).send(boards);
    }
})

// Courtesy of stack overflow https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
function arrayRotate(arr, reverse) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  }

app.get('/api/board', (req, res) => {
    
    if (req.headers.id != undefined) {
        var allShared = JSON.parse(fs.readFileSync(__dirname + "/../database/shared.json").toString());
        res.status(200).send({
            body: allShared[req.headers.id].body,
            user: allShared[req.headers.id].username,
            name: allShared[req.headers.id].name
        });
    } else {
        res.status(404).send();
    }
})

app.post('/api/board', async (req, res) => {
    if (authenticateUser(req.headers.authentication)) {
        var allShared = JSON.parse(fs.readFileSync(__dirname + "/../database/shared.json").toString());
        if (req.headers.id) {
            if (allShared[req.headers.id].username == await getUsername(req.headers.authentication)) {
                allShared[req.headers.id].body = req.body
                if (req.headers.name) {
                    allShared[req.headers.id].name = req.headers.name
                }
                if (req.headers.unlisted) {
                    allShared[req.headers.id].unlisted = (req.headers.unlisted == "true")
                }
                fs.writeFileSync(__dirname + "/../database/shared.json", JSON.stringify(allShared));
                res.status(200).send();
            }
        } else {
            let newID = randChar(12)

            let username = await getUsername(req.headers.authentication);
            console.log(username)
            allShared[newID] = {
                body: req.body,
                username: username
            };
            if (req.headers.name) {
                allShared[newID].name = req.headers.name
            }
            if (req.headers.unlisted) {
                allShared[newID].unlisted = (req.headers.unlisted == "true")
            }
            fs.writeFileSync(__dirname + "/../database/shared.json", JSON.stringify(allShared));
        
            res.header("id", newID);
            res.status(200).send();
        }


    } else {
        res.status(403).send("Invalid token");
    }

})

app.post('/api/auth', async (req, res) => {
    console.log(req.body)
    const response = await fetch(apiDest + "/api/auth", {  
        method: 'POST',
        body: req.body
    })
    const data = await response.text();
    res.status(response.status).send(data);
})

app.delete('/api/board', async (req, res) => {
    if (authenticateUser(req.headers.authentication)) {
        var allShared = JSON.parse(fs.readFileSync(__dirname + "/../database/shared.json").toString());
        if (req.headers.id) {
            if (allShared[req.headers.id].username == await getUsername(req.headers.authentication)) {
                delete allShared[req.headers.id]
                fs.writeFileSync(__dirname + "/../database/shared.json", JSON.stringify(allShared));
                res.status(200).send();
            } else {
                res.status(403).send("Insufficient Permission");
            }
        } else {
            res.status(400).send();
        }


    } else {
        res.status(403).send("Invalid token");
    }

})

async function getUsername (token) {
    const response = await fetch(apiDest + "/api/user", {  
        method: 'post',
        body: JSON.stringify({"authtoken": token}),
    })
    data = await response.json();
    return data.username;
}

async function authenticateUser (token) {
    const res = await fetch(apiDest + "/api/auth/token", {method: "POST", body: JSON.stringify({
        "authtoken" : token
    })})

    if (res.status > 299) {
        return false;
    } else if (res.status < 299 && res.status > 199) {
        return true;
    } else {
        return false;
    }
}

function randChar(length) {
    let built = "";
    for (let i = 0; i < length; i++) {
        let char = (Math.random() * 25) + 97
        built += String.fromCharCode(char);
    }
    return built;
}

app.get('/docs', (req, res) => {
    res.sendFile(__dirname + '/IdiotScriptJSPort/isjsdocs/index.html');
})

app.get('/chat', (req, res) => {
    res.status(301).redirect('https://brohouse.dev/chat')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})