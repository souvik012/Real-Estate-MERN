import bcryptjs from 'bcryptjs';
import { errHandler } from '../Utils/error.js';
import User from "../Models/user.model.js";  // ✅ Correct for default export
import Listing from '../Models/listing.midel.js';


export const test = (req , res) => {
    res.json ({
        message : "Hello world !!"
    })
}

export const updateUser = async (req , res ,next) => {
    console.log("User from request:", req.user); // Debugging line
    if(req.user.id !== req.params.id)return next(errHandler(401,"You can only update your own account!"))
    try{
       if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10)

       }
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
         $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            //avatar:req.body.avatar,
         }
       },{new: true})

       const { password , ...rest} = updatedUser._doc
       res.status(200).json(rest)
    }
    catch(error){
       next(error)
    }
}

export const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json("You can delete only your own account!");
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  };

  export const getuserListing = async(req,res , next) => {
    if(req.user.id === req.params.id ){
      try{
        const listing = await Listing.find({userRef: req.params.id});
        res.status(200).json(listing);
      }catch(error){
        next(error)
      }
    }else{
      return next(errHandler(401,"You can only view your own listing!"))

    }
  }