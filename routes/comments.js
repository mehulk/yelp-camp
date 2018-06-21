var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middlewareObj = require("../middleware");

//Comments
//Create a new comment
router.get("/campgrounds/:id/comments/new",middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
           console.log(err)
        }else{
            res.render("comments/new",{campground:campground})
        }
    })
})

//create a new campground
router.post("/campgrounds/:id/comments",middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            return res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                 if(err){
                        req.flash("error", "Something went wrong");
                        console.log(err);
                 }else{
                      //add username and id to comment
                     comment.author.id = req.user._id;
                     comment.author.username = req.user.username;
                     comment.save();
                     //save comment
                     campground.comments.push(comment);
                     campground.save();
                     req.flash("success", "Successfully added comment");
                     return res.redirect('/campgrounds/' + campground._id);
                 }
            })
    }
})
})

//comment edit form
router.get("/campgrounds/:id/comments/:comment_id/edit",middlewareObj.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, comment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:comment})
        }
    })
})

//comment update
router.put("/campgrounds/:id/comments/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
})

//comment destroy
router.delete("/campgrounds/:id/comments/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           return res.redirect("/campgrounds/" + req.params.id);
       }
    })
})








module.exports = router;