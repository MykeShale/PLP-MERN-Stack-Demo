import express from "express"
import {config} from "dotenv"
import productRouter from "./routers/productsRouter.js";

const app=express();
app.use(express.json());
app.use('/api/products/v1', productRouter);

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on PORT:${PORT}`));