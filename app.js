const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {pool} = require('./dbConfig')

const path = require('path');

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname, +'./public'))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')


const PORT = process.env.PORT || 4000;

function validUser(user){
  const validEmail = typeof user.email === 'string' && user.email.trim() !== '';
  const validPassword = typeof user.password === 'string' && user.password.trim() !== ''
  user.password.trim().length >=6;
  
  return validEmail && validPassword;
}

app.get('/', (req,res) => {
  res.render('index.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
})

app.get('/home', (req,res) => {
  res.render('home.ejs');
})

app.post('/', async (req, res) => {
  const {email, password} = req.body;
  const user = {
    email,
    password
  }
  if(validUser(user)){
    const hashedPassword = await bcrypt.hash(user.password, 10);

    pool.query(
      `SELECT * FROM usuarios where email = $1`, [user.email], (err, results) => {
        if(err){
          throw err;
        }
        console.log(results.rows);
      }
    )
  }else{
    res.json({message:"Invalid informations"})
  }
})



app.get('/register', (req, res) => {
  res.render('register.ejs', {})
})


app.listen(PORT);