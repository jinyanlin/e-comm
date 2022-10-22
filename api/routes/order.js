const Order = require('../model/Order');
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();
const dotenv = require('dotenv');
const paypal = require('@paypal/checkout-server-sdk');
dotenv.config();
//create paypal enviroment
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

//Create

router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }catch (err) {
        res.status(500).json(err);
    }
})



//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
});

//DELETE
router.delete('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findOneAndDelete(req.params.id)
        res.status(200).json('Order has been deleted');
    }
    catch{
        res.status(500).json(err);
    }
})


//GET user orders
router.get('/find/:userId', verifyTokenAndAuthorization,async (req, res) => {
    try{
        const orders = await Order.findOne({ userId: req.params.userId });
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
})


//paypal order
router.get('/paypal/:userId/',async (req, res) => {
    res.render('paypal', { paypalClientId: process.env.PAYPAL_CLIENT_ID });
    /*try{
        const orders = await Order.findOne({ userId: req.params.userId },{amount:1});
        const total = req.body.items.reduce((sum, item) => {
            return sum + storeItems.get(item.id).price * item.quantity;
        }, 0)
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent:'CAPTURE',
            purchase_units:[{
                amount: {
                    currency_code: 'USD',
                    value: total,
                    breakdown:{
                        item_total: {
                            currency_code: 'USD',
                            value: total
                        }
                    }
                }
            }     
            ]
        });
 
        const createOrder = async function(){
            const response = await paypalClient.execute(request);
            res.json({ id: response.result.id });
        }
        //res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }*/
})


//GET all product
router.get('/', verifyTokenAndAdmin,async (req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET monthly income
router.get('/income', verifyTokenAndAdmin,async (req, res) => {
const date = new Date();
const lastMonth = new Date(date.setMonth(date.getMonth()-1));
const previousMonth = new Date(new Date(date.setMonth(lastMonth.getMonth()-1)));

    try{
        const income = await Order.aggregate([
            {$match: {createdAt: { $gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ])
        res.status(200).json(income);
    }
    catch(err){
        res.status(500).json(err);
    }
})



module.exports = router;
