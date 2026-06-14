export const verifyAdmin = asyncHandler(async(req,res,next)=>{

    if(req.user.role !== "admin"){
        throw new ApiError(
            403,
            "Access denied"
        )
    }

    next()
})