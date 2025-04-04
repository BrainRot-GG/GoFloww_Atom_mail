const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
const express=require('express')
const app=express() 
const path=require('path')
const userModel=require("./user-model.js")   
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myapp');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")

app.get("/",async(req,res)=>{
    res.render("sign-up")
})
app.post("/create",async(req,res)=>{
    let{name,email,phone,password}=req.body;
    bcrypt.genSalt(10,(err,Salt)=>{
        bcrypt.hash(password,Salt,async(err,hash)=>{
            let created_user=await userModel.create({
                name,
                email,
                phone,
                password:hash
            })
            let token=jwt.sign({email},"store")
            res.cookie("token",token)
            res.redirect("login")
        })
    })
})
app.get("/login",async(req,res)=>{
    res.render("login")
})
app.post("/login",async(req,res)=>{
    let check_user=await userModel.findOne({email:req.body.email})
    if(!check_user){
        res.status(400).send("User not exists")
    }
    bcrypt.compare(req.body.password,check_user.password,(err,result)=>{
        if(err){
            res.status(400).send("Comparison Error")
        }
        if(result){
            let token=jwt.sign({email:check_user.email},"store")
            res.cookie("token",token)
            res.redirect("/profile")
        }
        else{
            res.status(400).send("Something wrong")
        }
    })
})
app.get("/profile",async(req,res)=>{
    res.render("profile")
})
app.post("/generate-email",async(req,res)=>{
    const {prompt}=req.body
    const entry=`generate emotional ${prompt}`;
    const result=await model.generateContent(entry);
    res.send(result.response.candidates[0].content.parts[0].text)
  })
app.get("/logout",async(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})
app.listen(5000);