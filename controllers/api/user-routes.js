const router = require("express").Router();
const { User, Post, Vote, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET /api/users, display
router.get("/", (req, res) => {
  User.findAll({
    // access User Model and use .findAll() method "SELECT * FROM users;"
    attributes: { exclude: ["password"] }, // hides passwords from get requests
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1, display a single user
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] }, // hides passwords from get requests
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_url", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
      {
        model: Post,
        attributes: ["title"],
        through: Vote,
        as: "voted_posts",
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users, create a new user
router.post("/", withAuth, (req, res) => {
  // expects {username: 'Steve', email: 'steve@gmail.com', password: 'password'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        // save these req.body values to saved session object
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData); // respond with data object
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login post and validation /api/user/login
router.post("/login", withAuth, (req, res) => {
  // expects {email: 'steve@gmail.com, password: 'password'}
  User.findOne({
    where: { email: req.body.email },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No user with that email address" });
      return;
    }
    // commented response so that data doesnt get displayed when logging in
    // res.json({user: dbUserData});
    // verify password
    const validPassword = dbUserData.checkPassword(req.body.password); // returns boolean after syncCompare()
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    // save successful logged in "session" to cookies
    req.session.save(() => {
      // declare and save the current session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      // respond with current user data and notify that they have logged in
      res.json({ user: dbUserData, message: "You are now logged in" });
    });
  });
});

// PUT /api/user/1, update a single user
router.put("/:id", withAuth, (req, res) => {
  // expects {username: 'Steve', email: 'steve@gmail.com', password: 'password'}

  // if req.body has exact key/value pairs to match the model,
  // you can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/user/1, remove a single user
router.delete("/:id", withAuth, (req, res) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(400).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// logout route /api/user/logout
// destroying the session variables and resetting the cookie
router.post("/logout", withAuth, (req, res) => {
  if (req.session.loggedIn) {
    // use the destroy method to end the session cookie
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
