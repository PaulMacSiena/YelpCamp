//initialize constants
const express = require("express"),
router = express.Router(),
passport = require("passport"),
User = require("../models/user"),
middleWareObj = require("../middleware");

//landing page
router.get("/", (req, res) => {
    res.render("landing");
})

//auth route for registering
router.get("/register",middleWareObj.isLoggedOut,(req,res) => {
    res.render("register");
})

//auth route for creating new user
router.post("/register",middleWareObj.isLoggedOut,(req,res) => {
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
router.get("/login",middleWareObj.isLoggedOut,(req,res) => {
    res.render("login");
})

//auth route for authenticating login
router.post("/login", middleWareObj.isLoggedOut, passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res) => {
   //nothing for now 
});

//middleware for logging out
router.get("/logout",middleWareObj.isLoggedIn, (req,res) => {
    req.logout();
    res.redirect("/campgrounds");
})

module.exports = router;