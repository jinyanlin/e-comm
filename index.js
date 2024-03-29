const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const ejs = require('ejs');
const { json } = require('body-parser');
//create paypal enviroment
const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

dotenv.config();
app.use(express.static('public'));  //can style.css in public be use
app.use(express.json());
app.set('view engine','ejs');
app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/products',productRoute);
app.use('/api/orders',orderRoute);
app.use('/api/carts',cartRoute);
app.post('api/orders/paypal/:userId')

//connect mongodb
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then((result)=> console.log('connect to db') & app.listen(3000)) 
        .catch((err)=> console.log(err));

