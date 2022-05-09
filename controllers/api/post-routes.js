const router = require("express").Router();
const sequelize = require("../../config/connection"); // used to count votes in PUT votes
const { Post, User, Vote, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all users posts /api/posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      res.json(dbPostData);
      // pass a single post object into the homepage template
      // console.log(dbPostData[0]); // see how sequelize formats the data

      // This will loop over and map each Sequelize object into a serialized version of itself,
      // saving the results in a new posts array.
      // const posts = dbPostData.map((post) => post.get({ plain: true }));
      // res.render("homepage", { posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a single post /api/posts/:id
router.get("/:id", (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a post route /api/posts
router.post("/", withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    // use the logged in user's session id for user_id
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// "vote" - update the user post to add a "vote", /api/posts/upvote
// must be placed before the put /:id Express.js will think the word "upvote" is a valid parameter for /:id
// PUT /api/posts/upvote
router.put("/upvote", withAuth, (req, res) => {
  // make sure the session exists first a.k.a. the user is logged in
  if (req.session) {
    // pass session if along with all deconstructed properties on req.body
    // custom static method create in models/Post.js
    Post.upvote(
      {
        ...req.body,
        user_id: req.session.user_id,
      },
      {
        Vote,
        Comment,
        User,
      }
    )
      .then((updatedVoteData) => res.json(updatedVoteData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// update a post title /api/posts
router.put("/:id", withAuth, (req, res) => {
  Post.update({ title: req.body.title }, { where: { id: req.params.id } })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post from a specific user id /api/posts/:id
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({ where: { id: req.params.id } })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
