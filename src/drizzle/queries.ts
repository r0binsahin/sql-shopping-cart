import {
  productTable,
  saltCart,
  SelectCart,
  InsertProduct,
  cartProduct,
  InsertCart,
  CartProduct,
  ProductInCart,
} from './schema';
import { db } from './index';
import { eq } from 'drizzle-orm';

type Product = {
  name: string;
  price: number;
  quantity: number;
  id?: string;
};

type CartWithProducts = {
  cartid: string;
  cartItems: ProductInCart[];
  totalNumberOfItems: number;
  totalPrice: number;
};

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

  const cart = cartResult[0];

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

  const mappedCartItems = cartItems.map((item) => ({
    productId: item.cart_product.productId,
    name: item.product_table?.name || '', // Provide a default value if product_table is null
    price: item.product_table?.price || 0, // Provide a default value if product_table is null
    quantity: item.cart_product.quantity,
  }));

  const cartId = cart.id;
  const cartWithProducts: CartWithProducts = {
    cartid: cartId,
    cartItems: mappedCartItems,
    totalNumberOfItems: totalNumberOfItems,
    totalPrice: totalPrice,
  };
  return cartWithProducts;
};

export const deleteCartById = async () => {
  return null;
};

export const createProduct = async (product: Product) => {
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

  if (!cart || !product) {
    throw new Error('Cart or product not found');
  }

  await db.insert(cartProduct).values({
    cartId,
    productId,
    quantity,
  });

  const updatedCart = await getCartById(cartId);
  return updatedCart;
};
