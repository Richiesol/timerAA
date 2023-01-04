const emailId = document.getElementById("email");
const password = document.getElementById("password");
const signinButton = document.getElementById("login");

var form = document.getElementById("myForm");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);
var emailID;
var Password;
var existingData;

fetch("http://localhost:8000/users.json")
  .then((response) => response.json())
  .then((json) => (existingData = json));

emailId.addEventListener("change", function () {
  emailID = emailId.value;
  if(!(emailID in existingData)){
    alert("Email id not found");
    emailId.value="";
    signinButton.disabled = "disabled"
  }
  else{
    signinButton.removeAttribute("disabled")
  }
});
password.addEventListener("change", function () {
  Password = password.value;
  // signinButton.removeAttribute("disabled");
  if(existingData[emailID].password != Password){
    alert("Invalid credentials")
    password.value ="";
    // signinButton.disabled = "disabled"
}
else{
    signinButton.removeAttribute("disabled");
  }
});
function login_(){
  fetch(
    `http://localhost:8000/login?username=${emailID}`
  );
  location.replace("http://localhost:8000/main.html")
}

