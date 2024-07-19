import express from "express";
import { Request, Response } from "express";
import {
  getCartById,
  createCart,
  createProduct,
  deleteCartById,
  getProductById,
  addProductToCart,
} from "./drizzle/queries";
import { InsertCart, InsertProduct } from "./drizzle/schema";

import { faker } from "@faker-js/faker";
import { log } from "console";

const app = express();
const port = 3000;

app.use(express.json());

function createRandomProduct() {
  return {
    name: faker.commerce.product(),
    price: Number(faker.commerce.price({ min: 10, max: 250 })),
    quantity: Number(faker.finance.amount({ min: 0, max: 15, dec: 0 })),
  };
}

//create product

app.post("/api/products", async (req: Request, res: Response) => {
  const fakerProduct = createRandomProduct();

  try {
    await createProduct(fakerProduct);
    res.status(201).send("product created!!");
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).send("Some post error :(");
  }
});

//create cart
app.post("/api/carts", async (req: Request, res: Response) => {
  try {
    const { id } = await createCart();
    res.status(201).location(`/api/carts/${id}`).json(id);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Error creating cart" });
  }
});

//get cart by id

app.get("/api/carts/:cartId", async (req: Request, res: Response) => {
  const { cartId } = req.params;
  try {
    const cart = await getCartById(cartId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

//get product by Id

app.get("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);

    if (!product) return res.status(404).json({ message: "Cart not found" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});
app.post(
  "/api/carts/:cartId/products/",
  async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
      const updatedCart = await addProductToCart(productId, cartId, quantity);
      if (!updatedCart) {
        return res.status(404).json({ message: "Cart or product not found" });
      }

      res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Error adding product to cart" });
    }
  }
);

app.delete("/api/carts/:cartId", async (req: Request, res: Response) => {
  const { cartId } = req.params;
  // console.log(id);
  try {
    await deleteCartById(cartId);
    res.status(201).json({ mesasage: "Cart deleted" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Error deleting cart" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
