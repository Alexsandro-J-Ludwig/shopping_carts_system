import { CartModel } from "../model/cart.model";
import { CartItemModel } from "../model/Cart_Iten.model";
import { isUUID } from "validator";

class CartService {
  static async criarCarrinho() {
    const cart = await CartModel.create();

    return { success: true, data: cart };
  }

  static async adicionarAoCarrinho(
    id_cart: string,
    body: { qtd: number; itens: string; valor: number }
  ) {
    const existe = await CartModel.findOne({ where: { id: id_cart } });

    //Cria carrinho APENAS se o UUID for inalido ou se o id de carrinho nao existir
    if (!isUUID(id_cart) || !existe) {
      const newId = await this.criarCarrinho();
      id_cart = newId.data.dataValues.id || "";
    }

    const existeProduto = await CartItemModel.findOne({
      where: { id_cart, itens: body.itens },
    });

    if (existeProduto && existeProduto.dataValues.itens === body.itens) {
      await CartItemModel.update(
        {
          qtd: existeProduto.dataValues.qtd + body.qtd,
          valor:
            Number(existeProduto.dataValues.valor) +
            Number(body.valor * body.qtd),
        },
        {
          where: { id_cart, itens: body.itens },
        }
      );
    }
    if (!existeProduto) {
      const data = {
        id_cart,
        ...body,
        valor: body.qtd > 1 ? body.valor * body.qtd : body.valor,
      };

      await CartItemModel.create(data);
    }

    const cart = await this.pegarCarrinho(id_cart);
    return cart;
  }

  static async alterarQuantidade(
    id_cart: string,
    body: { qtd: number, itens: string; }
  ) {
    const existe = await CartItemModel.findOne({
      where: { id_cart, itens: body.itens },
    });
    if (!existe) throw new Error("Produto no carrinho não encontrado");

    const valorUnitario = existe.dataValues.valor / existe.dataValues.qtd;

    if(body.qtd <= 0) throw new Error("Quantidade inválida");

    const data = {
      qtd: body.qtd,
      valor: Number(valorUnitario * body.qtd).toFixed(2),
    };

    await CartItemModel.update(data, {
      where: { id_cart, itens: body.itens },
    });

    return data
  }

  static async pegarCarrinho(id_cart: string) {
    const cart = await CartItemModel.findAll({ where: { id_cart } });
    if (!cart) throw new Error("Carrinho não encontrado");
    console.log(cart);

    return cart
  }

  static async calcularTotal(id_cart: string) {
    const cart = await CartItemModel.findAll({ where: { id_cart } });
    if (!cart) throw new Error("Carrinho não encontrado");

    let total = 0;
    Object.values(cart).map((value) => {
      total += value.dataValues.valor * value.dataValues.qtd;
    });

    const totalValor = total.toFixed(2);

    return totalValor
  }

  static async removerProduto(id_cart: string, nome: string) {
    const cart = await CartItemModel.findOne({
      where: { id_cart, itens: nome },
    });
    if (!cart) throw new Error("Produto não encontrado");

    await cart.destroy();

    return cart
  }
}

export { CartService };
