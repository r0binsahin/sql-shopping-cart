import express from 'express';
import {
  putProductToCart,
  createNewCart,
  getcartById,
  deleteCart,
} from '../controllers/cartControllers';

export const cartRouter = express.Router();

cartRouter.post('/', createNewCart);
cartRouter.get('/:cartId', getcartById);
cartRouter.post('/:cartId/products/', putProductToCart);
cartRouter.delete('/:cartId', deleteCart);
