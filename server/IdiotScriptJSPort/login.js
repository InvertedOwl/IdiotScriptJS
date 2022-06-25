const login = {
    "username" : undefined,
    "password" : undefined
};


document.body.addEventListener('accountClick', (e) => {
    // if (!login.username && !login.password) {
        document.getElementById("signupin").style.display = "block"
        document.getElementById("overlay").style.display = "block"
    // }
}, false)

function onSignUp() {
    let link = document.createElement("a");
    link.target = "_blank"
    link.href = "/chat"
    link.click();
}

function onSignIn() {
    login.username = document.getElementById("signin_username").value;
    login.password = document.getElementById("signin_password").value;
    fetch("/api/auth", {  
        method: 'post',
        body: JSON.stringify(login),
      }).then(function(res){
        if (res.status == 200) {
            document.getElementById("signupin").style.display = "none"
            document.getElementById("overlay").style.display = "none"
            res.json().then((data) => {
                const signUpEvent = new CustomEvent('onSignUp', {
                    detail: {
                        "username" : login.username,
                        "password" : login.password,
                        "authtoken" : data.authtoken      
                    }
            
                });
                document.body.dispatchEvent(signUpEvent)
            }) 
        }
    })
}

document.getElementById("overlay").addEventListener('click', (e) => {
    document.getElementById("shared").style.display = "none"
    document.getElementById("signupin").style.display = "none"
    document.getElementById("overlay").style.display = "none"
})