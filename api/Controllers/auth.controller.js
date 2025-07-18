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
       {httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // ✅ Secure ONLY in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // ✅ Only use 'None' with secure
      }
      )
       .status(200)
       .json(rest)

  } catch (error) {
    next(error);
  }
}

export const google = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("Existing User Avatar:", user.avatar);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);  // Corrected token assignment
      const { password: pass, ...rest } = user._doc;  // Exclude password
  
      return res
          .cookie('access_token',
            token,
            { httpOnly: true,
              secure: process.env.NODE_ENV === 'production',  // ✅ Secure ONLY in production
              sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // ✅ Only use 'None' with secure
            })
          .status(200)
          .json(rest);  // Send only required user data
  } else {
    const generatedPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedpassword = bcryptjs.hashSync(generatedPassword, 10);
      console.log("New User Avatar:", req.body.photo);
      const newUser = new User({
          username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedpassword,
          avatar: req.body.photo,  // Ensure this is saved correctly
      });
  
      await newUser.save();
      console.log("Saved New User Avatar:", newUser.avatar);
  
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);  // Correct token assignment
      const { password: pass, ...rest } = newUser._doc;  // Exclude password
  
      return res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);  // Send only required user data
  }
  
  } catch (error) {
    next(error);
  }
};



