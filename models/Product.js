const products = [
    { id: "12313", name: 'Iphone 9', price: 2000, imageUrl: '2.jpg', description: 'Best phone ever made', categoryid: "1" },
    { id: "12314", name: 'Iphone 7', price: 1000, imageUrl: '1.jpg', description: 'Best phone ever made', categoryid: "1" },
    { id: "12315", name: 'Iphone 8', price: 3500, imageUrl: '3.jpg', description: 'Best phone ever made', categoryid: "1" },
    { id: "12316", name: 'Iphone 6', price: 2500, imageUrl: '4.jpg', description: 'Best phone ever made', categoryid: "1" },
    { id: "12317", name: 'Pc laptop Azus', price: 13500, imageUrl: '4.jpg', description: 'Best computer ever made', categoryid: "2" },
    { id: "12318", name: 'samsung washer', price: 12500, imageUrl: '3.jpg', description: 'Best washing machine ever made', categoryid: "3" },
];
module.exports = class Product {
    constructor(name, price, imageUrl, description, categoryid) {
        this.id = (Math.floor(Math.random() * 99999) + 1).toString();
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.categoryid = categoryid;
    }

    saveProduct() {
        products.push(this);
    }

    static getAll() {
        return products;
    }

    static getById(id) {
        return products.find(i => i.id === id);
    }

    static getProductsByCategoryId(categoryid) {
        return products.filter(i =>i.categoryid == categoryid )
    }

    static Update(product) {
        const index = products.findIndex(i => i.id === product.id);
        products[index].name = product.name;
        products[index].price = product.price;
        products[index].imageUrl = product.imageUrl;
        products[index].categoryid = product.categoryid;
        products[index].description = product.description;
    }

    static DeleteById(id) {
        const index = products.findIndex(i => i.id === id);
        products.splice(index, 1);
    }
}

