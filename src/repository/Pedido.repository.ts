import { PedidoItensModel } from "../model/pedidoItens.model";
import { PedidoModel } from "../model/pedido.model";

interface PedidosRepositoryProp {
  id_cart: string;
  total: number;
  frete: number;
  cupomAplicado?: string;
  total_final: number;
}

interface ItensRepositoryProp {
  id_pedido: string;
  id_produto: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
}

class PedidosRepository {
  static async criarPedido(poedido: PedidosRepositoryProp) {
    return await PedidoModel.create(poedido);
  }

  static async criarItensPedido(itens: ItensRepositoryProp[]) {
    return await PedidoItensModel.bulkCreate(itens);
  }

  static async listaPedido(id_cart:string) {
    const pedido = await PedidoModel.findOne({
      where: { id_cart: id_cart },
    });

    const itens = await PedidoItensModel.findAll({
      where: { id_pedido: pedido?.dataValues.id },
    });

    return { pedido, itens };
  }

  static async listarTodosOsPedidos() {
    const pedidos = await PedidoModel.findAll();

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await PedidoItensModel.findAll({
          where: { id_pedido: pedido.id },
        });

        return {
          pedido,
          itens,
        };
      })
    );

    return pedidosComItens;
  }
}

export { PedidosRepository };
