class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.currentId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Se necesita ingresar todos los datos.");
      return;
    }
    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      console.error("Un producto con ese nombre ya existe.");
      return;
    }
    const newProduct = {
      id: this.currentId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    console.log("Se agregó el producto!");
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("No se encontro el producto.");
      return;
    }
    return product;
  }
}

const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  addProduct(product) {
    const products = this.getProducts();
    const existingProduct = products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error(`El producto ${product.code} ya existe.`);
    }
    const newProduct = {
      ...product,
      id: this.getNextId(),
    };
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return newProduct;
  }

  getProducts() {
    const data = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(data);
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`No se encontró ningún producto con ese id ${id}`);
    }
    return product;
  }

  updateProduct(id, fieldsToUpdate) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`No se encontró ningún producto con ese id ${id}`);
    }
    products[index] = {
      ...products[index],
      ...fieldsToUpdate,
      id,
    };
    fs.writeFileSync(this.path, JSON.stringify(products));
    return products[index];
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`No se encontró ningún producto con ese id ${id}`);
    }
    const deletedProduct = products.splice(index, 1)[0];
    fs.writeFileSync(this.path, JSON.stringify(products));
    return deletedProduct;
  }

  getNextId() {
    const products = this.getProducts();
    if (products.length === 0) {
      return 1;
    }
    return Math.max(...products.map((p) => p.id)) + 1;
  }
}
