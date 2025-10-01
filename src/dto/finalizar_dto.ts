import { ValidarDTO } from "./validar_dto";

class FinalizarDTO {
  public readonly id_cart: string;
  public readonly cupom: string;

  constructor(
    id_cart: string,
    body: { cupom: string }
  ) {
    this.id_cart = id_cart;
    this.cupom = body.cupom;

    ValidarDTO.validarUUID(this.id_cart, "id_cart")
    if(this.cupom !== undefined) {
        ValidarDTO.validarTexto(this.cupom, "cupom")
    }
  }
}

export { FinalizarDTO };
