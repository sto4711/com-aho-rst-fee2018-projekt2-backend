export class Order  {
    constructor(shoppingBasket) {
        this.ShoppingBasket = shoppingBasket;
        this.userID = '';
        this.orderDate = new Date();
        this.state = 'new';
    }
}