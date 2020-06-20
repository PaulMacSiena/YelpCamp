const express = require("express"),
      app  = express(),
      port = 3000,
      parser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      User = require("./models/user"),
      methodOverride = require("method-override"),
      LocalStategy =require("passport-local");

//set up routers
const indexRoutes = require("./routes/index"),
      commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds");
      

//seed initial data
// const seedDB = require("./seeds");
// seedDB();
app.set("view engine","ejs");

//set up parser
app.use(parser.urlencoded({extended: true}));

//set up dir for css and extra js
app.use(express.static(__dirname+'/public'));

//method override for put and delete requests
app.use(methodOverride("_method"));

//configure mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelpcamp', {useNewUrlParser: true});

//setup express session and passo
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}))

//initalize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//make currentUser available to all responses
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

//set up routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.get("*", (req, res) => {
    res.send(`http://localhost:${port}` + req.url + " does not exist on this app");
})

//listen on port 3000
app.listen(port, () => console.log(`YelpCamp App listening on http://localhost:${port}`));