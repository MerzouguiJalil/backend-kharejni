const express = require('express') 
const Blog = require('../model/blogs')
const auth = require('../middlewear/auth')


const router = express.Router()


router.post('/blogs' , auth , async (req , res) => {

    try {
        const user = req.user
        const blog = new Blog({
            ...req.body ,
            owner : user._id
    })

    await blog.save()

    res.send(blog)
    }catch(e) {
        res.status(404).send('bata')
        console.log(e)
    }
    


})


router.get('/blogs', auth, async (req, res) => {
    const Data = []
  try {
    // Wait for the query
    const blogs = await Blog.find({}).populate('owner');

    blogs.forEach(element => {
        const notclicked = element.people.every(p => p.person.toString() !== req.user._id.toString())
        const object = {
            id : element._id ,
            title : element.title ,
            content : element.content ,
            date : element.date ,
            email : element.owner.email , 
            author : element.owner.user_name ,
            likesNb : element.likesNb ,
            clicked : ! notclicked
        }
        Data.push(object)
    });

    res.send(Data); // blogs already have `owner` populated
  } catch (e) {
    console.error(req);
    res.status(500).send();
  }
});


router.patch('/blogs/:id' , auth , async (req , res) => {
    try {

        const updates = Object.keys(req.body);
        const permissions = ['text']
        console.log(updates)

        const isValid = updates.every(key => permissions.includes(key))

        if(! isValid ) {
            return res.status(400).send('good')
        } 

        const blog = await Blog.findOne({_id : req.params.id , owner : req.user._id})
        if(! blog) {
            return res.status(404).send()
        }

        updates.forEach(key => blog[key] = req.body[key])

        await blog.save()

        res.send(blog)

    }catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.patch('/blogs/likes/:id', auth, async (req, res) => {
    try {
        const op = req.body.op
        const pub = await Blog.findById(req.params.id)

        if (!pub) {
            return res.status(404).send({ error: "blog not found" })
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


router.delete('/blogs/:id' , auth , async (req , res) => {
    try {
        const blog = await Blog.findOne({_id : req.params.id , owner : req.user._id})
        if(! blog) {
            return res.status(404).send()
        }
        await Blog.deleteOne({_id : blog._id})
        res.send(blog)

    }catch(e) {

        return res.status(500).send()

    }
})

module.exports = router