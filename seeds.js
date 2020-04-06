var mongoose = require ("mongoose");

var data = [{username: "Bob", password: "123"}, {username: "Jack", password: "321"}, {username: "Groo", password: "321"}];

User = require ("./models/user");

function seedDB () {


User.deleteMany ({}, function (err) {});
	
// User.deleteMany ({}, function (err) {
// 		if (err) {console.log (err);} else 
// 		{
// 				data.forEach( function (seed) {
// 					User.create (seed, function (err, user) {
// 					if (err) {console.log (err);} else 
// 					{
// 						console.log ("new user " + user);
// 						if (data[data.length-1] === seed) {
// 							var to_add = [{username: "Jack"},{username:"Groo"}];
// 							integration ("Bob", to_add);
// 						}
// 					}
// 				});
					
// 					}	 
// 					);		
// 		}
// });

//integration ('Vlad', [{username: 'John'}]);
	
function integration (friend, to_add)  {
	
	User.findOne ({username : friend}, function (err, foundUser) {
	if (err) {console.log (err)} else {
		
		var foundUser = foundUser;	
		
		to_add.forEach ( function (item) {
			User.findOne ({username: item.username}, function (err, user) {
				if (err) {console.log (err);} else {
					foundUser.friends.push (user);	
					if (to_add[to_add.length-1].username === user.username) foundUser.save();
				//console.log ("User " + item + " added to " + foundUser);
				}
				
		}) ;
			});
	}
	});

}
	
}

module.exports = seedDB;