import express from 'express'
import { createListing, deleteListing, updateListing ,getListing } from '../Controllers/listing.controller.js'
import { verifyToken } from '../Utils/VerifyUser.js'
import upload from '../Middleware/multer.js';

const router = express.Router()

router.post('/create',verifyToken, upload.array('images', 6),createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id' , verifyToken , updateListing);
router.get('/get/:id' , getListing)
export default router;