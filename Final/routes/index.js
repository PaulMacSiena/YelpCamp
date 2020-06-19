//initialize constants
const express = require("express"),
router = express.Router(),
passport = require("passport"),
User = require("../models/user"),
port = 3000;

//landing page
router.get("/", (req, res) => {
    res.render("landing");
})

//auth route for registering
router.get("/register",(req,res) => {
    res.render("register");
})

//auth route for creating new user
router.post("/register",(req,res) => {
    let newUser = new User({username: req.body.username});
    console.log(newUser);
    User.register(new User(newUser),req.body.password, (err, user) => {
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    });
})

//auth route for logging in
router.get("/login",(req,res) => {
    res.render("login");
})

//auth route for authenticating login
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res) => {
   //nothing for now 
});

//middleware for logging out
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/campgrounds");
})

module.exports = router;