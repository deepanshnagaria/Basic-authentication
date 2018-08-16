var e= require("express"),bodyparser=require("body-parser"),mongoose=require("mongoose");
var app=e();
var passport= require("passport"),LocalStrategy= require("passport-local"),passportLocalMongoose= require("passport-local-mongoose");
var User= require("./models/user");

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(e.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


app.use(require("express-session")({
	secret: "I,Deepansh Nagaria am the best developer in IIT Roorkee and I made this site for ARIES IITR",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})

app.get("/",function(req,res){
	res.render("welcome");
})

app.get("/secret", isLoggedIn,function(req,res){
	/*res.send("I,Deepansh Nagaria am the best developer in IIT Roorkee and I made this site for ARIES IITR");*/
	res.render("secret");
	/*res.sendFile("D:/bootcamp/auth/views/gallery.html");*/
})

app.get("/register",function(req,res){
	res.render("signup");
})
app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			//console.log(req.body.username);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		})
	})
})
app.get("/login", function(req,res){
	res.render("login");
})
app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"}),function(req,res){

})
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
})
function isLoggedIn(req,res,next){
	//console.log(req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	}
	else
		res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Running");
});
/*app.listen(3000,function(){
	console.log("Running");
});*/