const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//register
router.post("/register" , (req,res,next) =>{

    /* Check if user email already exist*/
    const mobile = req.body.mobile;
    /* Check email of user*/
    User.getUserByMobile(mobile,(err,mobileRes) =>{

    	if(mobileRes)
    	{	
    		res.json({success : false, msg: 'User already exist with the same mobile number'})
    		return;
    	}
        if(typeof req.body.name == 'undefined'){
        	res.json({success : false, msg: 'Name cannot be empty'})
    		return;
        }
        if(typeof req.body.email == 'undefined'){
        	res.json({success : false, msg: 'Email cannot be empty'})
    		return;
        }
        if(typeof req.body.username == 'undefined'){
        	res.json({success : false, msg: 'username cannot be empty'})
    		return;
        }
        if(typeof req.body.password == 'undefined'){
        	res.json({success : false, msg: 'password cannot be empty'})
    		return;
        }
        if(typeof req.body.mobile == 'undefined'){
        	res.json({success : false, msg: 'mobile cannot be empty'})
    		return;
        }
    	let newUser = new User({
		name : req.body.name,
		email : req.body.email,
		username : req.body.username,
		password : req.body.password,
		mobile   : req.body.mobile
	});

	User.addUser(newUser, (err,user) => {
		if(err){
			
			res.json({success: false, msg: err});
		}else{
			/*generated JWT token here*/
			const token = jwt.sign({data:user}, config.secret, {
				 expiresIn:604800 //A week login
			});

			res.json({
				success:true,
				token: 'Bearer '+token,
				success:true, msg: ' User registered successfully!!'
				
			});
			/*res.json({success:true, msg: ' User registered successfully!!'});*/
		}
	});
    });


});

//register
router.post("/authenticate" , (req,res,next) =>{

	const mobile = req.body.mobile;
	const password = req.body.password;  
	User.getUserByMobile(mobile, (err,user)=>{
		if(err){
			throw err;
		}

		if(!user){
			return res.json({success: false, msg : 'User not found'});
		}

		User.comparePassword(password , user.password, (err,isMatch) =>{
			if(err){
			throw err;
		  }
		if(isMatch){
			const token = jwt.sign({data:user}, config.secret, {
				 expiresIn:604800 //A week login
			});
			res.json({
				success:true,
				token: 'Bearer '+token,

				user:{
					id: user._id,
					name: user.name,
					username:user.username,
					email:user.email,
					mobile:user.mobile
				}
			});
		}else{
			return res.json({
				success: false,
				msg:'wrong password'
			});
		}

		});
	});
});	

//register
router.get("/profile" ,passport.authenticate('jwt', {session:false}), (req,res,next) =>{

	res.json(
		{user: req.user}

		);
});

//register
router.get("/validate" , (req,res,next) =>{	

	res.send('validate');
});

module.exports = router;