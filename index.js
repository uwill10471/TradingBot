import 'dotenv/config'
import express from 'express'


import bodyParser from 'body-parser'
import ejs, { name } from 'ejs'
import path from 'path'
import mongoose from 'mongoose'
import passport from 'passport'
import passportLocalMongoose from 'passport-local-mongoose'
import session from 'express-session'
// import { log } from 'console'
import _ from 'lodash'
import axios from 'axios'
import Alpaca from '@alpacahq/alpaca-trade-api'
import {  calculateEMA,
  calculateSMA,
  calculateStandardDeviation} from "./src/indicators.cjs"
  import { getTodayDate, getYesterdayDate }from './src/date.cjs'
  import stockDataEma from './src/stockData.mjs'

const app = express()

//ejs
app.set('view engine', 'ejs');

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//startic pages
app.use(express.static('public'));

// mongoose connect
mongoose.connect('mongodb://localhost:27017/tradingUserDb')

// creating schema 

const tradingUserSchema = new mongoose.Schema ({
    name:String,
    email: {type: String},
    Password:{type: String}
})




// plugin for passport-local-mongoose 
tradingUserSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

//createing model
const User = new mongoose.model("User",tradingUserSchema)

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      user: user.email,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//const and let for prog
let FullName = ""

const alpaca = new Alpaca({
  keyId: process.env.api_key,
  secretKey: process.env.api_secret,
  paper: true,
})

// const bars = alpaca.getBarsV2("AAPL", {
//   start: "2022-03-25",
//   end: "2022-03-26",
//   timeframe: alpaca.newTimeframe(30, alpaca.timeframeUnit.MIN),
//   limit: 5,
// });

async function getHistoricalData(symbol, startDate, endDate, timeframeUni, timeframeValue, limit) {
  try {
    // Retrieve historical price data using Alpaca's getBarsV2() method
    const bars = alpaca.getBarsV2(symbol, {
      start: startDate,
      end: endDate,
      timeframe: alpaca.newTimeframe(timeframeValue, timeframeUni),
      limit: limit,
    });

    const historicalData = [];
    // Iterate over the bars asynchronously and push them into the historicalData array
    for await (let b of bars) {
      historicalData.push(b);
    }

    return historicalData;
  } catch (error) {
    console.error('Error retrieving historical data:', error);
    throw error;
  }
}


// const got = [];
// for await (let b of bars) {
  
//   got.push(b);
// }
// console.log(got);

let dataDb = stockDataEma("AAPL",15,"MIN")
console.log(dataDb);
//getting bars information 
// const got = [];
// for await (let b of bars) {
  
//   got.push(b.ClosePrice);
// }
// console.log(got);
// const cema = calculateEMA(closepricestra(bars),5)
// console.log(cema);
//   let sum = 0 ;
// let avg = () => {
//   for (let g of got){
  
//     sum =sum + g ;
   
//   }
//   return (sum/got.length)
// }

// console.log(avg());

// // Get today's date
// const todayDate = getTodayDate();

// // Get yesterday's date
// const yesterdayDate = getYesterdayDate();

// // Output today's and yesterday's dates
// console.log("Today's date:", todayDate);
// console.log("Yesterday's date:", yesterdayDate);
// const symbol = 'AAPL'; // Stock symbol
// const qty = 10; // Quantity of shares
// const side = 'buy'; // Order side (buy or sell)
// const type = 'market'; // Order type (market, limit, stop, stop_limit, etc.)

// Submit order
// alpaca.createOrder({
//   symbol: symbol,
//   qty: qty,
//   side: side,
//   type: type,
//   time_in_force: 'day' // Time in force (day, gtc, ioc, fok)
// }).then((order) => {
//   console.log('Order submitted:', order);
// }).catch((err) => {
//   console.error('Error submitting order:', err);
// });
// const go = [];
// for (let g of got){
//   go.push(g);
// }
// console.log(got[0]["HighPrice"]);

// //get account
// alpaca.getAccount().then((account) => {
//   console.log('Current Account:', account)
// })

// //get watchlist
// alpaca.getWatchlists().then((response) => {
//   console.log(response)
// })

//ALPHA VANTAGE API


// const symbol = "TCS";
// const API_KEY = process.env.ALPHA_API_KEY;
// const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;


// //axious getting data from aplha vantage 
// axios.get(apiUrl)
//   .then(response => {
    
//    console.log('Response data:', response.data); // Print the entire response data
//     const timeSeriesData = Object.keys(response.data)["Time Series (Daily)"];
//     console.log(timeSeriesData);
//     if (timeSeriesData) {
//       // Get the latest date
//       const latestDate = Object.keys(timeSeriesData)[0];
//       // Get the data for the latest date
//       const latestData = timeSeriesData[latestDate];
//       console.log('Latest daily data:', latestData);
//     } else {
//       console.error('Time series data not found in the response');
//     }
//   })
//   .catch(error => {
//     console.error('Error fetching data from Alpha Vantage:', error);
//   });
    
//get home 
app.get("/" , (req,res) => {
    if(req.isAuthenticated()){
      
   res.render("home" ,{FullName:_.capitalize(FullName)})
     
    }else{
        console.log("hereerror");
        res.redirect("/login")
    }
    
    
})

//app.get options
app.get("/options",(req,res) => {
  if(req.isAuthenticated()){
    res.render("option")
  }else{
    console.log("option error");
    res.redirect("/about")
  }
})
app.get("/stocks",(req,res) => {
  if(req.isAuthenticated()){
    res.render("stock")
  }else{
    console.log("stock error");
    res.redirect("/about")
  }
})
app.get("/bees",(req,res) => {
  if(req.isAuthenticated()){
    res.render("bees")
  }else{
    console.log("option error");
    res.redirect("/about")
  }
})


app.get("/stocks/ema",(req,res)=>{
  // if(req.isAuthenticated()){
    res.render("Sema")
  // }else{
  //   console.log("option error");
  //   res.redirect("/about")
  // }
})

//register
app.get("/register" , (req,res) => {
   
    res.render("register")
     
})

//Login
app.get("/login" , (req,res) => {
   
    res.render("login")
     
})

//logout
app.get("/logout" ,(req,res) => {
    req.logOut(function(err){
        if(!err){
            res.redirect("/login")
        }else{
            console.log("error");
        }
    })
})

//post login 
app.post("/login", (req,res,next) => {
 

// Fetch data using Mongoose


// Fetch data using Mongoose
User.findOne({ email:req.body.email })
  .then(user => {
    if (!user) {
      console.log("No user found");
      return;
    }

    // Accessing just the value of the "name" key
    const name = user.name;
    console.log("Name:", name);
    FullName = name;
    console.log(FullName);
  })
  .catch(err => {
    console.error("Error occurred:", err);
  });
    const user = new User ({
        username: req.body.email,
        password:req.body.password
    })

    // req.login(user,function(err){
    // //const route = "/login"
    // ///const routeName = "login"
    // //const msg = "There was some error Loging you in , PLEASE TRY AGAIN";
    //     if(err){
            
    //         console.log(err);
    //     }else{
            
    //              passport.authenticate("local")(req,res,function(){
    //             res.redirect("/")
    //         })
    //     }
    // })
    passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect to home route after successful login
      return res.redirect('/');
    });
  })(req, res, next);
})

//post register 

app.post("/register" , (req,res) => {
  //registering 
  
    User.register(({email:req.body.email, name:req.body.Fname}),req.body.password,function(err,user){
 if(err){
     const route = "/register"
     const routeName = "register"
     const msg = "There was some error Registering you , PLEASE TRY AGAIN";
        res.render("modal",{errorMessage:msg , route:route , routeName : routeName})
        console.log(err);
      
    }else{

      //authenticating
       
        passport.authenticate("local")(req,res,function(){

          // Fetch data using Mongoose
              User.findOne({ email:req.body.email })
              .then(user => {
                if (!user) {
                  console.log("No user found");
                  return;
                }

                // Accessing just the value of the "name" key
                const name = user.name;
                console.log("Name:", name);
                FullName = name;
                console.log(FullName);
              })
              .catch(err => {
                console.error("Error occurred:", err);
              });
                  res.redirect("/login")
              })
    }
    })
   
})

app.post("/stocks/ema",(req,res) => {
  let bodyData = req.body.TimeFrame;
  let Tnum = '';
  let Tuni = '';
    for(let i=0 ; i<bodyData.length;i++){
  if(bodyData[i] < '0' || bodyData[i] > '9'){
    Tnum += bodyData[i];
  }else{
    Tuni += bodyData[i];
  }
    
  }
  Tuni =Number(Tuni)
 Tnum = String(Tnum)
 
  console.log(typeof(Tnum));
  console.log(Tnum);
 const symbol = 'AAPL';
 let offsetendDate ;
 let offsetstartDate;

let timeframeUni;
const timeframeValue =Tuni;
const limit = 5;

//making request for historical data offset is the limit of days u want to get data of
if(Tnum === "MIN"){timeframeUni = alpaca.timeframeUnit.MIN; offsetendDate=1;offsetstartDate=2;}
if(Tnum === "Day"){timeframeUni=  alpaca.timeframeUnit.DAY ;offsetendDate=1;offsetstartDate=5;}
if(Tnum === "Hour"){timeframeUni=  alpaca.timeframeUnit.HOUR;offsetendDate=1;offsetstartDate=2;}
if(Tnum === "Week"){timeframeUni=  alpaca.timeframeUnit.WEEK;offsetendDate=1;offsetstartDate=35;}
if(Tnum === "Month"){timeframeUni=  alpaca.timeframeUnit.MONTH;offsetendDate=1;offsetstartDate=155;}
//sending offsetting value 
const startDate = getYesterdayDate(offsetstartDate);
const endDate = getTodayDate(offsetendDate);
// Call the function to get historical data for the specified parameters

getHistoricalData(symbol, startDate, endDate, timeframeUni, timeframeValue, limit)
  .then((historicalData) => {
     console.log('Historical data:', historicalData);
    if(historicalData[3].ClosePrice<historicalData[4].ClosePrice){ //change with real time data

const symbol = 'AAPL'; // Stock symbol
const qty = 10; // Quantity of shares
const side = 'buy'; // Order side (buy or sell)
const type = 'market'; // Order type (market, limit, stop, stop_limit, etc.)

// //Submit order
alpaca.createOrder({
  symbol: symbol,
  qty: qty,
  side: side,
  type: type,
  time_in_force: 'day' // Time in force (day, gtc, ioc, fok)
}).then((order) => {
  console.log('Order submitted:', order);
}).catch((err) => {
  console.error('Error submitting order:', err);
});
    console.log("Performing task...");
    }
     
  })
  .catch((error) => {
    console.error('Error:', error);

});

 





})


//app listen 

app.listen(3000,() => {
    console.log("server started at port 3000");
})



