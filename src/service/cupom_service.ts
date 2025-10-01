import { CupomDTO } from "../dto/cupom_dto";
import { CupomRepository } from "../repository/cupom_repository";

class CupomService {
  static async criarCupom(dto: CupomDTO) {
    const existe = await CupomRepository.pegarCupom(dto.cupom);
    
    if (existe && existe.dataValues.cupom === dto.cupom)
      throw new Error("Cupom já existe ou está ativo");

    const cupom = await CupomRepository.criarCupom(dto);
    return { success: true, data: cupom };
  }

  static async pegarCupons() {
    const cupons = await CupomRepository.pegarCuponsValidos();
    if (cupons.length === 0) throw new Error("Nenhum cupom valido encontrado");

    return { success: true, data: cupons };
  }

  static async aplicarCupom(cupom: string) {
    const existe = await CupomRepository.pegarCupom(cupom);
    if (!existe) throw new Error("Cupom não encontrado ou expirado");

    const { uso_atual, uso_maximo } = existe;

    if (uso_atual! >= uso_maximo) {
      await CupomRepository.desativarCupom(cupom);
      return {
        success: false,
        msg: "Este cupom atingiu o limite de uso e foi desativado",
      };
    }

    await CupomRepository.acrescentarUso(cupom);

    const usosRestantes = uso_maximo - (uso_atual! + 1);

    if (usosRestantes <= 0) {
      await CupomRepository.desativarCupom(cupom);
    }

    return {
      success: true,
      cupom: existe.dataValues.cupom,
      valor_desconto: existe.dataValues.valor_desconto,
    };
  }

  static async excluirCupom(cupom: string) {
    const existe = await CupomRepository.pegarCupom(cupom);
    if (!existe) throw new Error("Cupom não encontrado");

    await CupomRepository.removerCupom(cupom);
    return { success: true, msg: "Cupom deletado com sucesso" };
  }
}

export { CupomService };
