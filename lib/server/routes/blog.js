const { join } = require("path");
const sanitize = require("mongo-sanitize");
const { Types } = require("mongoose");
const BlogPost = require("../models/blogpost");

module.exports = function oauth(app) {

  app.get("/api/blog/posts/:limit?", (req, res) => {
    console.log(req.params.limit);
    if(req.params.limit && !+req.params.limit > 0) {
      res.sendStatus(400);
      return;
    }
    const limit = req.params.limit ? +req.params.limit : false
    BlogPost.find({}, {title: 1, description: 1, image: 1, author: 1, prettyURL: 1})
    .sort({"createdTS": -1})
    .limit(limit)
    .exec()
    .then(posts => {
      res.json(posts);
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });

  app.get("/api/blog/post/:postid", (req, res) => {
    BlogPost.findOne({
      prettyURL: req.params.postid
    })
    .then(post => {
      if(!post) {
        res.sendStatus(404);
      } else {
        res.json(post._doc);
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });

};
