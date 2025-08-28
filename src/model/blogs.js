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
    }
})



const Blog = mongoose.model('blog' , blogchema)

module.exports = Blog