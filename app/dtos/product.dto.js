class ProductResponseDTO {
    constructor(product) {
        this.id = product.id;
        this.category_id = product.category_id;
        this.name = product.name;
        this.description = product.description;
        this.image = product.image;
        this.price = product.price;
        this.stock = product.stock;
        this.created_at = product.created_at;
        this.updated_at = product.updated_at;
        this.deleted_at = product.deleted_at;
    }
}

module.exports = {
    ProductResponseDTO
};