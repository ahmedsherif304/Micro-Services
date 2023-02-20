const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const commentsByPostID = {};
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const postID = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostID[postID] || [];
  comments.push({ id, content });
  commentsByPostID[postID] = comments;

  console.log(`Comment created : ${content}`);
  await axios.post("http://event-bus:4005/events", {
    type: "CommentCreated",
    data: { id, content, postID, status: "Pending" },
  });

  res.status(201);
  res.send(comments);
});

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostID[req.params.id] || []);
});

app.post("/events", async (req, res) => {
  try {
    const type = req.body.event.type;
    const { id, content, postID, status } = req.body.event.data;
    console.log(`event recieved : ${type}`);
    if (type === "CommentModerated") {
      await axios.post("http://event-bus:4005/events", {
        type: "CommentUpdated",
        data: { id, content, postID, status },
      });
    }
    res.send({});
  } catch (err) {
    console.log(`err : ${err}`);
  }
});
app.listen(4001, () => {
  console.log("listening on port 4001...\n\n");
});
