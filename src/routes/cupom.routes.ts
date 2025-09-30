import { CupomController } from "../controller/cupom.controller";
import { Router } from "express";

class CupomRoutes{
    private route:Router
    constructor(){
        this.route = Router();
        this.initRoutes();
    }

    private initRoutes(){
        this.route.post("/criar", CupomController.criarCupom);
        this.route.get("/pegar", CupomController.pegarCupons);
        this.route.delete("/deletar", CupomController.removerCupom);
    }

    public getRoutes(){
        return this.route
    }
}

export { CupomRoutes }