const Cart = require('../model/Cart');
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();


//Create

router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch (err) {
        res.status(500).json(err);
    }
})



//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//DELETE
router.delete('/:id',verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findOneAndDelete(req.params.id)
        res.status(200).json('Cart has been deleted');
    }
    catch{
        res.status(500).json(err);
    }
})


//GET Cart
router.get('/find/:userId', verifyTokenAndAuthorization,async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET all product
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    /*const qNew = req.query.new;
    const qCategory = req.query.category;*/
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;
