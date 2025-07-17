import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productControllers.js";

const router=Router();

//get all products
router.get("/", getAllProducts);

//get product by id
router.get("/:id", getProductById);

//create product
router.post("/", createProduct);

// update product by id
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

const productRouter=router;
export default productRouter;

