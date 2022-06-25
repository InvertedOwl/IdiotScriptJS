const boardContainer = document.getElementById("boardcontainer")

document.body.addEventListener('sharedClicked', (e) => {
    document.getElementById("overlay").style.display = "block"
    document.getElementById("shared").style.display = "block"
    boardContainer.innerHTML = ""
    fetch('/api/boards', {headers: {"order" : "new", "limit" : "50", "offset" : "0"}}).then((res) => {res.json().then((data) => {
        let boards = Object.keys(data)
        for (let board of boards) {
            let div = document.createElement("div");
            let a = document.createElement("a");
            a.href = "/?id=" + board;
            let title = (data[board].name) ? data[board].name : "Unnamed board";
            a.innerText = title + " - " + data[board].username;
            a.style.textDecoration = "none"
            a.style.color = "white"
            div.appendChild(a);
            let p = document.createElement("p");
            p.innerText = board
            p.classList.add("ids")
            div.appendChild(p)

            boardContainer.appendChild(div);
        }
    })})
})

boardContainer.addEventListener("scroll", (e) => {
    console.log(boardContainer.scrollTop)
})