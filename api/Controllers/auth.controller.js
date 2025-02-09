import User from '../Models/user.model.js'
import bcryptjs from 'bcryptjs'
import {errHandler} from '../Utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req , res ,next) => {
    const{ username , email , password } = req.body;
    const hashedpassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username ,email , password:hashedpassword});

   try {
     await newUser.save()
     res.status(201).json("User created Successfully")
   
    } catch (error) {
      next(error)
        
    }
    
}


export const signin = async(req , res , next) => {
  const {email,password} = req.body;
  try {
    const validsuser = await User.findOne({email:email})
    if(!validsuser){
      return next(errHandler(404 , 'User not found !!!'))
    }
    const validpassword = bcryptjs.compareSync(password,validsuser.password)
    if(!validpassword){
      return next(errHandler(401,'Wrong Credential password!'))
    }
    
    const token = jwt.sign({id:validsuser._id},process.env.JWT_SECRET)

    const {password:pass , ...rest} = validsuser._doc;


    res.cookie(
      'access_token' , 
       token, 
       {httpOnly: true})
       .status(200)
       .json(rest)

  } catch (error) {
    next(error);
  }
} 