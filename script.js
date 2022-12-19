const new_task_button = document.getElementById("popup-trigger");
const form = document.getElementById("myForm");
const form2 = document.getElementById("myForm2");
const form3 = document.getElementById("myForm3");

new_task_button.addEventListener("click", () => {
  openForm();
});
function openForm() {
  document.getElementById("myForm").style.display = "block";
  form.classList.add("show");
}
function openForm2() {
  document.getElementById("myForm2").style.display = "block";
  form2.classList.add("show");
}
function openForm3() {
  document.getElementById("myForm3").style.display = "block";
  form3.classList.add("show");
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  form.classList.remove("show");
}
function closeForm2() {
  document.getElementById("myForm2").style.display = "none";
  form2.classList.remove("show");
}
function closeForm3() {
  document.getElementById("myForm3").style.display = "none";
  form3.classList.remove("show");
}
