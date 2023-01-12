const new_task_button = document.getElementById("popup-trigger");
const form = document.getElementById("myForm");
const form2 = document.getElementById("myForm2");
const form3 = document.getElementById("myForm3");
const name = document.getElementById("name");
const emailAccount = document.getElementById("emailId");

let username;
let userData = {};
let totalDuration;
let nickName;

const taskName = document.getElementById("taskname");
const tagName = document.getElementById("tagname");
const create_task_button = document.getElementById("create_task");
const duration = document.getElementById("duration");
const play_button = document.getElementById("play");
const pause_button = document.getElementById("stop");
const pauseButton = document.getElementById("pause");
const logTaskName = document.getElementById("taskname_entry");
const historyPanel = document.getElementById("history");
const logtab = document.getElementById("log1");
const logger = document.getElementById("logger");
const errormessage = document.getElementById("errormessage");
const timestamp = document.getElementById("timestamp");
const taskNameEntry = document.getElementById("taskname_entry");

let date = new Date();
let today = date.toDateString();
console.log(today);

let taskNameContent;
let tagNameContent;
let count = 0;
let timer_interval;
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let logMinutesLabel = document.getElementById("logminutes");
let logSecondsLabel = document.getElementById("logseconds");
let totalSeconds = 0;
let notificationLabel = document.getElementById("notification");
let differenceInMin;
let totalMin;
let data = {};
let globalPlayPauseElement = null;


let timeExceed = setInterval(() => {
  if (parseInt(totalSeconds / 60) == totalMin) {
    error_message("Time Exceeded");
  }
}, 500);

taskName.addEventListener("change", function () {
  taskNameContent = taskName.value;
});
tagName.addEventListener("change", function () {
  tagNameContent = tagName.value;
});
taskNameEntry.addEventListener("change", function () {
  console.log("asdf")
})
create_task_button.addEventListener("click", function () {
  if (taskNameContent != undefined) {
    new_task_button.innerText = taskNameContent;
  } else {
    taskNameContent = "null";
  }
});
duration.addEventListener("input", function () {
  let current_time = currentTime();
  let difference =
    parseInt(duration.value.replace(":", "")) -
    parseInt(current_time.replace(":", ""));
  if (difference < 0) {
    error_message("Please input a proper time");
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
  if (globalPlayPauseElement != null) {
    globalPlayPauseElement.style.display = "none";
    globalPlayPauseElement.previousElementSibling.style.display = "block";
    clearInterval(timer_interval);
    totalSeconds = 0;
  }
  start_timer();
  play_button.style.display = "none";
  pause_button.style.display = "block";
  globalPlayPauseElement = pause_button;
});
pause_button.addEventListener("click", function () {
  globalPlayPauseElement = null;
  clearInterval(timer_interval);
  count++;
  totalDuration = minutesLabel.innerHTML + secondsLabel.innerHTML;
  save_data(taskNameContent, tagNameContent, totalDuration);
  stop_timer(minutesLabel, secondsLabel);
  pause_button.style.display = "none";
  play_button.style.display = "block";
  reset();
  if (count == 1) {
    showHistory();
  }
  if (count > 1) {
    addLogTab(`log${count}`);
  }
  addDataToLog();
});
pauseButton.addEventListener("click", function () {
  if (globalPlayPauseElement != null) {
    globalPlayPauseElement.style.display = "none";
    globalPlayPauseElement.previousElementSibling.style.display = "block";
  }
  clearInterval(timer_interval);
  resume(minutesLabel, secondsLabel);
  pauseButton.style.display = "none";
  pause_button.style.display = "block";
});
new_task_button.addEventListener("click", () => {
  openForm();
});
logger.addEventListener("change", function () {
  console.log("asdfj");
});

/**
 *function to fetch the username from the server
 *
 */
async function getdata() {
  let user = await fetch("http://localhost:8000/getusername");
  if (user.ok) {
    let userdetails = await user.json();
    emailAccount.innerText = username = userdetails["username"];
    nickName = userdetails["nickname"];
    name.innerText = nickName;
  }
}
(async () => {
  await getdata();
  userData[username] = {};
  await fetchDataFromJson();
})();

/**
 *function to fetch data from the data json file 
 *
 */
async function fetchDataFromJson() {
  let response = await fetch(
    `http://localhost:8000/getuserdata?username=${username}`
  );
  if (response.status !== 100) {
    let json = await response.json();
    userData[username] = json;
    updateDataToLog();
  }
}

/**
 *function to update the data to object
 *
 */
async function saveData() {
  let response = await fetch("http://localhost:8000/datasave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(userData),
  });
}

/**
 *this opens a modal box for the task name and tag name
 *
 */
function openForm() {
  document.getElementById("myForm").style.display = "block";
  form.classList.add("show");
}

/**
 *this opens a modal box for the schedule panel
 *
 */
function openForm2() {
  document.getElementById("myForm2").style.display = "block";
  form2.classList.add("show");
}

/**
 *this opens a modal box for logout and export
 *
 * @param {*} event
 */
function openForm3(event) {
  let target = event.target;
  let outerDiv = target.closest(".log_entry");
  outerDiv.nextElementSibling.style.display = "block";
  outerDiv.nextElementSibling.classList.add("show");
}

/**
 *this closes the taskname modal box
 *
 */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  form.classList.remove("show");
}

/**
 *this closes the schedule modal form box
 *
 */
function closeForm2() {
  document.getElementById("myForm2").style.display = "none";
  form2.classList.remove("show");
}

/**
 *this closes the logout and export modal form box
 *
 */
function closeForm3() {
  form3.style.display = "none";
}

/**
 *function to delete a log from the history
 *
 * @param {*} event
 */
function deletelog(event) {
  let response = confirm("Are you sure you want to delete the log ?");
  if (response) {
    let target = event.target;
    let outerDiv = target.closest(".log");
    if (logger.childElementCount == 1) {
      historyPanel.style.display = "none";
      count = 0;
      closeForm3(event);
      updateTotal();
    } else {
      outerDiv.remove();
      updateTotal();
    }
    delete userData[username][outerDiv.id];
    saveData();
    console.log(userData);
  }
}

/**
 *the properties to change when the stopped timmer is resumed
 *
 * @param {*} event
 */
function resumebutton(event) {
  if (globalPlayPauseElement != null) {
    totalSeconds = 0;
    clearInterval(timer_interval);
    if (secondsLabel.innerHTML != "00" || minutesLabel.innerHTML != "00") {
      globalPlayPauseElement.style.display = "none";
      pauseButton.style.display = "block";
    } else {
      globalPlayPauseElement.style.display = "none";
      globalPlayPauseElement.previousElementSibling.style.display = "block";
    }
  }
  let target = event.target;
  let outerDiv = target.closest(".time_play");
  let timerDiv = outerDiv.lastElementChild.previousElementSibling;
  let logMin = timerDiv.firstElementChild;
  let logSec = timerDiv.lastElementChild;
  outerDiv.firstElementChild.style.display = "none";
  outerDiv.firstElementChild.nextElementSibling.style.display = "block";
  let tempelement = outerDiv.firstElementChild;
  globalPlayPauseElement = tempelement.nextElementSibling;
  resume(logMin, logSec);
}

/**
 *properties to change when the timmer is stopped
 *
 * @param {*} event
 */
function stopResumeButton(event) {
  globalPlayPauseElement = null;
  let target = event.target;
  let outerDiv = target.closest(".time_play");
  clearInterval(timer_interval);
  outerDiv.firstElementChild.style.display = "block";
  outerDiv.firstElementChild.nextElementSibling.style.display = "none";
  totalSeconds = 0;
  updateTotal();
}

/**
 *function to clone a log and add it to the parent
 *
 * @param {*} id : the id of an element
 */
function addLogTab(id) {
  let clonedLogTab = logtab.cloneNode(true);
  clonedLogTab.id = id;
  logger.appendChild(clonedLogTab);
}

/**
 *function to update the data to the newly added log
 *
 */
function addDataToLog() {
  let taskNameValue = data[count]["taskName"];
  let tagNameValue = data[count]["tag"];
  let timestamp = data[count]["date"];
  let durationMinValue = data[count]["duration"].slice(0, 2);
  let durationSecValue = data[count]["duration"].slice(-2);
  updateElements(
    taskNameValue,
    tagNameValue,
    timestamp,
    durationMinValue,
    durationSecValue
  );
  userData[username][`log${count}`] = [
    taskNameValue,
    tagNameValue,
    timestamp,
    durationMinValue,
    durationSecValue,
  ];
  updateTotal();
  saveData();
}

/**
 *function to update the DOM element of the log
 *
 * @param {*} taskNameValue: name of the task
 * @param {*} tagNameValue: name of the tag
 * @param {*} timestamp: Day stamp
 * @param {*} durationMinValue: min value
 * @param {*} durationSecValue: sec value
 */
function updateElements(
  taskNameValue,
  tagNameValue,
  timestamp,
  durationMinValue,
  durationSecValue
) {
  let taskNameElement =
    logger.lastElementChild.firstElementChild.firstElementChild
      .firstElementChild;

  taskNameElement.innerText = taskNameValue;
  let tagNameElement =
    logger.lastElementChild.firstElementChild.firstElementChild
      .lastElementChild;

  tagNameElement.innerText = tagNameValue;
  let day =
    logger.lastElementChild.firstElementChild.firstElementChild
      .nextElementSibling;

  day.innerText = timestamp;
  let durationMin =
    logger.lastElementChild.firstElementChild.lastElementChild.lastElementChild
      .previousElementSibling.firstElementChild;

  durationMin.innerText = durationMinValue;

  let durationSec =
    logger.lastElementChild.firstElementChild.lastElementChild.lastElementChild
      .previousElementSibling.lastElementChild;

  durationSec.innerText = durationSecValue;
}

/**
 *function to update the min section on the lof
 *
 */
function updatemin() {
  let min = document.querySelectorAll(".logmin");
  let sec = document.querySelectorAll(".logsec");
  let totalMin = 0;
  let totalSec = 0;
  updateTotal();
}

/**
 *function to update the total mins of task completed
 *
 */
function updateTotal() {
  let min = document.querySelectorAll(".logmin");
  let sec = document.querySelectorAll(".logsec");
  let totalMin = 0;
  let totalSec = 0;
  for (let iter = 0; iter < min.length; iter++) {
    totalMin += parseInt(min[iter].innerText);
  }
  for (let iter = 0; iter < sec.length; iter++) {
    totalSec += parseInt(sec[iter].innerText);
  }
  document.getElementById("todayminutes").innerText = pad(
    parseInt(totalSec / 60) + totalMin
  );
  document.getElementById("todayseconds").innerText = pad(totalSec % 60);
}

/**
 *function to append the newly added data to an object 
 *
 * @param {*} taskname:name of the task
 * @param {*} tagname:name of the tag
 * @param {*} duration:total duration of a task
 */
function save_data(taskname, tagname, duration) {
  if (taskname == undefined || taskname == "null") {
    taskname = "N/A";
  }
  if (tagname == undefined) {
    tagname = "N/A";
  }
  data[count] = {
    taskName: taskname,
    tag: tagname,
    date: today,
    duration: duration,
  };
}

/**
 *function to reset the top timmer coloumn
 *
 */
function reset() {
  new_task_button.innerText = "+ Start new task";
  taskName.innerText = "";
  tagName.innerText = "";
  duration.value = "";
}

/**
 *function to determine the current time 
 *
 * @return {*} 
 */
function currentTime() {
  let date = new Date();
  let realTime = date.toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return realTime;
}

/**
 *function to pop up an error message to handle errors
 *
 * @param {*} str
 */
function error_message(str) {
  clearInterval(timeExceed);
  errormessage.innerText = str;
  notificationLabel.style.display = "flex";
}

/**
 *function to close the notification bar
 *
 */
function closenotification() {
  notificationLabel.style.display = "none";
}

/**
 *function to resume the timer from where it stoped
 *
 * @param {*} min:value of the min 
 * @param {*} sec:value of the sec
 */
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

/**
 *function to show the history panel
 *
 */
function showHistory() {
  historyPanel.style.display = "flex";
}

/**
 *function to start a timer
 *
 */
function start_timer() {
  timer_interval = setInterval(setTime, 1000);
}

/**
 *function to stop a timer
 *
 * @param {*} min
 * @param {*} sec
 */
function stop_timer(min, sec) {
  clearInterval(timer_interval);
  sec.innerHTML = "00";
  min.innerHTML = "00";
  totalSeconds = 0;
}

/**
 *function to set the value of the min and sec to the DOM element
 *
 */
function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

/**
 *function to provide 0 padding to the min and sec values
 *
 * @param {*} val:string - to be padded
 * @return {*} string with padding
 */
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

/**
 *function to update Data to the log 
 *
 */
function updateDataToLog() {
  let data = Object.keys(userData[username]);
  if (data.length >= 1) {
    showHistory();
    updateElements(
      userData[username][data[0]][0],
      userData[username][data[0]][1],
      userData[username][data[0]][2],
      userData[username][data[0]][3],
      userData[username][data[0]][4]
    );
    for (let iter = 1; iter < data.length; iter++) {
      addLogTab(data[iter]);
      updateElements(
        userData[username][`${data[iter]}`][0],
        userData[username][`${data[iter]}`][1],
        userData[username][`${data[iter]}`][2],
        userData[username][`${data[iter]}`][3],
        userData[username][`${data[iter]}`][4]
      );
    }
  }
  count = data[data.length - 1].replace(/\D/g, "");
}

/**
 *function to run when the user presses the logout button
 *
 */
function logout() {
  location.replace("http://localhost:8000/index.html");
}

/**
 *function to show the logout button
 *
 */
function showlogout() {
  form3.style.display = "flex";
}

/**
 *function to export the data of a user into a csv format
 *
 */
function exportData() {
  let exportableData = [["Taskname", "TagName", "Timestamp", "Min", "Sec"]];
  let data = Object.values(userData[username]);
  for (let iter = 0; iter < data.length; iter++) {
    exportableData.push(data[iter]);
  }
  let response = confirm("Do you want to Download the data as a csv");
  if (response) {
    downloadCsv(
      `${nickName}.csv`,
      json2csv.parse(exportableData, {
        header: false,
      })
    );
  }
}

/**
 *function to create a downloadable file to be downloaded
 *
 * @param {*} filename
 * @param {*} csvData
 */
function downloadCsv(filename, csvData) {
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
  element.setAttribute("download", filename);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
