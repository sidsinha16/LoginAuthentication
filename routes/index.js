var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',userAuth,function(req, res, next) {
  res.render('index', { title: 'member' });
});

function userAuth(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
