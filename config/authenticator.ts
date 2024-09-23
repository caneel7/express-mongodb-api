import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface IAuthRequest extends Request{
    user: any;
}

class _Authenticator {

    private secret:string

    constructor(tokenSecret:string){
        this.secret = tokenSecret;
    }

    generateToken(id:string|number){
        return jwt.sign({sub:id},
            this.secret,
            {
                expiresIn:'2hour'
            }
        )
    }

    getClaims(token:string){
        return jwt.verify(token,this.secret);
    }

    getUser(req: IAuthRequest){
        return req.user;
    }
}

export const Authenticator = new _Authenticator(process.env.TOKEN_SECRET ?? '');