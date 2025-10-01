import { DataTypes, Model, NOW, Optional } from "sequelize";
import { Connection } from "../config/Db.config";

const sequelize = new Connection().sequelize;

interface cupomPros {
  id?: string;
  cupom: string;
  valor_desconto: number;
  data_criacao?: Date;
  data_expiracao: Date;
  uso_maximo: number;
  uso_atual?: number;
  ativo?: boolean
}

interface CupomOptionalPros extends Optional<cupomPros, "id" | "data_criacao"> {}

class CupomModel extends Model<cupomPros, CupomOptionalPros> {
  public id?: string;
  public cupom!: string;
  public valor_desconto!: number;
  public data_criacao?: Date;
  public data_expiracao!: Date;
  public uso_maximo!: number;
  public uso_atual?: number;
  public ativo?: boolean
}

CupomModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    cupom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor_desconto: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      allowNull: false,
    },
    data_expiracao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    uso_maximo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    uso_atual: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
  },
  {
    sequelize: sequelize,
    modelName: "cupom",
    tableName: "cupom",
    freezeTableName: true,
    timestamps: false,
  }
);

export { CupomModel };
