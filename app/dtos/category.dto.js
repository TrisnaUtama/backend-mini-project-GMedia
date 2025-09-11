class CategoryResponseDTO {
    constructor(category) {
        this.id = category.id;
        this.name = category.name;
        this.created_at = category.created_at;
        this.updated_at = category.updated_at;
        this.deleted_at = category.deleted_at;
    }
}

module.exports = {
    CategoryResponseDTO
};