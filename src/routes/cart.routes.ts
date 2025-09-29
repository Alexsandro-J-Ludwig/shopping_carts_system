import { Router } from "express";
import { CartController } from "../controller/cart.controller";

class CartRoutes {
    private route: Router

    constructor(){
        this.route = Router()
        this.initRoutes()
    }

    private initRoutes(){
        this.route.put("/add/:id", CartController.addToCart);
        this.route.get("/get/:id", CartController.getCart);
        this.route.get("/total/:id", CartController.calculateTotal);
    }

    public getRoutes(){
        return this.route
    }
}

export { CartRoutes }