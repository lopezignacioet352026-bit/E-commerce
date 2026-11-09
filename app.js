const productGrid = document.getElementById('productGrid');
const statusMessage = document.getElementById('statusMessage');

document.addEventListener('DOMContentLoaded', initializeCatalog);

async function initializeCatalog() {
  const products = await fetchProducts();
  if (products.length > 0) {
    renderCatalog(products);
  }
}

async function fetchProducts() {
  try {
    const response = await fetch('/api/productos');
    if (!response.ok) {
      throw new Error('No se pudo establecer conexión con el servidor.');
    }
    return await response.json();
  } catch (error) {
    showErrorMessage(error.message);
    return [];
  }
}

function renderCatalog(products) {
  productGrid.innerHTML = '';
  products.forEach(product => {
    const cardElement = createProductCard(product);
    productGrid.appendChild(cardElement);
  });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  
  const formattedPrice = Number(product.precio).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  });

  card.innerHTML = `
    <img 
      src="${product.imagen_url || 'https://via.placeholder.com/300x400/111/fff?text=Threads+%26+Co.'}" 
      alt="${product.nombre}" 
      class="product-image"
      onerror="this.src='https://via.placeholder.com/300x400/111/fff?text=No+Image'"
    >
    <div class="product-info">
      <h3 class="product-name">${product.nombre}</h3>
      <span class="product-price">${formattedPrice}</span>
    </div>
  `;
  return card;
}

function showErrorMessage(message) {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message error';
}