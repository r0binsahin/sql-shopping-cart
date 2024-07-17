import { InsertCart, saltCart, SelectCart } from './schema';
import { db } from './index';
import { eq } from 'drizzle-orm';

import { faker } from '@faker-js/faker';
import { numeric } from 'drizzle-orm/sqlite-core';
interface Cart {
  id: string;
}
function createRandomCart(): Cart {
  return {
    id: faker.string.uuid(),
  };
}
const cart = createRandomCart();

interface Product {
  productId: string;
  name: string;
  price: string;
  quantity: string;
}
function createRandomproduct(): Product {
  return {
    productId: faker.string.uuid(),
    name: faker.commerce.product(),
    price: faker.commerce.price({ min: 10, max: 250 }),
    quantity: faker.finance.amount({ min: 0, max: 15 }),
  };
}
const product = createRandomproduct();

export const createCart = async (data: InsertCart) => {
  const newCart = await db.insert(saltCart).values({}).returning();
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

export const createProduct = async () => {
  return null;
};
