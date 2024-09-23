import { Request, Response } from "express"
import { badRequest, conflictResponse, notFound, okResponse, serverError, unauthorizedRequest } from "../utils/response";
import { User } from "../model/User";
import { hash, compare } from 'bcrypt'
import { Authenticator } from "../../config/authenticator";
import { generateAuthLink, getGoogleProfileData } from "../utils/google";
import _logger from "../../logger";
import { Types } from "mongoose";

const UserRegister = async (req: Request, res: Response) => {
    try {

        const { first_name, last_name, email, password } = req.body;

        if(!first_name || !last_name) return badRequest(res,'Please Provide First Name And Last Name');
        if(!email || !password) return badRequest(res,'Please Provide Email And Password');

        const duplicateEmailCount = await User.countDocuments({
            email: email,
        }).exec();

        if(duplicateEmailCount) return conflictResponse(res,'Email Already Exists');

        const hashPassword = await hash(password,13);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashPassword
        });

        return okResponse(res,newUser,'Registration Successful');

    } catch (error) {
        console.error(error);
    }
}

const UserLogin = async(req: Request,res: Response)=>{
    try {

        const { email, password } = req.body;
        
        if(!email || !password) return badRequest(res,'Please Provide Email And Password');

        const foundUser = await User.findOne({
            email,
            is_active: true
        }).exec();

        if(!foundUser) return notFound(res,'Cannot Find User');

        const match = await compare(password,foundUser.password);

        if(!match) return unauthorizedRequest(res,'Invalid Credentials');

        const token = Authenticator.generateToken(foundUser.id);

        return okResponse(res,{user:foundUser,token},'Logged In Successfully');

    } catch (error) {
        console.error(error);
        return serverError(res,error);
    }
}

/**
 * @description returns authentication url from google which will return to api to validate user
 */
const LoginWithGoolge = async(req: Request,res: Response)=>{
    try {

        const authUrl = await generateAuthLink();

        res.redirect(authUrl);
        
    } catch (error) {
        console.error(error);
        return serverError(res,error);
    }
}

/**
 * @description login with google will return to this url with code and will validate user upsert in db and return token
 */
const GoogleAuthCallback = async(req: Request,res: Response)=>{
    try {

        const { code } = req.query;

        if(!code) return unauthorizedRequest(res,'Something Went Wrong');

        const profileData = await getGoogleProfileData(code.toString());

        let emailaddress : string | null | undefined ;
        let userDetail :any;
        
        if(profileData.names){
            userDetail = profileData.names[0]
        };

        if(profileData.emailAddresses != null){
            emailaddress = profileData.emailAddresses[0].value
        };

        const existingUser = await User.findOne({
            email: emailaddress
        }).exec();

        let first_name: string = userDetail?.displayName?.split(' ')[0] ?? '';
        let last_name : string = userDetail?.displayName && userDetail.displayName.split(' ').length > 1 ? userDetail.displayName.split(' ').slice(1,userDetail.displayName.length -1 ).join(' ') : ( userDetail?.displayName?.split(' ')[0] ?? '' );

        const newUser = await User.updateOne(
            { _id: existingUser?._id ?? new Types.ObjectId() },
            { email: emailaddress, first_name, last_name, google_user: true },
            { upsert: true, new: true, runValidators: true }
        ).exec();

        const user = await User.findById(newUser.upsertedId);

        const token = Authenticator.generateToken(user?.id);

        return okResponse(res,{user,token},'Logged Successfully');        
    } catch (error) {
        console.error(error);
        return serverError(res,error);
    }
}

export {
    UserRegister,
    UserLogin,
    LoginWithGoolge,
    GoogleAuthCallback
}