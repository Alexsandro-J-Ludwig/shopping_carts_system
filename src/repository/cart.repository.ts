import { DataTypes, Sequelize } from "sequelize";
import { Connection } from "../config/Db.config";
import { CartModel } from "../model/cart.model";

class CartRepository{
    private repository: Sequelize;

    constructor(){
        this.repository = new Connection().sequelize
    }

    static inicialize(){
        new CartRepository().initCart();
    }

    initCart(){
        CartModel.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            itens: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            },
            valor: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            }
        }, {
            sequelize: this.repository,
            tableName: 'cart',
            timestamps: false
        })
    }
}

export { CartRepository}