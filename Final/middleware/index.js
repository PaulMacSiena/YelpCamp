const Comment = require("../models/comment"),
Campground = require("../models/campground");
//all middleware goes here
let middleWareObj = {};

middleWareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        //if so, they can edit
        Campground.findById(req.params.id,(err, cg) => {
            if (err || !cg){
                if (err){
                    console.log(err);
                }
                req.flash("error", "Campground not found");
                return res.redirect("back");
            }
            else{
                if (cg.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You don't have permissions to do that!")
                    return res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that!")
        return res.redirect("back");
    }
}

//middleware for checking authentication/ if user is logged in
middleWareObj.isLoggedIn = (req,res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    return res.redirect("/login");
}

//middleware to prevent users who are logged in from accessing register and login forms
middleWareObj.isLoggedOut = (req,res,next) => {
    if(!req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "Cannot access the previous page while logged in")
        return res.redirect("/campgrounds");
    }
}

middleWareObj.checkCommentOwnership = (req,res, next) => {
    if (req.isAuthenticated()){
        //if so, they can edit
        Comment.findById(req.params.comment_id,(err, comment) => {
            if (err || !comment){
                if (err){
                    console.log(err);
                }
                req.flash("error","Comment not found");
                return res.redirect("back");
            }
            else{
                if (comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that!");
                    return res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that");
        return res.redirect("back");
    }
}

module.exports = middleWareObj;