//initialize constants
const express = require("express"),
router = express.Router({mergeParams: true}),
Campground = require("../models/campground"),
Comment = require("../models/comment"),
middleWareObj = require("../middleware");

//create new comment form
router.get("/new", middleWareObj.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id,(err, campground) => {
        if (err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("back");
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    })
})

//post for new comment
router.post("/", middleWareObj.isLoggedIn,(req,res) => {
    //lookup cg using id
    Campground.findById(req.params.id,(err,campground) => {
        if (err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("/campgrounds");
        }
        else{
            //create new comment
            Comment.create(req.body.comment,(err,comment) => {
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "You added a new review!");
                    return res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

// form to edit comment
router.get("/:comment_id/edit", middleWareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("back");
        }
        else{
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    })
})

// update comment
router.put("/:comment_id", middleWareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
        if (err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
})

router.delete("/:comment_id", middleWareObj.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("back");
        }
        req.flash("success","Added Comment successfully")
        return res.redirect("/campgrounds/"+req.params.id);
    }) 
})

module.exports = router;