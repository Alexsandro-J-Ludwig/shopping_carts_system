import { Sequelize } from "sequelize";

class Connection {
  sequelize: Sequelize;

  constructor() {
    if (!process.env.URL) {
      throw new Error("Variaveis de ambiente em falta");
    }

    this.sequelize = new Sequelize(
      process.env.URL,
    );
  }
}

export { Connection }