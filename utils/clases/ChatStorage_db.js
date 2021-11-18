module.exports = class ChatStorage {
  constructor(db, table) {
    this.db = db;
    this.table = table;
  }

  start() {
    this.db.schema.hasTable(`${this.table}`).then((exists) => {
      if (!exists) {
        return this.db.schema.createTable(`${this.table}`, (t) => {
          t.increments('id').primary();
          t.string('author', 100);
          t.string('message', 500);
          t.float('date');
        });
      }
    });
  }

  async save(author, message, date) {
    try {
      const newMessage = { author, message, date };
      await this.db(`${this.table }`).insert(newMessage);
    } catch (error) {
      console.error(error);
    }
  }

  async read() {
    try {
      const messages = await this.db.select().table(`${this.table }`);
      return messages?.length ? messages : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async delete() {
    try {
      await fs.promises.rm(this.ruta);
    } catch (error) {
      throw new Error('Error al borrar el archivo');
    }
  }
};
