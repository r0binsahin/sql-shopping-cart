import {
  productTable,
  saltCart,
  SelectCart,
  InsertProduct,
  cartProduct,
  InsertCart,
} from './schema';
import { db } from './index';
import { eq } from 'drizzle-orm';

export const createCart = async (): Promise<InsertCart> => {
  const result = await db.insert(saltCart).values({});
  const newCart: InsertCart = result[0];
  return { id: newCart.id };
};

export const getCartById = async (id: string) => {
  const cartResult = await db
    .select()
    .from(saltCart)
    .where(eq(saltCart.id, id));

  if (!cartResult) return null;

  const cart: SelectCart = cartResult[0];

  const cartItems = await db
    .select()
    .from(cartProduct)
    .leftJoin(productTable, eq(cartProduct.productId, productTable.id))
    .where(eq(cartProduct.cartId, id));

  const totalNumberOfItems = cartItems.reduce(
    (sum, item) => sum + item.cart_product.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.cart_product.quantity * (item.product_table?.price ?? 0),
    0
  );

  const cartId = cart.id;
  return {
    cartid: cartId,
    cartItems: cartItems,
    totalNumberOfItems: totalNumberOfItems,
    totalPrice: totalPrice,
  };
};

export const deleteCartById = async () => {
  return null;
};

export const createProduct = async (product: InsertProduct) => {
  return await db.insert(productTable).values(product);
};

export const getProductById = async (productId: string) => {
  return await db
    .select()
    .from(productTable)
    .where(eq(productTable.id, productId));
};

export const addProductToCart = async (
  productId: string,
  cartId: string,
  quantity: number
) => {
  const cart = await getCartById(cartId);
  const product = await getProductById(productId);

  await db
    .insert(cartProduct)
    .values({
      cartId,
      productId,
      quantity,
    })
    .onConflictDoUpdate({
      //if product already exists in cart it increments the quantity
      target: [cartProduct.cartId, cartProduct.productId],
      set: { quantity: quantity },
    });

  const updatedCart = await getCartById(cartId);
  return updatedCart;
};
