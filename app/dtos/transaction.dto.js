class TransactionDTO {
    constructor(transaction) {
        this.id = transaction.id;
        this.user_id = transaction.user_id;
        this.total = transaction.total;
        this.created_at = transaction.created_at;

        this.items = transaction.items
            ? transaction.items.map(item => ({
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
            }))
            : [];
    }

    static fromRequest(body, userId) {
        return {
            user_id: userId,
            items: body.items.map(i => ({
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
            }))
        };
    }
}

module.exports = TransactionDTO;
