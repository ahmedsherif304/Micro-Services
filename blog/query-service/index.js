const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const posts = {};
const app = express();
const axios = require("axios");

app.use(bodyParser.json());
app.use(cors());

const applyEvents = (type, data) => {
  if (type === "PostCreated")
    posts[data.id] = { id: data.id, title: data.title, comments: [] };
  else if (type == "CommentCreated")
    posts[data.postID].comments.push({
      content: data.content,
      id: data.id,
      status: data.status,
    });
  else if (type == "CommentUpdated") {
    posts[data.postID].comments.forEach((comment) => {
      if (comment.id === data.id) {
        comment.content = data.content;
        comment.status = data.status;
      }
    });
  }
};

app.get("/posts", (req, res) => {
  console.log("getting all the posts");
  res.send(posts);
});

app.post("/events", (req, res) => {
  const type = req.body.event.type;
  const data = req.body.event.data;
  console.log(`event recieved : ${type}`);
  applyEvents(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("listening on port 4002...");
  try {
    const events = (await axios.get("http://event-bus:4005/events")).data;
    events.forEach(({ type, data }) => {
      applyEvents(type, data);
    });
  } catch (err) {
    console.log(`err : ${err}`);
  }
});
