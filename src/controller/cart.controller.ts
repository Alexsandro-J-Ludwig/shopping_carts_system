import { Request, Response } from "express";
import { CartService } from "../service/cart.service";

class CartController {
  static async addToCart(req: Request, res: Response) {
    try {
      const cart = await CartService.adicionarAoCarrinho(
        req.params.id,
        req.body
      );
      res.status(201).send(cart);
    } catch (err: any) {
      res
        .status(500)
        .send({ message: `Erro ao adicionar ao carrinho: ${err}` });
    }
  }

  static async getCart(req: Request, res: Response) {
    try {
      const cart = await CartService.pegarCarrinho(req.params.id);
      res.status(200).send(cart);
    } catch (err: any) {

      if (err.message === "Carrinho não encontrado")
        return res.status(404).send("Carrinho não encontrado");
      res
      .status(500)
      .send({ message: `Erro ao pegar carrinho: ${err}` });
    }
  }

  static async calculateTotal(req: Request, res: Response) {
    try {
      const total = await CartService.calcularTotal(req.params.id);
      res.status(200).send({ total });
    } catch (err: any) {

      if (err.message === "Carrinho não encontrado")
        return res.status(404).send("Carrinho não encontrado");
      res
        .status(500)
        .send({ message: `Erro ao calcular total de carrinho: ${err}` });
    }
  }
}

export { CartController };
