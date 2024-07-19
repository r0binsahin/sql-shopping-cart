import {
  productTable,
  saltCart,
  SelectCart,
  InsertProduct,
  cartProduct,
  InsertCart,
  CartProduct,
  ProductInCart,
} from "./schema";
import { db } from "./index";
import { eq, and } from "drizzle-orm";

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

type AddCart = {
  id: string;
};

export const createCart = async () => {
  const result = await db
    .insert(saltCart)
    .values({})
    .returning({ id: saltCart.id });
  const newCart: AddCart = result[0];
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
    name: item.product_table?.name || "", // Provide a default value if product_table is null
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

export const deleteCartById = async (id: string) => {
  await db.delete(saltCart).where(eq(saltCart.id, id));
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
    throw new Error("Cart or product not found");
  }

  const existingCartProduct = await db
    .select()
    .from(cartProduct)
    .where(
      and(eq(cartProduct.cartId, cartId), eq(cartProduct.productId, productId))
    );

  if (existingCartProduct.length > 0) {
    // If the product is already in the cart, increment the quantity
    const newQuantity = existingCartProduct[0].quantity + quantity;
    await db
      .update(cartProduct)
      .set({ quantity: newQuantity })
      .where(
        and(
          eq(cartProduct.cartId, cartId),
          eq(cartProduct.productId, productId)
        )
      );
  } else {
    // If the product is not in the cart, insert it
    await db.insert(cartProduct).values({
      cartId,
      productId,
      quantity,
    });
  }

  const updatedCart = await getCartById(cartId);
  return updatedCart;
};
