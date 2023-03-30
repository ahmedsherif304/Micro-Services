const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const posts = {};
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/posts", async (req, res) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    posts[id] = {
      id,
      title,
    };
    await axios.post("http://event-bus:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
    res.status(201);
    res.send(posts[id]);
  } catch (err) {
    console.log(`err : ${err}`);
  }
});

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const type = req.body.event.type;
  const data = req.body.event.data;
  console.log(`event recieved : ${type}`);
  res.send({});
});

app.listen(4000, () => {
  console.log("listening on port 4000...");
});
