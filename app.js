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
const Email = require("./email-model.js");
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

function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    try {
        const decoded = jwt.verify(token, "store");
        req.userEmail = decoded.email;
        next();
    } catch (err) {
        return res.redirect("/login");
    }
}

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
app.get("/dashboard",async(req,res)=>{
    res.render("dashboard")
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
const LOCAL_USER = "hello@example.com";

app.get("/compose", requireAuth, (req, res) => {
    res.render("compose", { from: LOCAL_USER });
});

// Send Email (POST)
app.post("/compose", requireAuth, async (req, res) => {
    const { to, subject, body } = req.body;
    await Email.create({
        from: LOCAL_USER,
        to,
        subject,
        body,
        sentAt: new Date()
    });
    res.redirect("/inbox");
});
app.post('/send', requireAuth, async (req, res) => {
    const { to, subject, body } = req.body;

    try {
        const fromUser = await userModel.findOne({ email: req.userEmail });
        const toUser = await userModel.findOne({ email: to });

        if (!fromUser || !toUser) {
            return res.status(400).send("One or both users not found.");
        }
        const email = new Email({
            from: fromUser._id,
            to: toUser._id,
            subject,
            body,
            isDraft: false,
            sentAt: new Date()
        });

        await email.save();
        res.redirect("/inbox");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

  
  app.get("/inbox", requireAuth, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.userEmail });
        if (!user) return res.status(404).send("User not found");

        const emails = await Email.find({ to: user._id }).populate("from", "email").populate("to", "email");
        res.render("inbox", { emails });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.listen(3000);