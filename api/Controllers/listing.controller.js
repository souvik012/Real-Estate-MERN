import Listing from "../Models/listing.midel.js";
import cloudinary from '../Utils/cloudinary.js';

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
