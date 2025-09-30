import { DataTypes, Model, NOW, Optional } from "sequelize";
import { Connection } from "../config/Db.config";

const sequelize = new Connection().sequelize;

interface PedidoPros {
  id?: string;
  id_cart: string;
  data_compra?: Date;
  total: number;
  frete: number;
  cupom_aplicado?: string;
  total_final: number;
}

interface PedidoOptionalPros
  extends Optional<PedidoPros, "id" | "cupom_aplicado" | "data_compra"> {}

class PedidoModel extends Model<PedidoPros, PedidoOptionalPros> {
  public id?: string;
  public id_cart!: string;
  public data_compra?: Date;
  public total!: number;
  public frete!: number;
  public cupom_aplicado?: string;
  public total_final!: number;
}

PedidoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    id_cart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_compra: {
      type: DataTypes.DATE,
      defaultValue: NOW
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    frete: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cupom_aplicado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_final: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Pedido",
    tableName: "pedido",
    freezeTableName: true,
    timestamps: false,
  }
);

export { PedidoModel };
