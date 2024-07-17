import express from 'express';
import {
  getCartById,
  createCart,
  createProduct,
  deleteCartById,
} from './drizzle/queries';

const app = express();
const port = 3000;

app.use(express.json());

import { faker } from '@faker-js/faker';
import { InsertProduct } from './drizzle/schema';

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
  productId?: string;
  name: string;
  price: string;
  quantity: string;
}
function createRandomproduct(): Product {
  return {
    productId: faker.string.uuid(),
    name: faker.commerce.product(),
    price: faker.commerce.price({ min: 10, max: 250 }),
    quantity: faker.finance.amount({ min: 0, max: 15, dec: 0 }),
  };
}
const fakeProduct = createRandomproduct();

app.post('/api/products', async (req, res) => {
  const product: InsertProduct = {
    name: fakeProduct.name,
    price: fakeProduct.price,
    quantity: fakeProduct.quantity,
  };

  try {
    await createProduct(product);
    res.status(201).send('product created!!');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Some post error :(');
  }
});

/* app.delete('/delete-recipe/:id', async (req, res) => {
  const { id } = req.params;

  try {
    res.status(201).send('Deleted recipe');
  } catch (error) {
    console.error('Error deleting recipe', error);
    res.status(500).send('Some delete error :(');
  }
}); */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
