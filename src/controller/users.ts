import express from 'express';
import { GoogleAuthCallback, LoginWithGoolge, UserLogin, UserRegister } from '../service/users';
const _router = express.Router();

/**
 * @description user register
 */
_router.post('/register',UserRegister);

/**
 * @description user login
 */
_router.post('/login',UserLogin);

/**
 * @description user login with google
 */
_router.post('/google-login',LoginWithGoolge);

/**
 * @description google login auth callback url
 */
_router.get('/google-auth/callback',GoogleAuthCallback);



export{
    _router as UserController
}