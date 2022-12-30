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
function openForm3(event) {
  let target = event.target;
  let outerDiv = target.closest('.log_entry');
  console.log(outerDiv.nextElementSibling)
  outerDiv.nextElementSibling.style.display = "block";
  outerDiv.nextElementSibling.classList.add("show");
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  form.classList.remove("show");
}
function closeForm2() {
  document.getElementById("myForm2").style.display = "none";
  form2.classList.remove("show");
}
function closeForm3(event) {
  let target = event.target;
  let outerDiv = target.closest('.edit_popup');
  outerDiv.style.display = "none";
  outerDiv.classList.remove("show");
}
function deletelog(event){
  let target = event.target;
  let outerDiv = target.closest('.log'); 
  if(logger.childElementCount == 1){
    historyPanel.style.display = "none";
    count = 0;
    closeForm3(event)
  }
  else{
    outerDiv.remove()
  }
}
const taskName = document.getElementById("taskname");
const tagName = document.getElementById("tagname");
const create_task_button = document.getElementById("create_task");
const duration = document.getElementById("duration");
const play_button = document.getElementById("play");
const pause_button = document.getElementById("pause");
const logTaskName = document.getElementById("taskname_entry");
const historyPanel = document.getElementById("history");
const logtab = document.getElementById("log1");
const logger = document.getElementById("logger")

let taskNameContent;
let tagNameContent;
var count = 0;
let timer_interval;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var logMinutesLabel = document.getElementById("logminutes");
var logSecondsLabel = document.getElementById("logseconds");
var totalSeconds = 0;
let notificationLabel = document.getElementById("notification");
let differenceInMin;
let totalMin;
let data = {};

let timeExceed = setInterval(() => {
  if (parseInt(totalSeconds / 60) >= totalMin) {
    error_message();
  }
}, 500);

taskName.addEventListener("change", function () {
  taskNameContent = taskName.value;
});
tagName.addEventListener("change", function () {
  tagNameContent = tagName.value;
});
create_task_button.addEventListener("click", function () {
  if (taskNameContent != undefined) {
    new_task_button.innerText = taskNameContent;
  } else {
    taskNameContent = "null";
  }
});


function resumebutton(event){
  let target = event.target;
  let outerDiv = target.closest('.time_play');
  let timerDiv = outerDiv.lastElementChild.previousElementSibling
  let logMin = timerDiv.firstElementChild;
  let logSec = timerDiv.lastElementChild;
  resume(logMin, logSec);
  outerDiv.firstElementChild.style.display = "none";
  outerDiv.firstElementChild.nextElementSibling.style.display = "block";
};
function stopResumeButton(event) {
  let target = event.target;
  let outerDiv = target.closest('.time_play');
  clearInterval(timer_interval);
  outerDiv.firstElementChild.style.display = "block";
  outerDiv.firstElementChild.nextElementSibling.style.display = "none";
  totalSeconds = 0;
  updateTotal();
};
duration.addEventListener("input", function () {
  let current_time = currentTime();
  let difference =
    parseInt(duration.value.replace(":", "")) -
    parseInt(current_time.replace(":", ""));
  if (difference < 0) {
    error_message();
    duration.value = current_time;
    minutesLabel.innerHTML = "00";
  } else {
    let hoursToMin = pad(
      String(difference).slice(0, String(difference).length - 2)
    );
    differenceInMin =
      parseInt(String(difference).slice(-2)) + parseInt(hoursToMin) * 60;
    totalMin = differenceInMin;
    minutesLabel.innerHTML = pad(String(differenceInMin));
  }
});
play_button.addEventListener("click", function () {
  start_timer();
  play_button.style.display = "none";
  pause_button.style.display = "block";
});
pause_button.addEventListener("click", function () { 
  count++;
  let totalDuration = minutesLabel.innerHTML + secondsLabel.innerHTML;
  save_data(taskNameContent, tagNameContent, totalDuration);
  stop_timer(minutesLabel, secondsLabel);
  pause_button.style.display = "none";
  play_button.style.display = "block";
  reset();
  if ((count == 1)) {
    showHistory();
  }
  if(count > 1){
    addLogTab();
  }
  addDataToLog();
});

function addLogTab() {

    let clonedLogTab = logtab.cloneNode(true);
    clonedLogTab.id = `log${count}`;
    logger.appendChild(clonedLogTab);
  }
function addDataToLog(){
  logger.lastElementChild.firstElementChild.firstElementChild.firstElementChild.innerText = data[count]["taskName"];
  logger.lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = data[count]["tag"];
  logger.lastElementChild.firstElementChild.lastElementChild.lastElementChild.previousElementSibling.firstElementChild.innerText = data[count]["duration"].slice(0, 2);
  logger.lastElementChild.firstElementChild.lastElementChild.lastElementChild.previousElementSibling.lastElementChild.innerText = data[count]["duration"].slice(-2);
  updateTotal();
}
function updatemin(){
  let min = document.querySelectorAll(".logmin");
  let sec = document.querySelectorAll(".logsec");
  let totalMin = 0;
  let totalSec = 0;
  // console.log(min)
  updateTotal();
}

function updateTotal(){
  let min = document.querySelectorAll(".logmin");
  let sec = document.querySelectorAll(".logsec");
  let totalMin = 0;
  let totalSec = 0;
  for(let iter=0;iter< min.length;iter++){
    totalMin += parseInt(min[iter].innerText);
  }
  for(let iter=0;iter< sec.length;iter++){
    totalSec += parseInt(sec[iter].innerText);
  }
  document.getElementById('totalminutes').innerText= document.getElementById('todayminutes').innerText=pad(parseInt(totalSec/60) + totalMin);
  document.getElementById('totalseconds').innerText= document.getElementById('todayseconds').innerText=pad(totalSec%60);
}
function save_data(taskname, tagname, duration) {
  if (taskname == undefined || taskname == "null"){
    taskname = "N/A";
  }
  if (tagname == undefined) {
    tagname = "N/A";
  }
  data[count] = {
    taskName: taskname,
    tag: tagname,
    duration: duration,
  };
}
function reset() {
  new_task_button.innerText = "+ Start new task";
  taskName.innerText = "";
  tagName.innerText = "";
  duration.value = "";
}
function currentTime() {
  let date = new Date();
  let realTime = date.toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return realTime;
}
function error_message() {
  clearInterval(timeExceed);
  alert("Please enter a proper time");
  notificationLabel.style.display = "flex";
}
function resume(min, sec) {
  let runMin = min.innerText;
  let runSec = sec.innerText;
  totalSeconds = parseInt(runMin) * 60 + parseInt(runSec);
  timer_interval = setInterval(function () {
    ++totalSeconds;
    sec.innerHTML = pad(totalSeconds % 60);
    min.innerHTML = pad(parseInt(totalSeconds / 60));
  }, 1000);
}
function showHistory() {
  historyPanel.style.display = "flex";
}
function start_timer() {
  timer_interval = setInterval(setTime, 1000);
}
function stop_timer(min, sec) {
  clearInterval(timer_interval);
  sec.innerHTML = "00";
  min.innerHTML = "00";
  totalSeconds = 0;
}
function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}