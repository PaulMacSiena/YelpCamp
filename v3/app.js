const express  = require("express"),
app  = express(),
port = 3000,
parser = require("body-parser"),
mongoose = require("mongoose"),
Campground = require("./models/campground");
Comment = require("./models/comment");

let seedDB = require("./seeds");

seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/yelpcamp', {useNewUrlParser: true});

//schema

app.use(parser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("landing");
})

//INDEX route: show all campgrounds
app.get("/campgrounds", (req,res) => {
    //get all campgrounds for db
    Campground.find({},(err,allCampgrounds) =>{
        if (err){
            console.log(err);
        }
        else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    })
})

//Create route: add new cgs to the db
app.post("/campgrounds", (req, res) =>{
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCG = {
        name: name,
        image: image,
        description: description
    }

    Campground.create(newCG, (err, newlyCreated) =>{
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

// NEW: show form for adding new cgs
app.get("/campgrounds/new", (req, res) =>{
    res.render("new");
});

//SHOW: show info about campgroudn
app.get("/campgrounds/:id", (req,res) =>{
    //find the campground
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if (err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            res.render("show", {cg: foundCampground});
        }
    });
    //render show template
    
})

app.get("*", (req, res) => {
    res.send(`http://localhost:${port}` + req.url + " does not exist on this app");
})

app.listen(port, () => console.log(`YelpCamp App listening on http://localhost:${port}`));