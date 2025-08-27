require('dotenv').config({path:'./src/config/dev.env'});
const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.json());
app.use(userRouter)






app.listen(process.env.PORT , ()=> {
    console.log('server runs in port ',process.env.PORT)
})
