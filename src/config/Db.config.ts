import { Sequelize } from "sequelize";

class Connection {
  sequelize: Sequelize;

  constructor() {
    if (!process.env.DATABASE || !process.env.USER || !process.env.PASSWORD) {
      throw new Error("Variaveis de ambiente em falta");
    }

    const port = process.env.PORT ? parseInt(process.env.PORT) : 5432;

    this.sequelize = new Sequelize({
      host: process.env.HOST,
      port: port,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      dialect: "postgres",
    });

    this.connectAlert();
  }

  async connectAlert() {
    try {
      console.log(`Banco de dados conectado na porta: ${process.env.PORT}`);
    } catch (err: any) {
      console.log(err.message);
    }
  }
}

export { Connection }