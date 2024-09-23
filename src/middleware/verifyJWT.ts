import { Response, NextFunction } from "express";
import { unauthorizedRequest } from "../utils/response";
import { Authenticator, IAuthRequest } from "../../config/authenticator";
import _logger from "../../logger";
import { User } from "../model/User";


export default async(req: IAuthRequest,res: Response,next: NextFunction)=>{

    const bearer = req.headers['authorization'];

    if(!bearer || !bearer.startsWith('Bearer ')) return unauthorizedRequest(res,'Unauthorized');
    const token = bearer.split(' ')[1];
    
    try {

        const decodedToken = Authenticator.getClaims(token);
        
        if(decodedToken.sub){

            const foundUser = User.findById(decodedToken.sub);
            if(!foundUser){
                throw new Error('Invalid Token');
            }
            req.user = foundUser;
            return next();

        }
        throw new Error('Invalid Token');
    } catch (error : any) {
        _logger.error('issue with token : ' + error);
        if(error && error.message === 'TokenExpiredError'){
            return unauthorizedRequest(res,'Invalid Or Expired Token');
        }else{
            return unauthorizedRequest(res,'Invalid Token');
        }
    }

}
