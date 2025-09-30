import { Request, Response } from "express";
import { CartService } from "../service/cart.service";

class CartController {
  static async addToCart(req: Request, res: Response) {
    try {
      const response = await CartService.adicionarAoCarrinho(
        req.params.id,
        req.body
      );
      res.status(201).send({ success: true, data: response });
    } catch (err: any) {
      res
        .status(500)
        .send({ message: `Erro ao adicionar ao carrinho: ${err}` });
    }
  }

  static async alterarQuantidade(req: Request, res: Response) {
    try {
      const response = await CartService.alterarQuantidade(
        req.params.id,
        req.body
      );
      res.status(200).send({ success: true, data: response });
    } catch (err: any) {
      if (err.message === "Carrinho não encontrado")
        return res.status(404).send("Carrinho não encontrado");
      if (err.message === "Quantidade inválida")
        return res.status(400).send("Quantidade inválida");
      res.status(500).send({ message: `Erro ao alterar quantidade: ${err}` });
    }
  }

  static async getCart(req: Request, res: Response) {
    try {
      const response = await CartService.pegarCarrinho(req.params.id);
      res.status(200).send({ success: true, data: response });
    } catch (err: any) {
      if (err.message === "Carrinho não encontrado")
        return res.status(404).send("Carrinho não encontrado");
      res.status(500).send({ message: `Erro ao pegar carrinho: ${err}` });
    }
  }

  static async calculateTotal(req: Request, res: Response) {
    try {
      const response = await CartService.calcularTotal(req.params.id);
      res.status(200).send({ success: true, data: response });
    } catch (err: any) {
      if (err.message === "Carrinho não encontrado")
        return res.status(404).send("Carrinho não encontrado");
      res
        .status(500)
        .send({ message: `Erro ao calcular total de carrinho: ${err}` });
    }
  }

  static async removerProduto(req: Request, res: Response) {
    try {
      const response = await CartService.removerProduto(
        req.params.id,
        req.body.nome
      );
      res.status(200).send({ success: true, data: response });
    } catch (err: any) {
      if (err.message === "Produto não encontrado")
        return res.status(404).send("Produto não encontrado");
      res.status(500).send({ message: `Erro ao remover produto: ${err}` });
    }
  }

  static async finalziarCompra(req: Request, res: Response) {
    try {
      const response = await CartService.comprarCarrinho(
        req.params.id,
        req.body
      );
      return res.status(200).send(response);
    } catch (err: any) {
      if(err.message === "Este Carrinho de compras não existe")
        return res.status(404).send(err.message)
      if(err.message === "Dados de produto ou pedido inválidos")
        return res.status(400).send(err.message)
      return res.status(500).send(`Erro interno: ${err}`)
    }
  }
}

export { CartController };
