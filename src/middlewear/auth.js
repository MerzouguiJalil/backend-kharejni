const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or invalid' })
        }

        const token = authHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SIGNATURE)

        console

        const user = await User.findOne({ 
            _id: decoded._id, 
            'tokkens.tokken': token 
        })

        if (!user) {
            return res.status(401).json({ error: 'User not found or token invalid' })
        }

        req.user = user
        req.token = token

        next()
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate ' })
    }
}

module.exports = auth
