const express  = require("express"),
app  = express(),
port = 3000,
parser = require("body-parser"),
mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/yelpcamp', {useNewUrlParser: true});

//schema

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);


app.use(parser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req,res) => {
    //get all campgrounds for db
    Campground.find({},(err,allCampgrounds) =>{
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    })
})

app.post("/campgrounds", (req, res) =>{
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image
    let newCG = {
        name: name,
        image: image
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

app.get("/campgrounds/new", (req, res) =>{
    res.render("new");
});

app.get("*", (req, res) => {
    res.send(`http://localhost:${port}` + req.url + " does not exist on this app");
})

app.listen(port, () => console.log(`YelpCamp App listening on http://localhost:${port}`));