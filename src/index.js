require('dotenv').config({path:'./src/config/dev.env'});
const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const reviewRouter = require('./router/reviw')
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.json());
app.use(userRouter)
app.use(reviewRouter)






app.listen(process.env.PORT , ()=> {
    console.log('server runs in port ',process.env.PORT)
})
