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
    } , 
    likesNb : {
        type : Number , 
        default : 0
    } , 
    people : [{
        person : {
            type : mongoose.Schema.Types.ObjectId , 
            required : true
        }
    }] , 
    comments : [{
        comment : {
            type : String ,
            required : true 
        } ,
        comment_owner : {
            type : mongoose.Schema.Types.ObjectId , 
            required : true , 
            ref : 'user'
        } , 
        date : {
            type : String ,
        }
    }]
})



const Review = mongoose.model('reviews' , reviewSchema)

module.exports = Review