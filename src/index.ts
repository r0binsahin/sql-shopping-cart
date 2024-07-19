import express from 'express';

import { cartRouter } from './routes/cartRoutes';
import { productRouter } from './routes/productRoutes';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
