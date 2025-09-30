import { CartRepository } from "../repository/cart.repository";
import { isUUID } from "validator";
import { CarrinhoDescontos } from "./cart.descontos.service";
import { PedidosRepository } from "../repository/Pedido.repository";

class CartService {
  static async criarCarrinho() {
    const cart = await CartRepository.criarCarrinho();

    return { success: true, data: cart };
  }

  static async adicionarAoCarrinho(
    id_cart: string,
    body: { qtd: number; itens: string; valor: number }
  ) {
    const existe = await CartRepository.pegarCarrinho(id_cart);

    //Cria carrinho APENAS se o UUID for inalido ou se o id de carrinho nao existir
    if (!isUUID(id_cart) || !existe) {
      const newId = await this.criarCarrinho();
      id_cart = newId.data.dataValues.id || "";
    }

    const existeProduto = await CartRepository.pegarProduto({
      id_cart: id_cart,
      itens: body.itens,
    });

    if (existeProduto && existeProduto.dataValues.itens === body.itens) {
      await CartRepository.alterarQuantidade({
        id_cart,
        itens: body.itens,
        qtd: Number(existeProduto.dataValues.qtd + body.qtd),
        valor: Number(existeProduto.dataValues.valor + body.valor * body.qtd),
      });
    }
    if (!existeProduto) {
      const data = {
        id_cart,
        ...body,
        valor: body.qtd > 1 ? body.valor * body.qtd : body.valor,
      };

      await CartRepository.adicionarAoCarrinho(data);
    }

    const cart = await this.pegarCarrinho(id_cart);
    return cart;
  }

  static async alterarQuantidade(
    id_cart: string,
    body: { qtd: number; itens: string }
  ) {
    const existe = await CartRepository.pegarProduto({
      id_cart,
      itens: body.itens,
    });
    if (!existe) throw new Error("Produto no carrinho não encontrado");

    const valorUnitario = existe.dataValues.valor / existe.dataValues.qtd;

    if (body.qtd <= 0) throw new Error("Quantidade inválida");

    const data = {
      qtd: body.qtd,
      valor: Number(valorUnitario * body.qtd).toFixed(2),
    };

    await CartRepository.alterarQuantidade({
      id_cart,
      itens: body.itens,
      valor: Number(data.valor),
      qtd: data.qtd,
    });

    return data;
  }

  static async pegarCarrinho(id_cart: string) {
    const cart = await CartRepository.pegarCarrinho(id_cart);
    if (!cart) throw new Error("Carrinho não encontrado");

    return cart;
  }

  static async calcularTotal(id_cart: string) {
    const cart = await CartRepository.pegarCarrinho(id_cart);
    if (!cart) throw new Error("Carrinho não encontrado");

    let total = 0;
    Object.values(cart).map((value) => {
      total += value.dataValues.valor * value.dataValues.qtd;
    });

    const totalValor = total.toFixed(2);

    //Este objeto sera usado em outros metodos em Carrinho descontos, favor nao alterar para nao quebrar o sistema de descontos
    return { success: true, carrinho: cart, total: totalValor };
  }

  static async removerProduto(id_cart: string, itens: string) {
    const cart = await CartRepository.pegarProduto({ id_cart, itens: itens });
    if (!cart) throw new Error("Produto não encontrado");

    await cart.destroy();

    return cart;
  }

  static async comprarCarrinho(id_cart: string, body: { cupom: string }) {
    const existe = await CartRepository.pegarCarrinho(id_cart);
    if (!existe) throw new Error("Este Carrinho de compras não existe");

    const descontos = await CarrinhoDescontos.resumoCompleto(
      id_cart,
      body.cupom
    );

    const dataPedido = {
      id_cart,
      total: descontos.total,
      frete: descontos["frete com desconto"],
      cupom_aplicado: descontos["cupom aplicado"],
      total_final: descontos["total com desconto"],
    };
    const pedido = await PedidosRepository.criarPedido(dataPedido);

    const produtos = await Promise.all(
      descontos.carrinho.carrinho.map(async (item) => {
        return await CartRepository.pegarProduto({
          id_cart: item.id_cart,
          itens: item.itens,
        });
      })
    );

    for (const produto of produtos) {
      if (!produto || !produto.id || !pedido?.id) {
        throw new Error("Dados de produto ou pedido inválidos");
      }

      const item = {
        id_pedido: pedido!.id,
        id_produto: produto!.id,
        quantidade: produto!.qtd,
        valor_unitario: produto!.valor / produto!.qtd,
        subtotal: produto!.valor,
      };
      await PedidosRepository.criarItensPedido(item);
    }

    const pedidoHistorico = await PedidosRepository.listaPedido(id_cart);
    return { success: true, pedido: pedidoHistorico };
  }
}

export { CartService };
