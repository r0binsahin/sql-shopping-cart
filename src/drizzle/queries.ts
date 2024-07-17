import { saltCart, SelectCart } from './schema';
import { db } from './index';
import { eq } from 'drizzle-orm';

export const createCart = async () => {
  return;
};

export const getCartById = async (id: SelectCart['id']) => {
  return await db
    .select({ id: saltCart.id })
    .from(saltCart)
    .where(eq(saltCart.id, id));
};

export const deleteCartById = async () => {
  return null;
};

export const createProduct = async () => {
  return null;
};
