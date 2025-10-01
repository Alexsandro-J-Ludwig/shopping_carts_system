import { ValidarDTO } from "./ValidarDTO";

class CartDTO {
  public id_cart: string;
  public readonly itens: string;
  public readonly qtd: number;
  public valor: number;
  public readonly cupom?: string | "";

  constructor(
    id_cart: string,
    body: { itens: string; qtd: number; valor: number, cupom:string }
  ) {
    this.id_cart = id_cart;
    this.itens = body.itens;
    this.qtd = body.qtd;
    this.valor = body.valor;
    this.cupom = body.cupom;

    ValidarDTO.validarTexto(this.itens, "itens")
    ValidarDTO.validarNumeroDecimalPositivo(this.qtd, "quantidade")
    if(this.cupom !== undefined){
      ValidarDTO.validarTexto(this.cupom, "cupom")
    }
  }
}

export { CartDTO };
