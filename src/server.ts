import "dotenv/config";

import express, { Application } from "express";
import { Connection } from "./config/Db.config";
import { CartRoutes } from "./routes/cart.routes";
import { CartModel } from "./model/cart.model";
import { CartItemModel } from "./model/Cart_Iten.model";

class Server{
    private connection: Connection
    private app: Application;

    constructor(){
        this.app = express()
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
        
        this.connection = new Connection()
        this.initRoutes()
    }

    private initRoutes(){
        this.app.use("/carrinho", new CartRoutes().getRoutes())
    }

    public async start(){
        try {
            await this.connection.sequelize.authenticate();
            await this.connection.sequelize.sync({ alter: true });
            console.log("Banco de dados conectado");

            this.app.listen(process.env.PORT, () => {
                console.log(`servidor rodando na porta: ${process.env.PORT}`);
            });
            
        } catch (err:any) {
            console.error(`Falha de conexão com o banco de dados: ${err}`)
        }
    }
}

new Server().start();