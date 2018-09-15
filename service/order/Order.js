import {Address} from "./Address";

export class Order  {
    constructor(shoppingBasket) {
        this.ShoppingBasket = shoppingBasket;
        this.userID = null;
        this.orderDate = new Date();
        this.state = 'new';
        this.deliveryAddress = new Address();
    }
}