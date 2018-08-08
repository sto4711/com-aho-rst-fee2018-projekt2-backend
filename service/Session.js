export class Session {
    constructor(userID, token) {
        this.userID = userID;
        this.token = token;
        this.token = token;
        this.tokenDate = Date.now();
    }
}