import { Router } from "express";
import { CartController } from "../controller/cart.controller";

class CartRoutes {
    private route: Router

    constructor(){
        this.route = Router()
        this.initRoutes()
    }

    private initRoutes(){
        this.route.post("/adicionar/:id", CartController.addToCart);
        this.route.put("/alterar/:id", CartController.alterarQuantidade);
        this.route.get("/get/:id", CartController.getCart);
        this.route.get("/total/:id", CartController.calculateTotal);
        this.route.delete("/remover/:id", CartController.removerProduto);
    }

    public getRoutes(){
        return this.route
    }
}

export { CartRoutes }