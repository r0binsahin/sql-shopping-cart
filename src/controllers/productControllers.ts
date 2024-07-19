import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { createProduct, getProductById } from '../drizzle/queries';

function createRandomProduct() {
  return {
    name: faker.commerce.product(),
    price: Number(faker.commerce.price({ min: 10, max: 250 })),
    quantity: Number(faker.finance.amount({ min: 0, max: 15, dec: 0 })),
  };
}

export const createNewProduct = async (req: Request, res: Response) => {
  const fakerProduct = createRandomProduct();

  try {
    await createProduct(fakerProduct);
    res.status(201).send('product created!!');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Some post error :(');
  }
};
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);

    if (!product) return res.status(404).json({ message: 'Cart not found' });

    res.json(product);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};
