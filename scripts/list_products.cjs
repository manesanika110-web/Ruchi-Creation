const { DEFAULT_PRODUCTS } = require('../src/data/defaultProducts.js');
DEFAULT_PRODUCTS.forEach((p, i) => {
  console.log(`${i+1}. [${p.id}] "${p.name}" | Cat: ${p.category} | Price: ₹${p.price} | Img: ${p.image}`);
});

