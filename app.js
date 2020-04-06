

var express = require("express"),
	app= express(),
	bodyParser = require ("body-parser"),
	mongoose = require ("mongoose"),
	passport = require ("passport"),
 	LocalStrategy = require ("passport-local"),
	 passportLocalMongoose = require ("passport-local-mongoose", {useNewUrlParser: true, useUnifiedTopology: true}),
	User = require ("./models/user"),
	seedDB = require ('./seeds');

app.use (bodyParser.urlencoded ({extended:true}));

mongoose.connect('mongodb://localhost/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set ("view engine", "ejs");

app.use (require ("express-session") ({
	secret: "Hello hello one", resave: false, saveUninitialized: false
} ) );

app.use (passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser (User.serializeUser ());
passport.deserializeUser (User.deserializeUser ());
app.use (function (req, res, next) {
	res.locals.currentUser = req.user; 
	next ();
});



// schema 




	
// 	console.log ('======');
// user.findOne ({name : a}, function (err, foundUser) {
// 	foundUser.friends.forEach ( function (id) {
// 		user.findById(id, function (err, friend) {
// 			console.log (friend.name);
// 		});
		
// 	})
	
// });

// 	foundUser.friends.forEach ( function (id) {
// 		console.log (id);
							   
// 							   });
// //	user.incoming.push ();
// });

seedDB();

// User.find ({}, function (err, docs) {

// 	console.log (docs);
// }) 

app.use (express.static('public'));

app.get ("/login", function (req, res) {
		if (req.isAuthenticated ()) {res.redirect ('users');} else 
		 res.render ("login");
		 });

app.get ("/register", function (req, res) {
		 res.render ('register');
		 });

app.post ("/register", function (req, res) {
		 	
			var newUser = new User ({username: req.body.username});
			User.register (newUser, req.body.password, function (err, user) {
				if (err) {console.log (err); return res.render ('register');} else {
					passport.authenticate('local')(req, res, function () {res.redirect ('/users');})
				}
 			}
		  ) 
});

app.post ("/login", passport.authenticate ("local", 
		  {successRedirect: "/users", 
		   failureRedirect: "/login"}),
		  function (req, res) {
	
});

app.get ("/logout", function (req, res) {
		 req.logout ();
		res.redirect ('/login');
		 });

app.get ("/users", isLoggedIn, function (req, res) {
	
		User.find ({}, function (err, users) {


			if (err) {console.log (err);} else {
				res.render ("users", {users:users});
			}
		})
			 
		 });

app.post("/getuser", isLoggedIn, function (req, res) {
	
		var name = req.body.user; 
		var search = {};
		if (name!=='') search = {username: {$regex: new RegExp('^'+name, 'i')}};
		
		User.find(search, function (err, user) {

			if (err) {console.log (err);} else {
				res.render ("users", {users:user});
			}
		})
			 
		 });

app.get ("/friends", isLoggedIn, function (req, res) {
			//console.log (req.user);
			User.find ({}, function (err, users) {

			if (err) {console.log (err);} else {
				res.render ("friends", {users:users});
			}
		}) 
		
			
			// var currentUser = req.user.username;
	
			// User.findOne({username : currentUser}).populate ("friends").exec (function (err, foundUser) {	
			// 	var friends = foundUser.friends;
			// 	console.log (friends);
			// 	res.render ("friends", {friends, friends});
			// 		});
				});


// REQUEST FRIEND

app.post ( '/friends/request/:id', isLoggedIn, function (req, res) {
	var id = req.params.id;
	var currentUser = req.user;
	User.findById (id, function (err, user) {
		currentUser.outgoing.push (user);
		currentUser.save();
		user.incoming.push (currentUser);
		user.save();
		
		res.redirect('/friends');
	});
})


// ACCEPT FRIEND

app.post ( '/friends/accept/:id', isLoggedIn, function (req, res) {
	var id = req.params.id;
	var currentUser = req.user;
	User.findById (id, function (err, user) {
		
		var index1 = currentUser.incoming.indexOf(user._id.toString()),
			index2 = user.outgoing.indexOf(currentUser._id.toString());
		
		currentUser.incoming.splice(index1, 1);
		user.outgoing.splice(index2, 1);
		currentUser.friends.push (user);
		user.friends.push(currentUser);
		currentUser.save();
		user.save();

		
		res.redirect('/friends');
	});
})

// IGNORE FRIEND

app.post ( '/friends/ignore/:id', isLoggedIn, function (req, res) {
	var id = req.params.id;
	var currentUser = req.user;
	User.findById (id, function (err, user) {
		currentUser.ignored.push (user);
		currentUser.save();
		res.redirect('/friends');
	});
})

// CANCEL REQUEST FRIEND

app.post ( '/friends/cancelRequest/:id', isLoggedIn, function (req, res) {
	var id = req.params.id;
	var currentUser = req.user;
	User.findById (id, function (err, user) {
		
		var index1 = currentUser.outgoing.indexOf(user._id.toString()),
			index2 = user.incoming.indexOf(currentUser._id.toString());
		
		currentUser.outgoing.splice(index1, 1);
		user.incoming.splice(index2, 1);
		currentUser.save();
		user.save();		
		res.redirect('/friends');
	});
})


// REMOVE FRIEND

app.post ( '/friends/remove/:id', isLoggedIn, function (req, res) {
	var id = req.params.id;
	var currentUser = req.user;
	User.findById (id, function (err, user) {
		
		var index1 = currentUser.friends.indexOf(user._id.toString()),
			index2 = user.friends.indexOf(currentUser._id.toString());
		
		currentUser.friends.splice(index1, 1);
		user.friends.splice(index2, 1);
		currentUser.save();
		user.save();		
		res.redirect('/friends');
	});
})


app.get ("/*", function (req,res) {res.redirect("/login");})
	
function isLoggedIn (req,res, next) {
	if (req.isAuthenticated ()) {return next();} else res.redirect ('/login');
}
		 
app.listen (3000, function () {console.log ("Server started")} );