const express  = require("express"),
app  = express(),
port = 3000,
parser = require("body-parser"),
mongoose = require("mongoose"),
passort = require("passport"),
LocalStategy =require("passport-local"),
Campground = require("./models/campground"),
User = require("./models/user"),
Comment = require("./models/comment");

let seedDB = require("./seeds");
const campground = require("./models/campground");
const passport = require("passport");
const { findOneAndDelete } = require("./models/user");

//seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/yelpcamp', {useNewUrlParser: true});

//setup passport
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}))

app.use(passort.initialize());
app.use(passort.session());
passort.use(new LocalStategy(User.authenticate()));
passort.serializeUser(User.serializeUser());
passort.deserializeUser(User.deserializeUser());
//schema

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use(parser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static(__dirname+'/public'));

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

//SHOW: show info about campgroudn
app.get("/campgrounds/:id", (req,res) =>{
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id,(err, campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", (req,res) => {
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

//auth routes
app.get("/register",(req,res) => {
    res.render("register");
})

app.post("/register",isLoggedIn,(req,res) => {
    let newUser = new User({username: req.body.username})
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

app.get("/login",(req,res) => {
    res.render("login");
})

app.post("/login", passort.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res) => {
   //nothing for now 
});

app.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/campgrounds");
})

app.get("*", (req, res) => {
    res.send(`http://localhost:${port}` + req.url + " does not exist on this app");
})

function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(port, () => console.log(`YelpCamp App listening on http://localhost:${port}`));