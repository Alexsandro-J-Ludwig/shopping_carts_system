import "dotenv/config";

import express, { Application } from "express";
import { Connection } from "./config/Db.config";

class Server{
    private connection: Connection;
    private app: Application;

    constructor(){
        this.app = express()
        this.app.use(express.json())
        
        this.connection = new Connection();
    }

    private initRoutes(){
        //Aqui vai as rotas
    }

    public start(){
        this.connection.sequelize.authenticate();
        this.connection.sequelize.sync({ alter: true });
    }
}

new Server().start();