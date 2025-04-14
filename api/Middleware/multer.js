import multer from 'multer';

const storage = multer.memoryStorage(); // Keep files in memory for Cloudinary upload
const upload = multer({ storage });

export default upload;
