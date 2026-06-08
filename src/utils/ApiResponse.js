class ApiResponse{
    constructor(statuscode,data,message="sucuess"){
        this.statuscode=statuscode
        this.data=data
        this.message=message
    }
}

export {ApiResponse}