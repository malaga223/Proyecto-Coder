import express from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

app.use(bodyParser.json());

app.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productManager.getProducts(limit);
    res.json(products);
  });

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    res.json(product);
  });

app.listen(port, () => {
    console.log(`Servidor en puerto: ${port}`);
  });

  const express = require('express');
  const fs = require('fs');
  const { v4: uuidv4 } = require('uuid');
  
  const app = express();
  const PORT = 8080;
  
  const productsRouter = express.Router();
  const cartsRouter = express.Router();
  
  const PRODUCTOS_DB_PATH = './productos.json';
  const CARRITOS_DB_PATH = './carrito.json';
  
  // Middleware para body del request
  app.use(express.json());
  
  // Middleware para CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  // Router de productos
  productsRouter.get('/', (req, res) => {
    const { limit } = req.query;
  
    fs.promises.readFile(PRODUCTOS_DB_PATH)
      .then(data => JSON.parse(data))
      .then(productos => {
        if (limit) {
          res.json(productos.slice(0, limit));
        } else {
          res.json(productos);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error al leer los productos');
      });
  });
  
  productsRouter.get('/:pid', (req, res) => {
    const pid = req.params.pid;
  
    fs.promises.readFile(PRODUCTOS_DB_PATH)
      .then(data => JSON.parse(data))
      .then(productos => {
        const producto = productos.find(p => p.id === pid);
        if (producto) {
          res.json(producto);
        } else {
          res.status(404).send(`Producto con id ${pid} no encontrado`);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error al leer los productos');
      });
  });
  
  productsRouter.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const id = uuidv4();
  
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send('Faltan datos obligatorios');
    }
  
    fs.promises.readFile(PRODUCTOS_DB_PATH)
      .then(data => JSON.parse(data))
      .then(productos => {
        const newProducto = { id, title, description, code, price, status, stock, category, thumbnails };
        const exists = productos.find(p => p.code === code);
        if (exists) {
          return res.status(409).send('Ya existe un producto con el mismo código');
        }
        productos.push(newProducto);
        fs.promises.writeFile(PRODUCTOS_DB_PATH, JSON.stringify(productos, null, 2))
          .then(() => {
            res.status(201).json(newProducto);
          })
          .catch(error => {
            console.log(error);
            res.status(500).send('Error al guardar el producto');
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error al leer los productos');
      });
  });
  
  productsRouter.put('/:pid', (req, res) => {
    const pid = req.params.pid;
  
    fs.promises.readFile(PRODUCTOS_DB_PATH)
      .then(data => JSON.parse(data))
      .then(productos => {
        const producto = productos.find(p => p.id === pid);
        if (!producto) {
          return res.status(404).send(`Producto con id ${pid} no encontrado`);
        }
  
       
  