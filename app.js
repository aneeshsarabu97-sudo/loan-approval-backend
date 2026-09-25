import express from "express";

const app = express();

import userRouter from "./src/routes/user.route.js"


app.use("/api/v1/users",userRouter);
app.use("/api/v1/loans", loanRouter);
export default app;
