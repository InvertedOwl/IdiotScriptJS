window.addEventListener('load', function () {
// Mod loading
let mods = localStorage.getItem("mods");
mods = JSON.parse(mods);
if (mods == null) {
    localStorage.setItem("mods", JSON.stringify({modlist: []}))
    mods = localStorage.getItem("mods");
    mods = JSON.parse(mods);
}
let modList = mods.modlist;
for (let mod of modList) {
  let modDiv = document.createElement("div");
  modDiv.id = mod.name;
  let modContent = document.createElement("script");
  modContent.setAttribute("defer", "");
  modContent.type = "module"
  console.log("Loaded mod " + mod.name)
  modContent.innerHTML = mod.content;
  modDiv.appendChild(modContent);
  document.getElementById("mods-cont").appendChild(modDiv);

  

}
setTimeout(() => {
    document.body.dispatchEvent(new Event("init")) 

}, 50)
})



