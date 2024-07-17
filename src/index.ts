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


app.post('/api/carts', async (req, res) => {
  const { id } = req.body;


  if () {
    return res.status(400).send('Missing some fields');
  }

  try {
    res.status(201).send('Recipe created!!');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Some post error :(');
  }
});

app.delete('/delete-recipe/:id', async (req, res) => {
  const { id } = req.params;

  try {
    res.status(201).send('Deleted recipe');
  } catch (error) {
    console.error('Error deleting recipe', error);
    res.status(500).send('Some delete error :(');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
