//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

//TODO
app.get("/", function(req, res){
res.render("home");
});


    app.get("/submit", function(req, res){
      res.render("submit");
      });

 app.route("/register")
 .get(function(req, res){
  res.render("register");
  })
 .post(function(req, res){
  const newUser = new User( {
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
      
    }
  });
  });

  app.route("/login")
  .get(function(req, res){
    res.render("login");
    })
  .post(function(req,res){
    User.findOne(
                  {email: req.body.username}, 
                  function(err, foundUser){
                    if(!err){
                      if(foundUser.password === req.body.password){
                      res.render("secrets");
                    }else{
                      res.send("wrong Password");
                    }
                    }else{
                      console.log(err);
                      
                    }

    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});