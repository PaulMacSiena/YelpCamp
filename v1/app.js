const express = require("express");
const app = express();
const port = 3000;

app.set("view engine","ejs");

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req,res) => {
    let campgrounds = [
        {name: "Salmon Creek",image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"},
        {name: "Granite Hill", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"},
        {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"}
    ]
    res.render("campgrounds", {campgrounds: campgrounds});
})

app.get("*", (req, res) => {
    res.send(`http://localhost:${port}` + req.url + " does not exist on this app");
})
app.listen(port, () => console.log(`YelpCamp App listening on http://localhost:${port}`));