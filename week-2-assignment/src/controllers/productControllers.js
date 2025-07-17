import { products } from "../storage/productsStorage.js";
import { v4 as uuidv4 } from "uuid"

// get all products
export const getAllProducts=async(req, res) => {
  res.json(products);
}

//get product by id
export const getProductById=async(req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
}

//create product
export const createProduct=async(req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
}

//update product
export const updateProduct=async(req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updatedProduct = {
    id: req.params.id,
    name,
    description,
    price,
    category,
    inStock
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
}

// Delete product
export const deleteProduct = async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).end();
};
