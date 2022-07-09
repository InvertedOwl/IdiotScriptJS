function forgotMyPassword () {
    document.getElementById("signin").style.display = "none"
    document.getElementById("signupin").style.width = 400;
    document.getElementById("forgotpass").style.display = "block"
}

function sendEmail() {
    fetch("/api/resetpass", {  
        method: 'post',
        body: JSON.stringify({
            "email": document.getElementById("emailreset").value
        }),
      })
      document.getElementById("overlay").click();
}