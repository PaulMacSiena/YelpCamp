const Comment = require("../models/comment"),
Campground = require("../models/campground");
//all middleware goes here
let middleWareObj = {};

middleWareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        //if so, they can edit
        Campground.findById(req.params.id,(err, cg) => {
            if (err){
                console.log(err);
                res.redirect("back");
            }
            else{
                if (cg.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
}

//middleware for checking authentication/ if user is logged in
middleWareObj.isLoggedIn = (req,res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//middleware to prevent users who are logged in from accessing register and login forms
middleWareObj.isLoggedOut = (req,res,next) => {
    if(!req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/campgrounds");
    }
}

middleWareObj.checkCommentOwnership = (req,res, next) => {
    if (req.isAuthenticated()){
        //if so, they can edit
        Comment.findById(req.params.comment_id,(err, comment) => {
            if (err){
                console.log(err);
                res.redirect("back");
            }
            else{
                if (comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
}

module.exports = middleWareObj;