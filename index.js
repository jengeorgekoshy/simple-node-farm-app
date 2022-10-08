const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);

const dataObj = JSON.parse(data);

//SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const htmlCard = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const final = tempOverview.replace('{%PRODUCT_CARD%}', htmlCard);
    res.end(final);
  }
  //PRODUCT
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const singleProduct = dataObj[query.id];
    const product = replaceTemplate(tempProduct, singleProduct);
    res.end(product);
  } //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }
  //ERROR
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
