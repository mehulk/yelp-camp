var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/User")

//Auth routes

//register
router.get("/register",function(req, res) {
    res.render("register");
})

//post-register
router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            return res.redirect("/campgrounds");
        })
    })
})

//login form
router.get("/login",function(req, res) {
    res.render("login");
})

//handle login request
router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){})


//logout request
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    return res.redirect("/campgrounds")
})



module.exports = router;