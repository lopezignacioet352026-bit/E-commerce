import express from 'express';
import cors from 'cors';
import dbPool from './db.js';
import * as comprasController from './comprasController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Endpoint: Obtener el catálogo de productos
app.get('/api/productos', async (req, res) => {
  try {
    const [productos] = await dbPool.query(
      'SELECT id, nombre, descripcion, precio, categoria, talle, stock, imagen_url FROM productos'
    );
    res.json(productos);
  } catch (error) {
    console.error('Error al consultar el catálogo:', error);
    res.status(500).json({ error: 'No se pudo cargar el catálogo de productos.' });
  }
});

// Endpoint: Registrar compra y actualizar stock
app.post('/api/compras', async (req, res) => {
  await comprasController.postCrearCompra(req, res, dbPool);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});