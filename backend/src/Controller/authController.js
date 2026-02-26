const bcrypt = require('bcrypt');
const User = require("../Model/userModel");
const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');

const registerUser = async(req ,res) => {
    try{
            const {firstName , lastName , email , password , contactNo , gender} = req.body;

    const existingUser = await User.findOne({email : email});
    if(existingUser){
        return res.status(400).json({message : "User already Register"});
    }
    const hashedPassword =  await bcrypt.hash(password , 10);

    const user = await userModel.create({
        firstName : firstName,
        lastName : lastName,
        email : email,
        contactNo : contactNo,
        password : hashedPassword,
        gender : gender,
    })

    res.status(200).json({message : "User Registered Successfully"});
    
    }
    catch(err) {
        console.log(err);
        
    res.status(500).json({message : "Somthing went Wrong ~~~~"});
}

}

const loginUser = async(req ,res) => {
    try {
            const {email , password} = req.body;
           console.log(req.body);
    const user = await User.findOne({email : email});
    console.log(user);
    
    if(!user){
        return res.status(400).json({message : "User not found"});
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message : "Invalid Password"});
    }

    const token = jwt.sign(
    { id: user._id, },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


    res.status(200).json({message : "Login Successfully" , token});
    
    } catch (error) {
        console.log(error);
       res.status(500).json({message : "Somthing went Wrong ~~~~"});
    }
}



module.exports = {
    registerUser,
    loginUser
}
