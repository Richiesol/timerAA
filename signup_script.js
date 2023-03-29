const nickname = document.getElementById("nickname");
const workspace = document.getElementById('workspace')
const emailId = document.getElementById("email");
const password = document.getElementById("password");
const signupButton = document.getElementById("signupbutton");

var userData = {};
var nickName;
var emailID;
var Password;
var workSpace;
var existingData;

fetch('http://localhost:8000/users.json')
    .then((response) => response.json())
    .then((json) => existingData = json);

nickname.addEventListener("change", function () {
console.log(existingData)
  nickName = nickname.value;
});
workspace.onchange = function(){
  workSpace = workspace.value;
}
emailId.addEventListener("change", function () {
    if(emailId.value in existingData){
        alert("Email Id already exists! Please log in");
        emailId.value = "";
        signupButton.disabled ="disabled";
    }
    else{
        signupButton.removeAttribute("disabled")
    }
  emailID = emailId.value;
});
password.addEventListener("change", function () {
  Password = password.value;
});


/**
 *function to sanve the data into an object called User data and send on submit of the form
 *
 * @param {*} event
 */
function submit_(event) {
  userData = {
    nickname: nickName,
    workspace: workSpace,
    email: emailId.value,
    password: Password,
  };
  console.log(emailID);
  connectServer(userData);
}

/**
 *function to save the data to the server and wait for the response
 *
 * @param {*} userData: contains the user data
 */
async function connectServer(userData) {
  console.log(userData)
  let response = await fetch("http://localhost:8000/datasend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(userData), 
  });
    userData = await response.json();
}
