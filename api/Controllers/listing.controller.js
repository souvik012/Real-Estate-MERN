import Listing from "../Models/listing.midel.js";
import cloudinary from '../Utils/cloudinary.js';

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(fileBuffer);
  });
};

export const createListing = async (req, res, next) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await streamUpload(file.buffer); // 👈 wait for upload
        imageUrls.push(imageUrl);
      }
    }

    const listing = await Listing.create({
      ...req.body,
      imageUrls,
      userRef: req.user.id, // ✅ token must be set by verifyToken middleware
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("Error in createListing:", error); // Optional: log error for dev
    next(error);
  }
};
