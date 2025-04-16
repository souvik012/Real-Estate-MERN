import express from 'express';
import { test, updateUser ,getuserListing} from '../Controllers/user.controller.js';
import { verifyToken } from '../Utils/VerifyUser.js';
import { deleteUser } from '../Controllers/user.controller.js';

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken, updateUser)
// DELETE USER
router.delete('/delete/:id', verifyToken , deleteUser);
router.get('/listing/:id' , verifyToken , getuserListing)

export default router