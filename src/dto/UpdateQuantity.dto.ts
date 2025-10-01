import { isEmpty, isUUID } from "validator";

class UpdateQuantityDTO {
  public id_cart: string;
  public itens: string;
  public qtd: number;

  constructor(
    id_cart: string,
    body: { itens: string; qtd: number; valor: number }
  ) {
    this.id_cart = id_cart;
    this.itens = body.itens;
    this.qtd = body.qtd;

    // Validações
    if (!id_cart || !isUUID(id_cart))
      throw new Error("id_cart deve ser um UUID válido");

    if (!this.itens || isEmpty(this.itens))
      throw new Error("Campo 'itens' não pode estar vazio");

    if (!Number.isInteger(this.qtd) || this.qtd <= 0)
      throw new Error("Quantidade deve ser um número inteiro positivo");
  }
}

export { UpdateQuantityDTO };
