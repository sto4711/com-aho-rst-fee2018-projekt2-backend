export class ShoppingBasketItem {
    constructor(articleID, articleName,articlePrice,articleAvailability,articleAmount,itemNumber,articleQueryParameter) {
        this.articleID = articleID;
        this.articleName = articleName;
        this.articlePrice = articlePrice;
        this.articleAvailability = articleAvailability;
        this.articleAmount = articleAmount;
        this.itemNumber = itemNumber;
        this.articlePriceSum = this.articlePrice * this.articleAmount;
        this.articleQueryParameter = articleQueryParameter;
    }

}
