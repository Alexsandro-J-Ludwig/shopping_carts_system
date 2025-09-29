import { CartModel } from "../model/cart.model";

class CartService {
    static async addToCart(body: { itens: string[], valor: string[] }){
        const cart = CartModel.in
        return cart
    }

    static async getCart(id: string){
        const cart = CartModel.findByPk(id);
        return cart
    }

    static async calculateTotal(){
        const cart = CartModel.findAll();

        let total = 0
        cart.map((idx) => {
            total += idx.valor
        })

        return total;
    }
}

export { CartService }