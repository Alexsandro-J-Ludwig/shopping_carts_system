import { CartRepository } from "../repository/cart.repository";
import { isUUID } from "validator";
import { CarrinhoDescontos } from "./cart.descontos.service";
import { PedidosRepository } from "../repository/pedido.repository";
import { CartDTO } from "../dto/cartDTO";
import { UpdateQuantityDTO } from "../dto/updateQuantity.dto";
import { FinalizarDTO } from "../dto/finalizar.dto";

class CartService {
  static async criarCarrinho() {
    const cart = await CartRepository.criarCarrinho();

    return { success: true, data: cart };
  }

  static async adicionarAoCarrinho(dto: CartDTO) {
    if (isUUID(dto.id_cart)) {
      
    }
    //Cria carrinho APENAS se o UUID for inalido ou se o id de carrinho nao existir
    if (!isUUID(dto.id_cart)) {
      const newId = await this.criarCarrinho();
      dto.id_cart = newId.data.dataValues.id || "";
    } 
    if(isUUID(dto.id_cart)){
      const existe = await CartRepository.pegarCarrinho(dto.id_cart);
      if(!existe) {
        const newId = await this.criarCarrinho();
        dto.id_cart = newId.data.dataValues.id || ""
      }
    }

    const existeProduto = await CartRepository.pegarProduto({id_cart:dto.id_cart, itens:dto.itens});
    
    if (existeProduto && existeProduto.dataValues.itens === dto.itens) {
      if(isNaN(existeProduto.dataValues.valor))
        throw new Error("Nao eh um numero")
      await CartRepository.alterarQuantidade({
        qtd: Number(existeProduto.dataValues.qtd + dto.qtd),
        valor: Number(existeProduto.dataValues.valor) + (dto.valor * dto.qtd),
      }, {
        ...dto
      });
    }
    if (!existeProduto) {
      (dto.valor = dto.qtd > 1 ? dto.valor * dto.qtd : dto.valor),
        await CartRepository.adicionarAoCarrinho(dto);
    }

    const cart = await this.pegarCarrinho(dto.id_cart);
    return cart;
  }

  static async alterarQuantidade(dto: UpdateQuantityDTO) {
    const existe = await CartRepository.pegarProduto(dto);
    if (!existe) throw new Error("Produto no carrinho não encontrado");

    const valorUnitario = existe.dataValues.valor / existe.dataValues.qtd;

    if (dto.qtd <= 0) throw new Error("Quantidade inválida");

    const data = {
      qtd: dto.qtd,
      valor: Number(valorUnitario * dto.qtd).toFixed(2),
    };

    await CartRepository.alterarQuantidade({
      valor: Number(data.valor),
      qtd: data.qtd,
    }, {
      ...dto
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

  static async removerProduto(dto: { id_cart: string; itens: string }) {
    const cart = await CartRepository.pegarProduto(dto);
    if (!cart) throw new Error("Produto não encontrado");

    await cart.destroy();

    return cart;
  }

  static async comprarCarrinho(dto: FinalizarDTO) {
    const existe = await CartRepository.pegarCarrinho(dto.id_cart);
    
    if (!existe) throw new Error("Este Carrinho de compras não existe");
    
    const descontos = await CarrinhoDescontos.resumoCompleto(
      dto.id_cart,
      dto.cupom
    );

    const dataPedido = {
      id_cart: dto.id_cart,
      total: descontos.totalOriginal,
      frete: descontos["frete com desconto"],
      cupom_aplicado: descontos.cupom?.cupom,
      total_final: descontos.totalFinal
    };
    
    const pedido = await PedidosRepository.criarPedido(dataPedido);

    const idDoPedido = pedido.dataValues.id;

    const itensDoPedido = descontos.carrinho.map((itemCarrinho) => {
      return {
        id_pedido: idDoPedido!,
        id_produto: itemCarrinho.dataValues.id!,
        quantidade: itemCarrinho.dataValues.qtd,
        valor_unitario: itemCarrinho.dataValues.valor / itemCarrinho.dataValues.qtd,
        subtotal: itemCarrinho.dataValues.valor,
      };
    });

    await PedidosRepository.criarItensPedido(itensDoPedido);
  
    const pedidoHistorico = await PedidosRepository.listaPedido(dto.id_cart);
    return { success: true, pedido: pedidoHistorico };
  }
}

export { CartService };
