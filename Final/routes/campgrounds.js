//initialize constants
const express = require("express"),
router = express.Router(),
Campground = require("../models/campground"),
middleWareObj = require("../middleware"); //index implicetly referenced

//INDEX route: show all campgrounds
router.get("/", (req,res) => {
    //get all campgrounds for db
    Campground.find({},(err,allCampgrounds) =>{
        if (err){
            console.log(err);
            req.flash("error", "Could not find any campgrounds")
            return res.redirect("back");
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

//Create route: add new cgs to the db
router.post("/", middleWareObj.isLoggedIn, (req, res) =>{
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
            req.flash("error", "Could not create campground");
            return res.redirect("back");
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
})

// NEW: show form for adding new cgs
router.get("/new", middleWareObj.isLoggedIn,(req, res) =>{
    res.render("campgrounds/new");
});

//SHOW: show info about campgroudn
router.get("/:id", (req,res) =>{
    //find the campground
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if (err){
            console.log(err);
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        else{
            //console.log(foundCampground);
            res.render("campgrounds/show", {cg: foundCampground});
        }
    });
    //render show template
    
})

//edit form
router.get("/:id/edit", middleWareObj.checkCampgroundOwnership, (req, res) => {
    //if so, they can edit
    Campground.findById(req.params.id,(err, cg) => {
        if (err){
            console.log(err);
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        res.render("campgrounds/edit",{cg: cg}); 
    })
})

//update campground 
router.put("/:id", middleWareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id,req.body.cg, (err, updatedCG) => {
        if(err){
            req.flash("error","Campground not found");
            return res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//destroy cg
router.delete("/:id", middleWareObj.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err){
            console.log(err);
            req.flash("error","Could not delete campground");
        }
        return res.redirect("/campgrounds");
    })
})

module.exports = router;  