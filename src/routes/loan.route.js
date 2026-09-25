import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    applyLoan,
    getMyLoans,
    getLoanById,
    updateLoan,
    approveLoan,
    rejectLoan
} from "../controllers/loan.controller.js";

const router = Router();

router.route("/apply").post(
    verifyJWT,
    applyLoan
);

router.route("/my-loans").get(
    verifyJWT,
    getMyLoans
);

router.route("/:loan_id").get(
    verifyJWT,
    getLoanById
);

router.route("/:loan_id").patch(
    verifyJWT,
    updateLoan
);

router.route("/:loan_id/approve").patch(
    verifyJWT,
    approveLoan
);

router.route("/:loan_id/reject").patch(
    verifyJWT,
    rejectLoan
);

export default router;