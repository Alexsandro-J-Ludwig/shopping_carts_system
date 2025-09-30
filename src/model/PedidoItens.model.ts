import { DataTypes, Model, NOW, Optional } from "sequelize";
import { Connection } from "../config/Db.config";

const sequelize = new Connection().sequelize;

interface PedidoItensPros {
  id?: string;
  id_pedido: string;
  id_produto: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
}

interface PedidoItensOptionalPros
  extends Optional<PedidoItensPros, "id"> {}

class PedidoItensModel extends Model<PedidoItensPros, PedidoItensOptionalPros> {
  public id?: string;
  public id_pedido!: string;
  public id_produto!: string;
  public quantidade!: number;
  public valor_unitario!: number;
  public subtotal!: number;
}

PedidoItensModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    id_pedido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_produto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_unitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Pedido_Itens",
    tableName: "pedido_itens",
    freezeTableName: true,
    timestamps: false,
  }
);

export { PedidoItensModel };
