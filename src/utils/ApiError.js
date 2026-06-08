class ApiError extends Error{
    constructor(statuscode,message="something went wrong",error=[],stacks=""){
        this.statuscode=statuscode
        this.message=message
        this.errors=this.errors
    

    if(stack){
        this.stack=stack
    }
    else{
        Error.captureStackTrace(this,this.constructor)
    }
}
}

export {ApiError}
