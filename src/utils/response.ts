import { Response } from "express";

const okResponse = (res:Response,data:any,message:string)=>{
    res.status(200).json({
        success: true,
        data,
        message
    });
}

const badRequest = (res:Response,message:string)=>{
    res.status(400).json({
        success: false,
        message
    });
}

const serverError = (res:Response,data:any)=>{
    res.status(500).json({
        success: false,
        data
    });
}

const notFound = (res:Response,message:string)=>{
    res.status(404).json({
        success: false,
        message
    });
}

const conflictResponse = (res:Response,message:string)=>{
    res.status(409).json({
        success: false,
        message
    });
}

const unauthorizedRequest = (res:Response,message:string)=>{
    res.status(401).json({
        success: false,
        message
    });
}

const forbiddenRequest = (res:Response,message:string)=>{
    res.status(403).json({
        success: false,
        message
    });
}

export {
    okResponse,
    badRequest,
    serverError,
    notFound,
    conflictResponse,
    unauthorizedRequest,
    forbiddenRequest
}