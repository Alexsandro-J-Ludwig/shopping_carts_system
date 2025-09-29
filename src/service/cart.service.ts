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
    const existe = await CartItemModel.findOne({ where: { id_cart } });

    //Cria carrinho APENAS se o UUID for inalido ou se o id de carrinho nao existir
    if (!isUUID(id_cart) || !existe) {
      const newId = await this.criarCarrinho();
      id_cart = newId.data.dataValues.id || "";
    }

    const data = {
      id_cart,
      ...body,
    };

    await CartItemModel.create(data);

    const cart = await this.pegarCarrinho(id_cart);
    return {
      success: true,
      header: id_cart,
      data: cart.data,
      alert: "O id_cart deve ser salvo para adicionar no mesmo carrinho",
    };
  }

  static async pegarCarrinho(id_cart: string) {
    const cart = await CartItemModel.findAll({ where: { id_cart } });
    if (!cart) throw new Error("Carrinho não encontrado");
    console.log(cart);

    return { success: true, data: cart };
  }

  static async calcularTotal(id_cart: string) {
    const cart = await CartItemModel.findAll({ where: { id_cart } });
    if (!cart) throw new Error("Carrinho não encontrado");

    let total = 0;
    Object.values(cart).map((value) => {
      total += value.dataValues.valor * value.dataValues.qtd;
    });

    const totalValor = total.toFixed(2);

    return { success: true, total: totalValor };
  }
}

export { CartService };
