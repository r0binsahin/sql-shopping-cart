import express from 'express';
import { Request, Response } from 'express';
import {
  getCartById,
  createCart,
  createProduct,
  deleteCartById,
  getProductById,
} from './drizzle/queries';
import { InsertCart, InsertProduct } from './drizzle/schema';

import { faker } from '@faker-js/faker';

const app = express();
const port = 3000;

app.use(express.json());

function createRandomProduct(): InsertProduct {
  return {
    name: faker.commerce.product(),
    price: faker.commerce.price({ min: 10, max: 250 }),
    quantity: faker.finance.amount({ min: 0, max: 15, dec: 0 }),
  };
}

//create product

app.post('/api/products', async (req: Request, res: Response) => {
  const fakerProduct = createRandomProduct();

  try {
    await createProduct(fakerProduct);
    res.status(201).send('product created!!');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Some post error :(');
  }
});

//create cart
app.post('/api/carts', async (req: Request, res: Response) => {
  try {
    const newCart: InsertCart = await createCart();
    res.status(201).location(`/api/carts/${newCart.id}`).json(newCart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Error creating cart' });
  }
});

//get cart by id

app.get('/api/carts/:cartId', async (req: Request, res: Response) => {
  const { cartId } = req.params;
  try {
    const cart = await getCartById(cartId);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);

    if (!product) return res.status(404).json({ message: 'Cart not found' });

    res.json(product);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
