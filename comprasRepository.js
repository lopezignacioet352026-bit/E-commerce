export async function crearOrdenTransaccional(dbPool, usuarioId, items) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();
    let total = 0;

    for (const item of items) {
      const [rows] = await connection.query(
        'SELECT precio, stock FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id]
      );
      if (rows.length === 0) {
        throw new Error(`Producto con ID ${item.producto_id} no encontrado.`);
      }
      const producto = rows[0];
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${item.producto_id}.`);
      }
      total += producto.precio * item.cantidad;
    }

    const [resultCompra] = await connection.query(
      'INSERT INTO compras (usuario_id, fecha, total, estado) VALUES (?, NOW(), ?, "completada")',
      [usuarioId, total]
    );
    const compraId = resultCompra.insertId;

    for (const item of items) {
      const [rows] = await connection.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
      const precioUnitario = rows[0].precio;

      await connection.query(
        'INSERT INTO detalle_compra (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [compraId, item.producto_id, item.cantidad, precioUnitario]
      );
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();
    return { compraId, total };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}