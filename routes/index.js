const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const MyModel = require("../models/User.model.js");

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.get("/signup", (req, res, next) => {
  // Shows sign up form to user
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { name, password } = req.body;
//   if (!name.length || !password.length) {
//     res.render("views/index", { msg: "Please enter all fields" });
//     return;
//   }
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  MyModel.create({ name, password: hash })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});



router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { name, password } = req.body;
  MyModel.findOne({ name: name })
    .then((result) => {
      if (result) {
        bcrypt.compare(password, result.password)
        .then((isMatching) => {
          if (isMatching) {
            req.session.loggedInUser = result;
            res.redirect("/afterLogin");
          } else {
            res.render("login.hbs", { msg: "Passwords dont match" });
          }
        });
      } else {
        res.render("login.hbs", { msg: "That Name does not exist" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/afterLogin", (req, res, next) => {
  res.render("afterLogin.hbs");
});



router.get("/private", (req, res, next) => {
  res.render("private.hbs");
});

router.get("/main", (req, res, next) => {
  res.render("main.hbs");
});

router.get("/backToHome", (req,res) =>{
res.redirect("/");
});
 

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
}); 

//protect routes
const checkLoggedInUser = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/signin");
  }
};

router.get("/private", checkLoggedInUser, (req, res, next) => {
  let mypassword = req.session.loggedInUser.password;
  res.render("private.hbs", { mypassword });
});

router.get("/main", checkLoggedInUser, (req, res, next) => {
  let myname = req.session.loggedInUser.password;
  res.render("main.hbs", { myname });
});


module.exports = router;
