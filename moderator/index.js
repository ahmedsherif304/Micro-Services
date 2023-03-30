const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const events = [];

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  try {
    const type = req.body.event.type;
    let { id, content, postID, status } = req.body.event.data;
    console.log(`event recieved : ${type}`);
    if (type === "CommentCreated") {
      status = content.includes("new") ? "Rejected" : "Accepted";
      await axios.post("http://event-bus:4005/events", {
        type: "CommentModerated",
        data: { id, content, postID, status },
      });
    }
    res.send({});
  } catch (err) {
    console.log(`err : ${err}`);
  }
});

app.listen("4003", () => {
  console.log("listening on port 4003...");
});
