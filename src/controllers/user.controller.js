import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";

const generateAccessRefreshToken = async(user_id)=>{
    try {
        const user = await User.findById(user_id)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave : false})
        return {accessToken,refreshToken}
    } catch (error) {
        console.log(error)
        throw new ApiError(400,"Something went wrong while generating access and refresh token")
    }
}


const register = asyncHandler(async(req,res)=>{
    const {fullName,email,phNumber,password,role} = req.body

    if (
        [fullName,email,phNumber,role,password].some(
        (field)=>field.trim()===""
    )) {
        throw new ApiError(400,"All fields are required to register the user...")
    }

    const isExisted = await User.findOne({
        $or:[{email},
            {phNumber}
        ]
    })

    if (isExisted) {
        throw new ApiError(400,"User already exists")        
    }

    const user = await User.create({
        fullName,
        email,
        phNumber,
        role,
        password
    })

    const userCreated = await User.findById(user._id).select("-password -refreshToken")

    if(!userCreated){
        throw new ApiError(403,"Something went wrong while registering the user")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,userCreated,"User registerd sucuessfullyy")
    )
})

const loginUser = asyncHandler(async(req,res)=>{

    const {fullName,email,password} = req.body

    if (!(fullName || email)) {
        throw new ApiError(400,"fullName or email is required to login")
    }

    if (!password) {
        throw new ApiError(400,"Password requied to login")
    }

    const user = await User.findOne({
        $or:[{email},{fullName}]
    })

    if (!user) {
        throw new ApiError(400,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400,"Incorrect Password")
    }

    const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id)

    const loggedinuser = await User.findById(user._id).select("-refreshToken -password")
    
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
        200,
        {
            user:loggedinuser,accessToken,refreshToken
        },
        "User logged in sucuessfullyy"
    )
)
})

const logoutuser = asyncHandler(async(req,res)=>{
    if (!req.user) {
        throw new ApiError(403,"Unauthorized request")
    }
    const logout = await User.findByIdAndUpdate(
        req?.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logout sucuessfully")
    )
})

const refreshAccesstoken = asyncHandler(async(req,res)=>{
    const incomingrefreshtoken = req?.cookies?.refreshToken || req?.body?.refreshToken

    if (!incomingrefreshtoken) {
        throw new ApiError(400,"refreshtoken not available")
    }

    try {
        const verifyrefreshtoken = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)

        const user =await User.findById(verifyrefreshtoken._id)

        if (user.refreshToken!==incomingrefreshtoken) {
            throw new ApiError(400,"Refresh token expired or incorrect refresh token")
        }

        const{accessToken,refreshToken} = await generateAccessRefreshToken(user._id)

        const currentuser = await User.findById(user._id).select("-refreshToken -password")
        
        const options={
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,
                {
                    user:currentuser,accessToken,refreshToken
                },
                "refresh token genreated sucuessfully"
            )
        )
    } catch (error) {
        console.log(error)
        throw new ApiError(400,"Something went wrong while refresinhtoken")
    }
})

const changecurrentpassword = asyncHandler(async(req,res)=>{
    const {oldpassword,newpasssword} = req.body

    if (!oldpassword || !newpasssword) {
        throw new ApiError(400,"oldpass and newpass both are req to change current password")
    }

    const user = await User.findById(req?.user._id)

    if (!user) {
        throw new ApiError(400,"User must be logged in...")
    }

    const ispasswordvalid = await user.isPasswordCorrect(oldpassword)

    if (!ispasswordvalid) {
        throw new ApiError(400,"Oldpassword must be given correct")
    }

    user.password=newpasssword
    await user.save()

    return res.status(200)
    .json(
        new ApiResponse(201,{},"password reset sucuessfull")
    )
})

const getcurrentuser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(200,req.user_id,"User fetched sucuessfully")
    )
})

