var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var methodOverride = require("method-override");
var flash          = require("connect-flash");
var Campground     = require("./models/Campground");
var seedDB         = require("./seed");
var Comment        = require("./models/Comment");
var passport       = require("passport");
var localStrategy  = require("passport-local");
var User           = require("./models/User");   

var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

var urldb = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";   

//mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://mkan:naughty29@ds161790.mlab.com:61790/yelp_campdb");
mongoose.connect(urldb);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())

//seedDB(); //seed the campgrounds

app.use(require("express-session")
({
    secret:"Yelp Camp",
    resave : false,
    saveUninitalized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(commentsRoutes);
app.use(campgroundRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});