import { pgTable, real, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const saltCart = pgTable('salt_cart', {
  id: uuid('id').primaryKey().defaultRandom(),
});

//relation
export const saltCartRelations = relations(saltCart, ({ many }) => ({
  cartsToProducts: many(cartProduct),
}));

export const productTable = pgTable('product_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  price: varchar('price').notNull(),
  quantity: varchar('quantity').notNull().default('0'),
});

//relation
export const productRelations = relations(productTable, ({ many }) => ({
  productsToCarts: many(cartProduct),
}));

//Joint
export const cartProduct = pgTable(
  'cart_product',
  {
    cartId: uuid('cart_id')
      .notNull()
      .references(() => saltCart.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => productTable.id),
    quantity: integer('quantity').notNull().default(1),
  },
  (table) => ({
    primaryKey: [table.cartId, table.productId], //composite primary key
  })
);

export type SelectCart = typeof saltCart.$inferSelect;
export type InsertProduct = {
  name: string;
  price: string;
  quantity: string;
  id?: string;
};
export type InsertCart = typeof saltCart.$inferInsert;
