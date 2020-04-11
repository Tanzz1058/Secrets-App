require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userschema = new mongoose.Schema({
  email : String,
  password : String
});

userschema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ['password']});

const User = new mongoose.model('User', userschema);

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/',(req, res) =>{
  res.render('home');
})
app.get('/login',(req, res) =>{
  res.render('login');
})
app.get('/register',(req, res) =>{
  res.render('register');
})

app.post('/register',(req, res) =>{
  const user = new User({
    email : req.body.username,
    password : req.body.password
  });
  user.save((err) =>{
    if(!err){
      res.render('secrets');
    }
    else{
      console.log(err);
    }
  });
});

app.post('/login',(req, res) =>{
  const name = req.body.username;
  const password = req.body.password;

  User.findOne({email : name}, (err, foundItem) =>{
    if(!err){
      if(foundItem.password === password){
        res.render('secrets');
      }
    }
  })
});

app.listen(3000,() =>{
  console.log('server is running on port 3000');
})
