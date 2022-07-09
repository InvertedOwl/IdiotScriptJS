document.body.addEventListener('modsClick', (e) => {
    // Add example mod
    let mods1 = localStorage.getItem("mods");
    mods1 = JSON.parse(mods1);
    let rand = Math.floor((Math.random() * 200));
    mods1.modlist.push({"name":"Example Mod " + rand, "description": "An example of an idiotscript mod", "content": `
allBlocks.allBlocks.push(new Block.Block((block, ctx, speed) => {}, "event", new Point(130, 50), "TEST FROM MOD", []))
    `})
    localStorage.setItem("mods", JSON.stringify(mods1))


    document.getElementById("modlist").style.display = "block";  
    document.getElementById("overlay").style.display = "block"

    let mods = localStorage.getItem("mods");
    mods = JSON.parse(mods);
    if (mods == null) {
        localStorage.setItem("mods", JSON.stringify({modlist: []}))
        mods = localStorage.getItem("mods");
        mods = JSON.parse(mods);
    }
    let modList = mods.modlist;
    document.getElementById("mods").innerHTML = ""
    console.log(modList);
    for (let mod of modList) {
        let modElement = createModElement(mod.name, mod.description);
        document.getElementById("mods").appendChild(modElement); 
    }
})

function createModElement(name, desc) {
    let mainDiv = document.createElement("div");
    let nameSpan = document.createElement("span");
    nameSpan.innerText = name;
    nameSpan.style.color = "white";
    let descP = document.createElement("p");
    descP.innerText = desc
    descP.classList.add("ids")
    let removeButton = document.createElement("button");
    removeButton.style.display = "inline-block";
    removeButton.style.width = "50px";
    removeButton.style.height = "50px";
    removeButton.style.backgroundColor = "red";
    removeButton.style.borderRadius = "20px";
    removeButton.innerText = "X"
    removeButton.style.fontSize = "40px"
    removeButton.style.fontWeight = "700"
    removeButton.style.position = "relative"
    removeButton.style.bottom = "60px";
    removeButton.style.left = "440px";
    removeButton.addEventListener("click", (e) => {
        let mods = localStorage.getItem("mods");
        mods = JSON.parse(mods);
        let modList = mods.modlist;
        for (let mod of modList) {
            if (mod.name == name && mod.description == desc) {
                modList.splice(modList.indexOf(mod), 1);
            } 
        }
        localStorage.setItem("mods", JSON.stringify(mods))
        mainDiv.remove();
    })

    mainDiv.appendChild(nameSpan);
    mainDiv.appendChild(descP);
    mainDiv.appendChild(removeButton);
    return mainDiv;
}