import * as comprasRepository from './comprasRepository.js';

export async function procesarCompra(dbPool, usuarioId, items) {
  if (!items || items.length === 0) {
    throw new Error('El carrito no contiene productos.');
  }
  return await comprasRepository.crearOrdenTransaccional(dbPool, usuarioId, items);
}