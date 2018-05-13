var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
const { body } = require('express-validator/check');
var passport = require('passport');
var passportStrategy = require('passport-local').Strategy;


var Users = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'register'});
});

router.get('/login', function(req,res,next){
	res.render('login',{title:'login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect: '/users/login',failureFlash:'username or Passowrd don\'t match'}),
  function(req, res) {
    req.flash('success','You are successfully Logged In');
    res.redirect('/');
  });

passport.use(new passportStrategy(function(username, password ,done){
  Users.getUserName(username,function(err,user){
    console.log("1");
    if(err) throw err;
    else{
      if(!user){
        return done(null,false,{message:'Invalid Username'});
      }
      Users.comparePassword(password,user.password,function(err,isMatched){
        console.log("2");
        if(err) return done(err);
        if(isMatched){
          return done(null,user);
        }else{
          return done(null,false,{messgae:'Passowrd dont matched'});
        }
      });
    }
  });
}));

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
  Users.getUserById(id, function(err, user){
    done(err,user);
  });
});


router.post('/register',upload.single('images') ,function(req, res, next) {
  var name = req.body.name;  
  var email = req.body.email;  
  var username = req.body.username;  
  var password = req.body.password;  
  var file = req.file;
  if(file){
  	var images = req.file.filename;
  }else{
    var images = 'NoIage.png';
  }
var newUser = new Users({
  name:name,
  email:email,
  username:username,
  password:password,
  images:images
});
Users.createUser(newUser,function(err,createNewUser){
  if(err){
    throw err;
  }else{
    req.flash('success','You are successfully Registerd');
    res.location('/');
    res.redirect('/');
  }
})
});

router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are successfuly Logged Out');
  res.redirect('/users/login');
})

module.exports = router;
