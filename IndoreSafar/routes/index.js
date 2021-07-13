var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/",function(req,res){
    res.render("landing");
});


//========================================================//
//              AUTH ROUTS                                //
//========================================================//

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
             req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to IndoreSafar " + user.username);
           //res.redirect("/campgrounds"); 
              res.redirect("/places");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        // successRedirect: "/campgrounds",
        successRedirect: "/places",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
//    res.redirect("/campgrounds");
    res.redirect("/places");
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
     req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = router;