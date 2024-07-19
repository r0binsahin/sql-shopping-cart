import express from 'express';
import {
  addProductToCart,
  createNewCart,
  getcartById,
  deleteCartById,
} from '../controllers/cartControllers';

export const cartRouter = express.Router();

cartRouter.post('/', createNewCart);
cartRouter.get('/:cartId', getcartById);
cartRouter.post('/:cartId/products/', addProductToCart);
cartRouter.delete('/:cartId', deleteCartById);
