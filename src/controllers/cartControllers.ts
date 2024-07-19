import { Request, Response } from 'express';
import {
  addProductToCart,
  createCart,
  deleteCartById,
  getCartById,
} from '../drizzle/queries';

export const createNewCart = async (req: Request, res: Response) => {
  try {
    const { id } = await createCart();
    res.status(201).location(`/api/carts/${id}`).json(id);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Error creating cart' });
  }
};
export const getcartById = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  try {
    const cart = await getCartById(cartId);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};
export const putProductToCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await addProductToCart(productId, cartId, quantity);
    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart or product not found' });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
};
export const deleteCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  // console.log(id);
  try {
    await deleteCartById(cartId);
    res.status(201).json({ mesasage: 'Cart deleted' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ message: 'Error deleting cart' });
  }
};
