import { Model, Optional} from "sequelize";

interface CartModelProps {
    id?: string;
    itens: string[];
    valor: string[];
}

interface CartOptionalAttributes extends Optional<CartModelProps, "id"> {}

class CartModel extends Model<CartModelProps>{
    public id?:string;
    public itens!:string[];
    public valor!:string[];
}

export { CartModel }