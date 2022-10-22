const Order = require('../model/Order');
const orders = await Order.findOne({ userId: req.params.userId });
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
/*app.post('/create-order', async (req,res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    const total = req.body.items.reduce((sum, item) => {
        return sum + storeItems.get(item.id).price * item.quantity;
    }, 0)
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units:[
            {
                amount: {
                    currency_code: 'USD',
                    value: total,
                    breakdown:{
                        item_total: {
                            currency_code: 'USD',
                            value: total
                        }
                    }
                },
                items: req.body.items.map(item => {
                    const storeItem = storeItems.get(item.id)
                    return {
                        name: storeItem.name,
                        unit_amount: {
                            currency_code: 'USD',
                            value: storeItem.price
                        },
                        quantity: item.quantity
                    }
                })
            }
        ]
    })
    try{
        const order = await paypalClient.execute(request);
        res.json({id: order.result.id});
    }catch(e){
        res.status(500).json( {error: e.message});
    }
})
*/