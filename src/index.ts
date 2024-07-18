import express from 'express';
import { Request, Response } from 'express';
import {
  getCartById,
  createCart,
  createProduct,
  deleteCartById,
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

app.post('/api/carts', async (req: Request, res: Response) => {
  try {
    const newCart: InsertCart = await createCart();
    res.status(201).location(`/api/carts/${newCart.id}`).json(newCart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Error creating cart' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
