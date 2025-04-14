import express from 'express'
import { createListing } from '../Controllers/listing.controller.js'
import { verifyToken } from '../Utils/VerifyUser.js'
import upload from '../Middleware/multer.js';

const router = express.Router()

router.post('/create',verifyToken, upload.array('images', 6),createListing)

export default router;