import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Connection } from "../config/Db.config";

const sequelize = new Connection().sequelize;

interface CartItemPros {
  id?: string;
  id_cart: string;
  qtd: number;
  itens: string;
  valor: number;
}

interface CartOptionalAttributes extends Optional<CartItemPros, "id"> {}

class CartItemModel extends Model<CartItemPros, CartOptionalAttributes> {
  public id?: string;
  public id_cart!: string;
  public qtd!: number;
  public itens!: string;
  public valor!: number;
}

CartItemModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    id_cart: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    qtd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    itens: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Cart_itens",
    tableName: "cart_itens",
    freezeTableName: true,
    timestamps: false,
  }
);

export { CartItemModel };
