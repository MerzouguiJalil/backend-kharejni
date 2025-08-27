const express = require('express')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const auth = require('../middlewear/auth')

const router = express.Router()



router.post('/Signup',async (req , res) => {
    try {
        const user = new User(req.body)
        await user.save()

        const tokken = await user.generateAuthToken()
        console.log('saved success')    
        res.status(202).send({user , tokken})
    }catch(e) {
        res.status(500).send()
        console.log(e)
    }
    
})

router.post('/login' , async (req , res) => {
    try {
        const user = await User.findByCredential(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.send({user , token})
    }catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/logout' ,auth , async (req , res) => {
    try {

        const tokken = req.tokken
        const user = req.user

        user.tokkens = user.tokkens.filter((element) => element.tokken != tokken) 
        await user.save()
        res.status(200).send()

    }catch (e) {
        res.send(500).send()
        console.log(e)
    }
})

router.get('/admin' , async (req , res) => {
    res.send(await User.find({}))
})
module.exports = router