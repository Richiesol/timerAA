import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());

var data;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} : http://localhost:${PORT}`);
});

app.use("/", express.static(process.cwd()));

app.post("/datasend", (req, res) => {
  data = req.body;
  console.log(data);
  var fileRead = fs.readFileSync("userdata.json");
  var localObject = JSON.parse(fileRead);
  localObject[data.email] = data;
  var newData2 = JSON.stringify(localObject);
  fs.writeFile("userdata.json", newData2, (err) => {
    if (err) throw err;
    console.log("New data added");
  });
});

// app.get('/login',function(req,res){
//   res.sendFile(path.join(__dirname+'/main.html'));
//   console.log('AASDF');
// });
// app.get("/redirect",(req,res)=>{
//   res.sendFile("C:/Users/richie.soshan/Desktop/mini_pro/meal_planner/main.html");
// })
