module.exports = class Inventory_db {
  constructor(db, table) {
    this.db = db;
    this.table = table;
  }

  start() {
    // try {
    this.db.schema
      .hasTable(`${this.table}`)
      .then((exists) => {
        if (!exists) {
          return this.db.schema.createTable(
            'productos',
            (t) => {
              t.increments('id').primary();
              t.string('title', 50);
              t.string('thumbnail', 50);
              t.float('price');
            }
          );
        }
      });
  }

  async getProducts() {
    try {
      const products = await this.db
        .select()
        .table(`${this.table}`);
      return products?.length ? products : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProduct(id) {
    try {
      const product = await this.db(`${this.table}`).where(
        'id',
        id
      );
      return product[0] ? product[0] : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addProduct(title, price, thumbnail) {
    try {
      if (!title || !price || !thumbnail) {
        return null;
      }
      const newProduct = { title, price, thumbnail };
      const id = await this.db(`${this.table}`).insert(
        newProduct
      );
      if (id) {
        return {
          ...newProduct,
          id,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async updateProduct(id, title, price, thumbnail) {
    try {
      const newProduct = { title, price, thumbnail };
      if (
        await this.db(`${this.table}`)
          .where('id', id)
          .update({ ...newProduct })
      ) {
        return {
          ...newProduct,
          id,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await this.db(
        `${this.table}`
      ).where('id', id);
      if (
        await this.db(`${this.table}`).where('id', id).del()
      ) {
        return deletedProduct;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
