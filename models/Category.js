const connection = require('../utility/database'); //connection to mysql database 

module.exports = class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    saveCategory() {
        return connection.execute('INSERT INTO categories (name, description) VALUES (?, ?)', [this.name, this.description]);
    }

    static getAll() {
        return connection.execute('SELECT * FROM categories');
    }

    static getById(id) {
        return connection.execute('SELECT * FROM categories WHERE id=?', [id]);
    }

    static Update(category) {
        return connection.execute('UPDATE products SET categories.name=?, categories.descripton=? WHERE categories.id', [category.name, category.description, category.id]);
    }

    static DeleteById(id) {
        return connection.execute('DELETE FROM categories WHERE id=?', [id]);
    }
}
