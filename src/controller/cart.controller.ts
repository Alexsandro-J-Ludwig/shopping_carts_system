import { Request, Response } from "express";
import { CartService } from "../service/cart.service";
import { CartDTO } from "../dto/cartDTO";
import { UpdateQuantityDTO } from "../dto/updateQuantity.dto";
import { FinalizarDTO } from "../dto/finalizar.dto";

class CartController {
  static async addToCart(req: Request, res: Response) {
    try {
      const dto = new CartDTO(req.params.id, req.body);
      const response = await CartService.adicionarAoCarrinho(dto);
      res.status(201).send({ success: true, data: response });
    } catch (err: any) {
      res
        .status(500)
        .send({ message: `Erro ao adicionar ao carrinho: ${err}` });
    }
  }

  static async alterarQuantidade(req: Request, res: Response) {
    try {
      const dto = new UpdateQuantityDTO(req.params.id, req.body);
      const response = await CartService.alterarQuantidade(dto);
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
      const dto = new CartDTO(req.params.id, req.body);
      const response = await CartService.removerProduto(dto);
      res.status(200).send({ success: true, data: response });
    } catch (err: any) {
      if (err.message === "Produto não encontrado")
        return res.status(404).send("Produto não encontrado");
      res.status(500).send({ message: `Erro ao remover produto: ${err}` });
    }
  }

  static async finalziarCompra(req: Request, res: Response) {
    try {
      const dto = new FinalizarDTO(req.params.id, req.body);
      const response = await CartService.comprarCarrinho(dto);
      return res.status(200).send(response);
    } catch (err: any) {
      if (err.message === "Este Carrinho de compras não existe")
        return res.status(404).send(err.message);
      if (err.message === "Dados de produto ou pedido inválidos")
        return res.status(400).send(err.message);
      return res.status(500).send(`Erro interno: ${err}`);
    }
  }
}

export { CartController };
