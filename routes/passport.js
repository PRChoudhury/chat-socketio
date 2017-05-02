//var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var usermodel = require('../models/userModel');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'thisisverydifficult';

//token ;
module.exports = function(app,passport){



app.use(passport.initialize());
app.use(passport.session());

app.use(session({
	secret: 'mysecret',
	saveUninitialized:true,
	resave:false,
  cookie: { secure: false }

}));

passport.serializeUser(function(user, done) {
  //console.log(user+">>>>>>>>>>>>>>>");
  //token = jwt.sign({username : user.name , email:user.email},secret,{expiresIn:'24h'});
  //console.log(token+"*****************");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  	usermodel.getuserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: '1934688693419343',
    clientSecret: '81c9d622041d9b81000dff295aef9cbc',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    function(accessToken, refreshToken, profile, done) {
            usermodel.findOne({ email: profile._json.email }).select('name active pass email').exec(function(err, user) {
                if (err) done(err);

                if (user && user !== null) {
                 // console.log(user);
                 token = jwt.sign({username : user.name , email:user.email},secret,{expiresIn:'24h'});
                    done(null, user);
                } else if(user == null){

          // If user email not found in our database . We will register an account with Facebook details
                    var user = new usermodel({
                      email : profile._json.email,
                      name : profile._json.name,
                      temporarytoken : "false",
                      active : true,
                      imageProfile : "emptyPic.jpg"
                  });
                    user.save(function(err){
                      if(err) done(err);
                      // console.log(user);
                      token = jwt.sign({username : user.name , email:user.email},secret,{expiresIn:'24h'});
                      done(null , user);
                       
                   });
                    
                }//end else if
          });
      }
));




// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '1034399893339-28berkvh4rje0i7i13otr9gakhqmr8ic.apps.googleusercontent.com',
    clientSecret: '4k5v2HoUaKbo_7o2F5WZUwbj',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    //console.log(profile.emails[0].value);

   usermodel.findOne({ email: profile.emails[0].value}).select('name active pass email').exec(function(err, user) {
                if (err) done(err);

                if (user && user !== null) {
                 // console.log(user);
                 token = jwt.sign({username : user.name , email:user.email},secret,{expiresIn:'24h'});
                    done(null, user);
                } else if(user == null){

          // If user email not found in our database . We will register an account with Facebook details
                    var user = new usermodel({
                      email : profile.emails[0].value,
                      name : profile._json.displayName,
                      temporarytoken : "false",
                      active : true,
                      imageProfile : "emptyPic.jpg"
                  });
                    user.save(function(err){
                      if(err) done(err);
                      // console.log(user);
                      token = jwt.sign({username : user.name , email:user.email},secret,{expiresIn:'24h'});
                      done(null , user);
                       
                   });
                    
                }//end else if
          });
          
  }
));


app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','profile','email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),  function(req, res) {
    res.redirect('/google/' +token);
  });



  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {

        res.redirect('/facebook/' + token); // Redirect user with newly assigned token
    });
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));


return passport;


};