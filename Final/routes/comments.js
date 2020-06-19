//initialize constants
const express = require("express"),
router = express.Router({mergeParams: true}),
Campground = require("../models/campground"),
Comment = require("../models/comment");

//create new comment form
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id,(err, campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    })
})

//post for new comment
router.post("/", isLoggedIn,(req,res) => {
    //lookup cg using id
    Campground.findById(req.params.id,(err,campground) => {
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            //create new comment
            Comment.create(req.body.comment,(err,comment) => {
                if(err){
                    console.log(err);
                }
                else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

//middleware for checking authentication/ if user is logged in
function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;