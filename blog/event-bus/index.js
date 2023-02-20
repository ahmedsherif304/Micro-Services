const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const axios = require("axios");
const events = [];

app.use(bodyParser.json());
app.use(cors());

const callService = async (ip, port, event) => {
  try {
    await axios.post(`http://${ip}:${port}/events`, { event });
  } catch (err) {
    console.log(`err : ${err}`);
  }
};

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log(`Recieved Event : ${event.type}`);
  events.push(event);
  callService("posts", 4000, event);
  callService("comments", 4001, event);
  callService("query-service", 4002, event);
  callService("moderator", 4003, event);

  res.send({});
});

app.get("/events", async (req, res) => {
  console.log("some one asked for all the events");
  res.send(events);
});

app.listen("4005", () => {
  console.log("listening on port 4005...");
});
