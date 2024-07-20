const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// require('dotenv').config()
dotenv.config()
const db = require('./dataBaseConfig.js')
const productRoute = require('./routes/productRoute.js')
const adminRoute = require('./routes/adminRoute.js')
const cartRoute = require('./routes/cartRoute.js')
const clientRoute = require('./routes/clientRoute.js')
const session = require('express-session')
const authRoute=require('./authRoute.js')
const passport=require('passport')
// const paymentRoute= require('./routes/paymentRoute.js')


let app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('uploads'))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));


db.connect((err)=>{
    if(err) throw err
    else{
        console.log("database connected")
    }
})


let productTableQuery = `
CREATE TABLE IF NOT EXISTS product (
    id INT NOT NULL AUTO_INCREMENT,
    productBrand VARCHAR(255) NULL,
    productType VARCHAR(255) NULL,
    productPrice VARCHAR(255) NULL,
    productRating VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    PRIMARY KEY (id));
`

db.query(productTableQuery, (err, result)=>{
    if(err) throw err
    else{
        console.log("product table created successfull")
    }
})
let cartTableQuery = `
CREATE TABLE IF NOT EXISTS CART (
    id INT NOT NULL AUTO_INCREMENT,
    productBrand VARCHAR(255) NULL,
    productType VARCHAR(255) NULL,
    productPrice VARCHAR(255) NULL,
    productRating VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    PRIMARY KEY (id));
`

db.query(cartTableQuery, (err, result)=>{
    if(err) throw err
    else{
        console.log("CART table created successfull")
    }
})
let clientTableQuery = `
CREATE TABLE IF NOT EXISTS clientData (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    PRIMARY KEY (id));
`

db.query(clientTableQuery, (err, result)=>{
    if(err) throw err
    else{
        console.log("client table created successfull")
    }
})


app.use('/api', productRoute)

app.use('/api', adminRoute)

app.use('/api', cartRoute)

app.use('/api', clientRoute)
// app.use('/api', paymentRoute)

app.use('/auth',authRoute);


app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT, ()=>{
    console.log(`server is runing ${process.env.PORT}`)
})
