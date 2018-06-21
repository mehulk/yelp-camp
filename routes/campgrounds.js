var express = require("express");
var router  = express.Router();
var Campground = require("../models/Campground");
var middlewareObj = require("../middleware");

//landing page
router.get("/",function(req,res){
    res.render("landing");
});

//index-shows all campgrounds
router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
    if(err){
        console.log(err)
    }
    else{
    res.render("campgrounds/index",{campgrounds:allcampgrounds});
    }
})
});

//create-add new campground
router.post("/campgrounds",middlewareObj.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id :req.user._id,
        username : req.user.username
    }
    var campObj={name:name,price:price,image:image , description:desc,author:author};
    Campground.create(campObj,function(err, Camp) {
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});


//new-create a new campground
router.get("/campgrounds/new",middlewareObj.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//show-shows a particular campground
router.get("/campgrounds/:id",function(req,res){
    var Id=req.params.id;
    Campground.findById(Id).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:campground});
        }
    });
})

//edit-shows the edit form
router.get("/campgrounds/:id/edit",middlewareObj.checkOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.render("campgrounds/edit",{campground:campground});
        }
    })
    
})

//update-update the campground
router.put("/campgrounds/:id",middlewareObj.checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
         if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    })
})

//destroy-delete the campground
router.delete("/campgrounds/:id",middlewareObj.checkOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
    })
})


module.exports = router;