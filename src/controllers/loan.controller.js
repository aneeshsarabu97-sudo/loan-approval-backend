import { Loan} from "../models/loan.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const applyLoan = asyncHandler(async(req,res)=>{
    const {loanAmount,loantenure,anualincome,monthlyincome,creditscore,
        loanpurpose,
    employmentstatus,
    workexperience,
    existingloans
    } = req.body

    if (
        [loanpurpose,employmentstatus,].some(
            (field)=>
                typeof field!=="string" || field.trim()==="")
    ) {
        throw new ApiError(400,"Both are req to register")
    }

    if(
    !loanAmount ||
    !loantenure ||
    !anualincome ||
    !monthlyincome ||
    !creditscore ||
    !workexperience)
    {
    throw new ApiError(400,"All numeric fields are required")
    }

    if(loanAmount <= 0){
        throw new ApiError(400,"Invalid loan amount")
    }

    if(creditScore < 300 || creditScore > 900){
        throw new ApiError(400,"Invalid credit score")
    }

const loancreation = await Loan.create({
    user:req?.user._id,
    loanAmount,
    loantenure,
    anualincome,
    creditscore,
    loanpurpose,
    monthlyincome,
    employmentstatus,
    workexperience,
    existingloans,
    })

    if (!loancreation) {
        throw new ApiError(500,"Something went wrong while applying for the loan")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            loancreation,
            "Loan application submitted successfully"
        )
    );
})

const getMyLoans = asyncHandler(async(req,res)=>{
    const loans = await Loan.find({
        user:req.user._id
    })

    return res.status(201)
    .json(
        new ApiResponse(201,loans,"Loans fetched sucuessfully")
    )

})

const getLoanById = asyncHandler(async(req,res)=>{
    const {loan_id} = req.params

    const loan = await Loan.findById(loan_id)
    
    if (!loan) {
        throw new ApiError(404,"Loan does not exist")
    }

    if (req.user._id.toString()!==loan.user.toString()) {
        throw new ApiError(403  ,"Only owner can view and get his loan")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,loan,"Loan fetched sucuefully through loanid")
    )
})

const updateLoan = asyncHandler(async(req,res)=>{
    const {
    loanAmount,
    workExperience,
    loanPurpose} = req.body

    const {loan_id} = req.params

    const loan = await Loan.findById({
        _id:loan_id
    })

    if (!loan) {
        throw new ApiError(400,"Loan does not exist")
    }

    if (req.user._id.toString() !== loan.user.toString()) {
        throw new ApiError(400,"Only owner can update the loan")
    }

    if (loan.status!=="pending") {
        throw new ApiError(400,"Loan has already been reviewed")
    }

    loan.loanAmount = loanAmount
    loan.workexperience= workExperience
    loan.loanpurpose = loanPurpose
    await loan.save()
    
    return res.status(200)
    .json(
        new ApiResponse(200,loan,"Loan updated sucuessfully")
    )


})



const getMyLoans = asyncHandler(async(req,res)=>{
    
    const loans = await Loan.find({
        user:req.user._id
    })

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            loans,
            "Loans fetched successfully"
        )
    )
})

const approveLoan = asyncHandler(async(req,res)=>{

    const { loan_id } = req.params

    const loan = await Loan.findById(loan_id)

    if(!loan){
        throw new ApiError(
            404,
            "Loan not found"
        )
    }

    loan.status = "approved"

    await loan.save()

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            loan,
            "Loan approved successfully"
        )
    )
})

const rejectLoan = asyncHandler(async(req,res)=>{

    const { loan_id } = req.params

    const loan = await Loan.findById(loan_id)

    if(!loan){
        throw new ApiError(
            404,
            "Loan not found"
        )
    }

    loan.status = "decline"

    await loan.save()

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            loan,
            "Loan rejected successfully"
        )
    )
})