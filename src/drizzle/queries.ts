import {
  InsertCart,
  productTable,
  saltCart,
  SelectCart,
  InsertProduct,
} from './schema';
import { db } from './index';
import { eq } from 'drizzle-orm';
import { da } from '@faker-js/faker';

export const createCart = async (): Promise<SelectCart> => {
  const newCart = await db.insert(saltCart).values({});
  return newCart[0];
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

export const createProduct = async (product: InsertProduct) => {
  return await db.insert(productTable).values(product);
};
