import { CartRepository } from "../repository/cart.repository";
import { CartService } from "./cart.service";
import { CupomService } from "./cupom.service";

class CarrinhoDescontos {
  static async descontos(id_cart: string) {
    const carrinho = await CartService.calcularTotal(id_cart);
    const total = Number(carrinho.total);

    const aplicarDesconto = (valor: number, porcentual: number) => {
      return Number((valor - valor * porcentual).toFixed(2));
    };

    let totalComDesconto = 0;

    switch (true) {
      case total > 1000 && total < 1500:
        totalComDesconto = aplicarDesconto(total, 0.1);
        break;
      case total > 1500 && total < 2000:
        totalComDesconto = aplicarDesconto(total, 0.15);
        break;
      case total > 2000 && total < 2500:
        totalComDesconto = aplicarDesconto(total, 0.2);
        break;
      default:
        totalComDesconto = total;
    }

    return {
      success: true,
      carrinho: carrinho,
      total: total,
      "total com desconto": totalComDesconto,
    };
  }

  static async freteCalculo(id_cart: string) {
    const carrinho = await CartService.calcularTotal(id_cart);
    const total = Number(carrinho.total);

    const freteFixo = Number(await CartRepository.pegarFrete(id_cart));
    let freteDesconto = 0;

    switch (true) {
      case total > 100 && total < 200:
        freteDesconto = Number((freteFixo - freteFixo * 0.2).toFixed(2));
        break;
      case total > 200 && total < 300:
        freteDesconto = Number((freteFixo - freteFixo * 0.4).toFixed(2));
        break;
      case total > 300 && total < 400:
        freteDesconto = Number((freteFixo - freteFixo * 0.6).toFixed(2));
        break;
      case total > 400 && total < 500:
        freteDesconto = Number((freteFixo - freteFixo * 0.8).toFixed(2));
        break;
      default:
        freteDesconto = freteFixo;
    }

    return {
      carrinho: carrinho,
      total: total,
      frete: freteFixo,
      "frete com desconto": freteDesconto,
    };
  }

  static async aplicarCupom(id_cart: string, cupomInformado: string) {
    const carrinho = await CartService.calcularTotal(id_cart);
    const total = Number(carrinho.total);
    let totalComDesconto = 0;

    const cupom = await CupomService.aplicarCupom(cupomInformado);
    if (!cupom.success) {
      return {
        carrinho,
        total,
        msg: cupom.msg || "Cupom inválido ou expirado",
      };
    }

    const valorDesconto = cupom.cupom?.valor_desconto;
    totalComDesconto = Number((total - total * valorDesconto!).toFixed(2));

    return {
      carrinho,
      total,
      cupom: cupomInformado,
      "total com cupom": totalComDesconto,
      usos_restantes: cupom.usos_restantes,
      msg: cupom.msg,
    };
  }

  static async resumoCompleto(id_cart: string, cupom?: string){
    const descontos = await this.descontos(id_cart);
    const frete = await this.freteCalculo(id_cart);
    const cupomAplicado = cupom 
    ? await this.aplicarCupom(id_cart, cupom)
    : null;

    return {
        ...descontos,
        frete: frete.frete,
        "frete com desconto": frete["frete com desconto"],
        ...(cupomAplicado && { "cupom aplicado": cupomAplicado}),
    }
  }
}

export { CarrinhoDescontos }