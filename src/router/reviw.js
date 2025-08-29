const express = require('express') 
const Review = require('../model/reviews')
const auth = require('../middlewear/auth')


const router = express.Router()


router.post('/reviews' , auth , async (req , res) => {

    try {
        const user = req.user
        const review = new Review({
            ...req.body ,
            owner : user._id ,
            likesNb : 0 ,
            people : []
    })

    await review.save()

    res.send(review)
    }catch(e) {
        res.status(404).send()
        console.log(e)
    }
    


})

router.patch('/reviews/likes/:id', auth, async (req, res) => {
    try {
        const op = req.body.op
        const pub = await Review.findById(req.params.id)

        if (!pub) {
            return res.status(404).send({ error: "Review not found" })
        }

        if (op === 'inc') {
            // check if user already liked
            const notLikedYet = pub.people.every(p => p.person.toString() !== req.user._id.toString())

            if (notLikedYet) {
                pub.likesNb++
                pub.people.push({ person: req.user._id })
                await pub.save()
                return res.send(pub)
            } else {
                throw new Error('Already liked')
            }

        } else if (op === 'dec') {
            // check if user has liked
            const hasLiked = pub.people.some(p => p.person.toString() === req.user._id.toString())

            if (hasLiked) {
                pub.likesNb--
                pub.people = pub.people.filter(p => p.person.toString() !== req.user._id.toString())
                await pub.save()
                return res.send(pub)
            } else {
                throw new Error('You have not liked this')
            }

        } else {
            throw new Error('Invalid operation')
        }

    } catch (e) {
        console.log(e.message)
        res.status(400).send({ error: e.message })
    }
})



router.get('/reviews',auth , async (req, res) => {
    const Data = []
  try {
    // Wait for the query
    const reviews = await Review.find({}).populate('owner');

    reviews.forEach(element => {
        const notclicked = element.people.every(p => p.person.toString() !== req.user._id.toString())
        const object = {
            id : element._id ,
            text : element.text ,
            date : element.date ,
            email : element.owner.email , 
            name : element.owner.user_name ,
            likesNb : element.likesNb ,
            clicked : ! notclicked
        }
        Data.push(object)
    });

    res.send(Data); // reviews already have `owner` populated
  } catch (e) {
    console.error(e);
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


router.post('/reviews/comment/:id' , auth , async (req , res) => {
    try {
        const pub = await Review.findOne({_id : req.params.id})
        if( ! pub) {
            return res.status(404).send()
        }

        pub.comments = pub.comments.concat({...req.body,comment_owner : req.user._id })
        await pub.save()
        res.send(pub)

    }catch(e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/reviews/comment/:id' , auth , async (req , res) => {
    try {
        const pub = await Review.findOne({_id : req.params.id})
        if( ! pub) {
            return res.status(404).send()
        }

        await pub.populate('comments.comment_owner')
        res.send(pub.comments)

    }catch(e) {

        res.status(500).send()
        console.log(e)
    }
})

router.patch('/reviews/comment/:idp/:idc', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const permissions = ['comment', 'date'];

        const isValid = updates.every(key => permissions.includes(key));
        if(!isValid) return res.status(400).send('Invalid updates');

        const pub = await Review.findById(req.params.idp);
        if(!pub) return res.status(404).send('Review not found');

        let indexc = -1;
        pub.comments.forEach((element, index) => {
            if(element.comment_owner.toString() === req.params.idc) {
                indexc = index;
            }
        });


        if(indexc === -1) return res.status(404).send('Comment not found');

        if( pub.comments[indexc].comment_owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('You are not allowed to update this comment');
        }

        pub.comments[indexc].comment = req.body.comment;
        pub.comments[indexc].date = req.body.date;

        await pub.save();
        res.send(pub);

    } catch(e) {
        console.log(e);
        res.status(500).send('Server error');
    }
});




module.exports = router