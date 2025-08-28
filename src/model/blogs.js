const { text } = require('express')
const mongoose = require('mongoose')

const blogchema = mongoose.Schema({

    date : {
        type : String ,
        required : true 
    } , 
    title : {
        type : String ,
        required : true 
    } , 
    
    content : {
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
        }]
})



const Blog = mongoose.model('blog' , blogchema)

module.exports = Blog