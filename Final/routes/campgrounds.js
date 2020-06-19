//initialize constants
const express = require("express"),
router = express.Router(),
Campground = require("../models/campground");

//INDEX route: show all campgrounds
router.get("/", (req,res) => {
    //get all campgrounds for db
    Campground.find({},(err,allCampgrounds) =>{
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

//Create route: add new cgs to the db
router.post("/", isLoggedIn, (req, res) =>{
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCG = {
        name: name,
        image: image,
        description: description,
        author: author
    }
    
    Campground.create(newCG, (err, newlyCreated) =>{
        if (err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
})

// NEW: show form for adding new cgs
router.get("/new", isLoggedIn,(req, res) =>{
    res.render("campgrounds/new");
});

//SHOW: show info about campgroudn
router.get("/:id", (req,res) =>{
    //find the campground
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if (err){
            console.log(err);
        }
        else{
            //console.log(foundCampground);
            res.render("campgrounds/show", {cg: foundCampground});
        }
    });
    //render show template
    
})

//middleware for checking authentication/ if user is logged in
function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;  