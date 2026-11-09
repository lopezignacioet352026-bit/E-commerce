import * as comprasService from './comprasService.js';

export async function postCrearCompra(req, res, dbPool) {
  try {
    const { usuario_id, items } = req.body;
    if (!usuario_id || !items) {
      return res.status(400).json({ error: 'Datos de la compra incompletos.' });
    }
    const resultado = await comprasService.procesarCompra(dbPool, usuario_id, items);
    
    res.status(201).json({
      mensaje: 'Compra registrada con éxito.',
      compraId: resultado.compraId,
      total: resultado.total
    });
  } catch (error) {
    console.error('Error al procesar la compra:', error.message);
    res.status(400).json({ error: error.message });
  }
}