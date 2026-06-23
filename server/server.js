const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req,res)=>{

res.send("EventSphere Backend Running");

});

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Close the other terminal running the server, then try again.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});