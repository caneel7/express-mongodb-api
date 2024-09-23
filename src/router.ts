import express from 'express';
import { UserController } from './controller/users';
const router = express.Router();

//user
router.use('/user',UserController);

export default router;