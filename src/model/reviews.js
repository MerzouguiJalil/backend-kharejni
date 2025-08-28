const { text } = require('express')
const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({

    date : {
        type : String ,
        required : true 
    } , 
    text : {
        type : String ,
        required : true 
    } , 
    owner : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user'
    }
})



const Review = mongoose.model('reviews' , reviewSchema)

module.exports = Review