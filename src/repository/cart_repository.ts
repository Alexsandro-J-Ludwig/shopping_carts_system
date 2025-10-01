import { CartItemModel } from "../model/cart_item_model";
import { CartModel } from "../model/cart_model";

interface ItensProp {
  id_cart: string;
  qtd: number;
  itens: string;
  valor: number;
}

interface CartKey {
  id_cart: string;
  itens?: string;
}

class CartRepository {
  static async criarCarrinho() {
    return await CartModel.create();
  }

  static async adicionarAoCarrinho(data: ItensProp) {
    return await CartItemModel.create(data);
  }

  static async alterarQuantidade(data: {qtd: number, valor:number}, where: CartKey) {
    return await CartItemModel.update({qtd:data.qtd, valor: data.valor}, {
      where: { id_cart: where.id_cart, itens: where.itens },
    });
  }

  static async pegarCarrinho(id_cart:string) {
    return await CartItemModel.findAll({where: { id_cart }});
  }

  static async pegarProduto(where: CartKey){
    return await CartItemModel.findOne({ where: { id_cart: where.id_cart, itens: where.itens}})
  }

  static async removerProduto(where: CartKey) {
    return await CartItemModel.destroy({
      where: { id_cart: where.id_cart, itens: where.itens },
    });
  }

  static async pegarFrete(id_cart:string){
    return await CartModel.findByPk(id_cart)
  }
}

export { CartRepository };
