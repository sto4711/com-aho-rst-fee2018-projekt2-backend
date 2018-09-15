import {Address} from "./Address";
import {ContactData} from "./ContactData";
import {DeliveryType} from "./DeliveryType";

export class Order  {
    constructor(shoppingBasket) {
        this.ShoppingBasket = shoppingBasket;
        this.userID = null;
        this.orderDate = new Date();
        this.state = 'new';
        this.deliveryAddress = new Address();
        this.contactData = new ContactData();
        this.deliveryType = new DeliveryType();

    }
}