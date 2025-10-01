import { Op, Sequelize } from "sequelize";
import { CupomModel } from "../model/cupom.model";

interface CupomProp {
  cupom: string;
  valor_desconto: number;
  data_expiracao: Date;
  uso_maximo: number;
}

class CupomRepository {
  static async criarCupom(cupom: CupomProp) {
    return await CupomModel.create(cupom);
  }

  static async pegarCupom(cupom: string) {
    return await CupomModel.findOne({
      where: {
        cupom,
        data_expiracao: { [Op.gt]: new Date() },
        uso_atual: { [Op.lt]: Sequelize.col("uso_maximo") },
        ativo: true
      },
    });
  }

  static async pegarCuponsValidos() {
    return await CupomModel.findAll({
      where: {
        data_expiracao: { [Op.gt]: new Date() },
        uso_atual: { [Op.lt]: Sequelize.col("uso_maximo") },
        ativo: true
      },
    });
  }

  static async acrescentarUso(cupom: string) {
    return await CupomModel.increment("uso_atual", { by: 1, where: { cupom } });
  }

  static async desativarCupom(cupom: string) {
    const [linhasAfetadas] = await CupomModel.update({ ativo: false }, { where: { cupom } });
    return linhasAfetadas > 0 
    ? { success: true, message: "Cupom desativado com sucesso"}
    : { success: false, message: "Cupom não encontrado ou já inativo"}
  }

  static async removerCupom(cupom: string) {
    return await CupomModel.destroy({ where: {cupom}});
  }
}

export { CupomRepository };
