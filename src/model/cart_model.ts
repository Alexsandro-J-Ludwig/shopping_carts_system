import { Model } from "sequelize";
import { Connection } from "../config/db.config";

const sequelize = new Connection().sequelize;

interface CartModelProps {
    id?: string;
    frete?: number;
}

class CartModel extends Model<CartModelProps> {
    public id?: string;
    public frete?: number
}

CartModel.init({},{
    sequelize: sequelize,
    modelName: "cart",
    tableName: "cart",
    freezeTableName: true,
    timestamps: false,
})

export { CartModel }