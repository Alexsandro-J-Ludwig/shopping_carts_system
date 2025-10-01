import { CartService } from "./cart.service";
import { CupomService } from "./cupom.service";

class CarrinhoDescontos {
  static async descontos(total: number) {
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
      case total > 2500:
        totalComDesconto = aplicarDesconto(total, 0.25)        
        break;
      default:
        totalComDesconto = total;
    }

    return totalComDesconto
  }

  static async freteCalculo(total:number, frete:number) {
    let freteDesconto = 0;

    switch (true) {
      case total > 100 && total < 200:
        freteDesconto = Number((frete - frete * 0.2).toFixed(2));
        break;
      case total > 200 && total < 300:
        freteDesconto = Number((frete - frete * 0.4).toFixed(2));
        break;
      case total > 300 && total < 400:
        freteDesconto = Number((frete - frete * 0.6).toFixed(2));
        break;
      case total > 400 && total < 500:
        freteDesconto = Number((frete - frete * 0.8).toFixed(2));
        break;
      case total > 500:
        freteDesconto = 0
        break;
      default:
        freteDesconto = frete
    }

    return freteDesconto
  }

  static async aplicarCupom(total:number, cupomInformado: string) {
    let totalComDesconto = 0;

    const cupom = await CupomService.aplicarCupom(cupomInformado);
    if (!cupom.success) {
      return {
        msg: cupom.msg || "Cupom inválido ou expirado",
      };
    }

    const valorDesconto = cupom.valor_desconto;
      
    totalComDesconto = Number((total - total * valorDesconto!).toFixed(2));

    return {
      cupom: cupomInformado,
      "total com cupom": totalComDesconto,
    };
  }

  static async resumoCompleto(id_cart: string, cupom?: string) {    
    const total = Number((await CartService.calcularTotal(id_cart)).total);
    const carrinho = await CartService.pegarCarrinho(id_cart)
    const frete = 49.00

    const descontos = await this.descontos(total);
    const frete_final = await this.freteCalculo(descontos, frete);
    const cupomAplicado =
      cupom !== undefined ? await this.aplicarCupom(descontos, cupom) : null;

    return {
      success: true,
      carrinho: carrinho,
      totalOriginal: total,
      freteOriginal: frete,
      cupom_aplicado: cupomAplicado?.cupom,
      "frete com desconto": frete_final,
      ...(cupomAplicado && { cupom: cupomAplicado }),
      totalFinal:
        (cupomAplicado?.["total com cupom"] ?? descontos) +
        frete_final,
    };
  }
}

export { CarrinhoDescontos };
