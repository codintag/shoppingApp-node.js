const categories = [
    { id: "1", name: 'Smartphone',description: 'Les catégories de smartphone' },
    { id: "2", name: 'PC portable',description: 'Les catégories d\'ordinateur portable' },
    { id: "3", name: 'Electroménager',description: 'Les catégories d\'electroménager' },
];
module.exports = class Category {
    constructor(name, description) {
        this.id = (categories.length + 1).toString();
        this.name = name;
        this.description = description;
    }

    saveCategory() {
        categories.push(this);
    }

    static getAll() {
        return categories;
    }

    static getById(id) {
        return category = categories.find(i => i.id === id);
    }

    static Update(category) {
        const index = categories.findIndex(i => i.id === category.id);
        categories[index].name = category.name;
        categories[index].description = category.description;
    }

    static DeleteById(id) {
        const index = categories.findIndex(i => i.id === id);
        categories.splice(index, 1);
    }
}
