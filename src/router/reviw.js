const express = require('express') 
const Review = require('../model/reviews')
const auth = require('../middlewear/auth')


const router = express.Router()


router.post('/reviews' , auth , async (req , res) => {

    try {
        const user = req.user
        const review = new Review({
            ...req.body ,
            owner : user._id
    })

    await review.save()

    res.send(review)
    }catch(e) {
        res.status(404).send()
        console.log(e)
    }
    


})


router.get('/reviews', auth, async (req, res) => {
    const Data = []
  try {
    // Wait for the query
    const reviews = await Review.find({}).populate('owner');

    reviews.forEach(element => {
        const object = {
            id : element._id ,
            text : element.text ,
            date : element.date ,
            email : element.owner.email , 
            name : element.owner.user_name
        }
        Data.push(object)
    });

    res.send(Data); // reviews already have `owner` populated
  } catch (e) {
    console.error(req);
    res.status(500).send();
  }
});


router.patch('/reviews/:id' , auth , async (req , res) => {
    try {

        const updates = Object.keys(req.body);
        const permissions = ['text']
        console.log(updates)

        const isValid = updates.every(key => permissions.includes(key))

        if(! isValid ) {
            return res.status(400).send('good')
        } 

        const review = await Review.findOne({_id : req.params.id , owner : req.user._id})
        if(! review) {
            return res.status(404).send()
        }

        review.text = req.body.text

        await review.save()

        res.send(review)

    }catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.delete('/reviews/:id' , auth , async (req , res) => {
    try {
        const review = await Review.findOne({_id : req.params.id , owner : req.user._id})
        if(! review) {
            return res.status(404).send()
        }
        await Review.deleteOne({_id : review._id})
        res.send(review)

    }catch(e) {

        return res.status(500).send()

    }
})

module.exports = router