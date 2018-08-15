var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");   

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE - add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var campName = req.body.campName;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }    
    var newCampGround = {name : campName,price: price, image: image, description: description, author: author};
    Campground.create(newCampGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            
            
            res.redirect("/campgrounds");
    
        }
    })
});

// SHOW -  show more info about the specific campground
router.get("/:id", function(req, res){

    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            // render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        }

    });
    
});

// EDIT campgroud routes
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.render("back");
        } else {    
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
   
});

// UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect to show page
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});






module.exports = router;