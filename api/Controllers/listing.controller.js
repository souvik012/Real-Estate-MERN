import Listing from "../Models/listing.midel.js";
import cloudinary from '../Utils/cloudinary.js';
import { errHandler } from "../Utils/error.js";

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export const createListing = async (req, res, next) => {
  try {
    const { imageUrls = [], ...rest } = req.body;
    const finalImageUrls = [...imageUrls]; // Make a fresh array

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await streamUpload(file.buffer);
        finalImageUrls.push(imageUrl);
      }
    }

    if (
      !Array.isArray(finalImageUrls) ||
      !finalImageUrls.every((url) => typeof url === 'string')
    ) {
      return res.status(400).json({ message: 'Invalid image URLs' });
    }

    const listing = await Listing.create({
      ...rest,
      imageUrls: finalImageUrls,
      userRef: req.user.id,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("Error in createListing:", error);
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errHandler(401, 'You can only delete your own listing'));
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Listing deleted' });

  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req,res,next) => {

  const listing = await Listing.findById(req.params.id)
  if(!listing){
    return next(errHandler(404, 'Listing not found!'))

  }
  if(req.user.id !== listing.userRef){
    return next(errHandler(401,'You can only update your own Listing!'))
  }

  try {

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true}

    )
    res.status(200).json(updatedListing)
    
  } catch (error) {
    next(error)
  }

}

export const getListing = async (req,res,next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if(!listing){
      return next(errHandler(404,'Listing not found!'))
    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res) => {
  try {
    const {
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort = 'createdAt',
      order = 'desc',
      startIndex = 0,
    } = req.query;

    const limit = 9;
    const query = {};

    // Search by title or address prefix
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: `^${searchTerm}`, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') query.type = type;
    if (parking === 'true') query.parking = true;
    if (furnished === 'true') query.furnished = true;
    if (offer === 'true') query.offer = true;

    const listings = await Listing.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(Number(startIndex))
      .limit(limit);

    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


