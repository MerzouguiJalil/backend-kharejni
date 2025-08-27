const { default: mongoose } = require("mongoose");
const { type } = require("os");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    user_name : {
        type : String , 
        required : true , 
        trim : true ,
        uniq : true 
    } ,
    email : {
        type : String , 
        required : true , 
        trim : true ,
        uniq : true 
    } , 
    password : {
        type : String , 
        required : true , 
        minlength: 7
    } , 
    tokkens : [ {tokken : {
            type : String ,
            
        }}]
       
    
})

userSchema.pre('save', async function (next) {
  const user = this; // current document

  // Only hash if password is modified/created
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next(); // continue
});


userSchema.methods.generateAuthToken = async function() {
    const user = this 
    const token = jwt.sign({_id : user._id} , process.env.SIGNATURE)

    user.tokkens = user.tokkens.concat({tokken :token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
userSchema.statics.findByCredential = async function (email, password) {

  const user = await User.findOne({ email }); // "this" refers to the model
  if (!user) {
    throw new Error('Unable to login: email not found');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error('Unable to login: wrong password');
  }

  return user;
}

const User = mongoose.model('user' , userSchema)

module.exports = User
