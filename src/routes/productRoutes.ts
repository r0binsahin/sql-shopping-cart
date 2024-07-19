import express from 'express';
import {
  createNewProduct,
  getProduct,
} from '../controllers/productControllers';

export const productRouter = express.Router();

productRouter.post('/', createNewProduct);
productRouter.get('/:id', getProduct);
