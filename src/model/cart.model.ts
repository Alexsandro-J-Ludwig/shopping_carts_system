import { DataTypes, Model, Optional } from "sequelize";
import { Connection } from "../config/Db.config";

const sequelize = new Connection().sequelize;

interface CartModelProps {
    id?: string;
}

class CartModel extends Model<CartModelProps> {
    public id?: string;
}

CartModel.init({},{
    sequelize: sequelize,
    modelName: "Cart",
    tableName: "cart",
    freezeTableName: true,
    timestamps: false,
})

export { CartModel }