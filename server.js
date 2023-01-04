import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());

var data;
var username;
var existingData;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} : http://localhost:${PORT}`);
});

app.use("/", express.static(process.cwd()));

app.post("/datasend", (req, res) => {
  data = req.body;
  var fileRead = fs.readFileSync("users.json");
  var localObject = JSON.parse(fileRead);
  localObject[data.email] = data;
  var newData2 = JSON.stringify(localObject);
  fs.writeFile("users.json", newData2, (err) => {
    if (err) throw err;
    console.log("New data added");
  });
});

app.get("/login", (req, res) => {
  if (req.query.username) {
    username = req.query.username;
  } else {
    res.status(404).json({
      Error: "Not a Valid EndPoint.Please refer back to the Documentation",
    });
  }
});

app.get("/getusername", (req, res) => {
  var fileRead = fs.readFileSync("users.json");
  var localObject = JSON.parse(fileRead);
  let userdetail = {
    username: username,
    nickname: localObject[username]["nickname"],
  };
  res.send(userdetail);
});

app.post("/datasave", (req, res) => {
  let userdata = req.body;
  let username = Object.keys(userdata)[0];
  var fileRead = fs.readFileSync("userdata.json");
  var localObject = JSON.parse(fileRead);
  localObject[username] = userdata[username];
  var newData2 = JSON.stringify(localObject);
  fs.writeFile("userdata.json", newData2, (err) => {
    if (err) throw err;
    console.log("New data added");
  });
});

app.get("/getuserdata", (req, res) => {
  if (req.query.username) {
    let user = req.query.username;
  } else {
    res.status(404).json({
      Error: "Not a Valid EndPoint.Please refer back to the Documentation",
    });
  }
  var fileRead = fs.readFileSync("userdata.json");
  var localObject = JSON.parse(fileRead);
  if (localObject[username] !== undefined) {
    res.send(localObject[username]);
  }
  else{
    res.status(100)
  }
});
