import { Request, Response } from "express";
import { CartService } from "../service/cart.service";

class CartController {
    static async addToCart(req: Request, res: Response){
        try {
            const { itens, valor } = req.body;
            const cart = await CartService.addToCart({ itens, valor });
            res.status(201).send(cart);
        } catch (error) {
            res.status(500).send({ message: "Error adding to cart", error });
        }
    }

    static async getCart(req: Request, res: Response){
        try {
            const { id } = req.params;
            const cart = await CartService.getCart(id);
            if (!cart) {
                return res.status(404).send({ message: "Cart not found" });
            }
            res.status(200).send(cart);
        } catch (error) {
            res.status(500).send({ message: "Error getting cart", error });
        }
    }

    static async calculateTotal(req: Request, res: Response){
        try {
            const total = await CartService.calculateTotal();
            res.status(200).send({ total });
        } catch (error) {
            res.status(500).send({ message: "Error calculating total", error });
        }
    }

}