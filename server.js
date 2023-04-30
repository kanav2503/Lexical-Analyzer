const express=require('express')
const connectDb = require("./config/dbConnection");
const bodyParser=require('body-parser')
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const { findByIdAndUpdate } = require('./models/user')

const user = require('./models/user')
const code = require('./models/code');
const { resolveSoa } = require('dns/promises');
connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.get('/test',(req,res)=>{
    res.render('home');
})
app.get('/',(req,res)=>{
    res.render('singup');
})
app.post('/singup',async(req,res)=>{
    const password=req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const u = new user(
    {
        email:req.body.email,
        password:hashedPassword
    });
    const email=req.body.email;

    const k = await user.findOne({email});
   
    if(k){
        res.send('user already exist')
        return;
    }
    else{
        u.save();

        const ress=await code.find();

   
        res.render('home',{data:ress});=    
    }

    
})
app.post('/login',async (req,res)=>{
    
    const password=req.body.password;
 
    const email=req.body.email;

    const k = await user.findOne({email});

    if(k && await bcrypt.compare(password, k.password)){
        const ress=await code.find();

   
         res.render('home',{data:ress});
    }
    else{
       
        res.send('nohehe')
    }
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/output',async(req,res)=>{
    let lexr = require('lexr');
let tokenizer = new lexr.Tokenizer("Javascript");
tokenizer.setErrTok("DIFF_ERROR");
let input = req.body.code;
const k = new code(
    {
        data:req.body.code
       
    });
k.save();
let output = await tokenizer.tokenize(input);
const {parse,generate}= require('abstract-syntax-tree')


    res.render('output',{data:output});
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
