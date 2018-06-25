//require 
var express= require('express'),
app= express();
var bodyParser= require('body-parser');
var mongoose= require('mongoose');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/jobportal');

//setting public directory
app.use(express.static('public'));

//using body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//creating model for registration
var User= mongoose.model('User',{	
	username:{
		type: String,
		required:[true, 'Username required!']
	},
	email:{
		type: String,
		required:[true, 'email required!']
	},
	password:{
		type: String,
		required:[true, 'password required!']
	},
	location:{
		type: String
	},
	usertype:{
		type: String,
		required:[true, 'usertype required']
	}
});

//creating model for posting jobs
var Job= mongoose.model('Job',{
	title:{
		type: String,
		required:[true, 'Job Title required']
	},
	desc:{
		type: String,
		required: [true, 'Description required']
	},
	keyword:{
		type: String,
		required: [true, 'Keywords required']
	},
	location:{
		type: String,
		required: [true, 'Job Location required']
	}
});

//schema for user jobs where applied and saved jobs can be stored
var user_jobs= mongoose.model('user_jobs',{
	userId:{
		type: String,
		required: [true, 'userid required']
	},
	jobId:{
		type: String,
		required:[true, 'jobId required']
	},
	status:{
		applied:{
			type: Boolean,
			required:[true, 'applied jobs required']
		},
		saved:{
			type: Boolean,
			required:[true, 'saved jobs are required']
		}
	}
});

//saving data when user registers
app.post('/register', function(req, res){
	console.log(req.body);
	var newUser = new User(req.body);
	newUser.save().then((doc)=>{
		res.json({
			success: true,
			msg: "Registration successful"
		});
	}).catch((error)=>{
		res.json({
			success: false,
			msg:"Registration failed!"
		});
	});
});

//authenticating login
app.post('/authenticate', function(req, res){
	console.log(req.body);
	User.findOne({username: req.body.username})
	.then((doc) => {
		if (doc.length == 0) {
			console.log("no user found");
			res.json({
				flg: false,
				username: null
			});
		} else {
			if (doc.password == req.body.password) {
				console.log("record found");
				res.json({
					flg: true,
					docs: doc
				});
			} else {
				console.log("record not match");
				res.json({
					flg: false,
					username: null
				});
			}
		}
	}).catch((err) => {
		console.log("Error", err);
	});
});
//checking whether user logged in or not
app.get('/check_usr_status', function(req, res){
	res.send({
		isLoggedIn: true
	});
});

//posting jobs
app.post('/post', function(req, res){
	console.log(req.body);
	var newPost= new Job(req.body);

	newPost.save().then((doc)=>{
		console.log(doc);
		res.json({
			success: true,
			msg: 'Posted Successfully!!!'
		});
	}).catch((err)=>{
		res.json({
			success: false,
			msg: 'Failed to post!'
		});
	});
});

//getting jobposts
app.get('/jobposts', function(req, res){
	console.log('I recieved a GET request!');
	Job.find({}, function(err, docs){
		if(!err){
			res.json(docs);
		}
	});
});

//search
// app.post('/search', function(req,res){
// 	console.log('I recieved a post request!!!');
// 	Job.find({}, function(err, docs){
// 		if(!err){
// 			res.josn(docs);
// 		}
// 	});

// })

//logout
// app.get('/logout', function(req, res){
// 	res.send({
// 		isLoggedIn: flase
// 	});
// });

//setting path to home page
app.get('/', function(){
	res.sendFile(__dirname+'/index.html');
});

app.listen(3000, function(){
	console.log('server running @ localhost:3000');
});