import { Request, Response } from "express";
import { CupomService } from "../service/cupom.service";
import { CupomDTO } from "../dto/cupomDTO";


class CupomController {
  static async criarCupom(req: Request, res: Response) {
    const dto = new CupomDTO(req.body)
    try {
      const response = await CupomService.criarCupom(dto);
      return res.status(201).send(response);
    } catch (err: any) {
        if(err.message === "Cupom já existe ou está ativo")
            return res.status(409).send("Cupom já existe ou está ativo");
        return res.status(500).send(`Erro interno: ${err}`)
    }
  }

  static async pegarCupons(_: Request, res: Response) {
    try {
      const response = await CupomService.pegarCupons();
      return res.status(200).send(response);
    } catch (err: any) {
        if(err.message === "Nenhum cupom valido encontrado")
            return res.status(404).send("Nenhum cupom valido encontrado")
        return res.status(500).send(`Erro interno: ${err}`)
    }
  }

  static async removerCupom(req: Request, res: Response){
    try {
        const response = await CupomService.excluirCupom(req.params.cupom);
        return res.status(204).send(response)
    } catch (err:any) {
        if(err.message === "Cupom não encontrado")
            return res.status(409).send("Cupom não encontrado");
        return res.status(500).send({ msg: `Erro interno: ${err}`})
    }
  }
}

export { CupomController }