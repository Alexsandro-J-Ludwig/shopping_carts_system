import { ValidarDTO } from "./ValidarDTO";

class CupomDTO {
  public readonly cupom: string;
  public readonly valor_desconto: number;
  public readonly data_expiracao: Date;
  public readonly uso_maximo: number;

  constructor(
    body: { cupom: string; valor_desconto: number; data_expiracao: Date, uso_maximo:number }
  ) {
    this.cupom = body.cupom;
    this.valor_desconto = body.valor_desconto;
    this.data_expiracao = body.data_expiracao;
    this.uso_maximo = body.uso_maximo;

    ValidarDTO.validarTexto(this.cupom, "cupom")
    ValidarDTO.validarNumeroDecimalPositivo(this.valor_desconto, "valor de desconto")
    ValidarDTO.validarData(this.data_expiracao, "data de expiracao")
    ValidarDTO.validarNumeroDecimalPositivo(this.uso_maximo, "uso maximo")
  }
}

export { CupomDTO };
