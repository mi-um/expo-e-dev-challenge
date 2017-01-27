// What port to use to listen on
var httpPort = 8080;

// Encryption 
var https = require('https');

// Express
var express = require('express');
var app = express();

// Need to read the certificates
var fs = require('fs');

var httpsOptions = {
  key:  fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
};

var server = https.createServer(httpsOptions, app);

// Listen for incoming requests on port httpPort
server.listen(httpPort, function() {
  console.log('Listening for encrypted connection on port ' + httpPort);  
});

// Static files
app.use(express.static('public'));

// The start page
// @todo: pre-render javascript component - e.g. reactstatic
/**
 * Start page to deliver the static DOM / HTML.
 * @todo think about pre-rendering
 **/
app.get('/', function(req, res){
  var startPage = fs.readFile('index.html', 'utf8', function(err, data){
    if(err) {
      res.send('An error occurred reading the start file');
    } else {
      res.send(data);
    }
  })
});


/**
 * Return found product to the optionally given supplier and product-name.
 * That would normally be a DB query instead of manually deleting items
 * @fixme
 **/
app.get('/products/:supplier?/:name?', function(req, res){
  var supplier = req.query.supplier;
  var name     = req.query.name;
  
  //console.log('Got:: ', supplier, name);
  
  // These would usually come from a DB
  var products = 
    [
      {id: 1, supplier: 'New Co Ltd', name: 'Small wongle', price: 5},
      {id: 2, supplier: 'New Co Ltd', name: 'Large wongle', price: 8},
      {id: 3, supplier: 'New Co Ltd', name: 'Super wongle', price: 12},
      {id: 4, supplier: 'Old Co Ltd', name: 'Small wongle', price: 6},
      {id: 5, supplier: 'Old Co Ltd', name: 'Large wongle', price: 9},
      {id: 6, supplier: 'Old Co Ltd', name: 'Super wongle', price: 4},
    ];
  
  // Delete products that do not match an opionally given supplier
  if (supplier !== undefined && supplier !== '') {
    for (var i=0; i<products.length; i++) {
      if (products[i].supplier !== supplier) {
        delete( products[i] );
      }
    }
  }
  
  // Delete products that do not match an opionally given product name
  if (name !== undefined && name !== '') {
    for (var i=0; i<products.length; i++) {
      if (products[i] !== undefined && products[i].name !== name) {
        delete( products[i] );
      }
    }
  }
  
  // Make sure the json string has not empty entries
  var returnProducts = [];
  products.forEach(function(product) {
    returnProducts.push( product );
  });
  
  res.send( JSON.stringify(
    returnProducts
  ) );
});

/**
 * Return all suppliers in the "DB"
 * @todo: read entries from DB
 **/
app.get('/allsuppliers', function(req, res) {
  res.send( JSON.stringify(
    {
      //'': '- All -',
      'New Co Ltd': 'New Co Ltd',
      'Old Co Ltd': 'Old Co Ltd'
    }) );
});

/**
 * Return all products in the "DB"
 **/
app.get('/allproducts', function(req, res) {
  res.send( JSON.stringify( 
    {
      //'': '- All -',
      'Small wongle': 'Small wongle',
      'Large wongle': 'Large wongle',
      'Super wongle': 'Super wongle'
    }) );
});
