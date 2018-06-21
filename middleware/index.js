var Campground = require("../models/Campground");
var Comment = require("../models/Comment");

var middlewareObj = {
}

//middleware function
middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("/login")
    }
}

//middleware for authorization
middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error", "Comment not found");
                return res.redirect("back")
            }
            else{
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("back");
    }
}


//middleware for authorization
middlewareObj.checkOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                return res.redirect("back")
            }
            else{
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    return res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("back");
    }
}

module.exports = middlewareObj;