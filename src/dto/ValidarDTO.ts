import { now } from "sequelize/lib/utils";
import { isDate, isEmpty, isUUID } from "validator";

class ValidarDTO {
  static validarUUID(id: string, campo: string) {
    if (!id || !isUUID(id)) {
      throw new Error(`${campo} deve ser um UUID válido`);
    }
  }

  static validarTexto(texto: string, campo: string) {
    if (!texto || isEmpty(texto)) {
      throw new Error(`Campo '${campo}' não pode estar vazio`);
    }
  }

  static validarNumeroDecimalPositivo(numero: number, campo: string) {
    if (typeof numero !== "number" || isNaN(numero) || numero <= 0) {
      throw new Error(`${campo} deve ser um número decimal positivo`);
    }
  }

  static validarData(data: Date, campo: string) {
    const dataHoje = new Date();
    const dataParaValidar = new Date(data);

    if (dataParaValidar < dataHoje) {
      throw new Error(
        `Data inválida: o campo '${campo}' não pode ser antes da data atual.`
      );
    }
  }
}

export { ValidarDTO };
