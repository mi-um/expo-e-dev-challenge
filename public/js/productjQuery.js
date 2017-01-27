function formSetOptions(selectId, options) {
  
  $(selectId)
      .append( $('<option>', {
        value: '',
        text: '- All -'
      }) );
      
  $.each(options, function (key, value) {
    $(selectId)
      .append( $('<option>', {
        value: key,
        text: value
      }) );
  });
}

/**
 * Call the allsuppliers API to receive all
 * available products in the "DB"
 **/
function addSupplier( options ) {
  $.ajax({
      url: '/allsuppliers',
      dataType: 'json',
      cache: false,
      success: function( data ) {
        formSetOptions( '#selSupplier', data );
         $( '#selSupplier' ).change( function() {updateProductList()} );
      }.bind(this),
      error: function( xhr, status, err ) {
        console.log( err.toString() );
      }.bind(this),
    });
}

/**
 * Call the allproduct API to receive all
 * available products in the "DB"
 **/
function addProducts( options ) {
  $.ajax({
      url: '/allproducts',
      dataType: 'json',
      cache: false,
      success: function( data ) {
        formSetOptions( '#selProduct', data );
        $( '#selProduct' ).change( function() {updateProductList()} );
      }.bind(this),
      error: function( xhr, status, err ) {
        console.log( err.toString() );
      }.bind(this),
    });
}

/**
 * Take the json data from updateProductList and adjust
 * the DOM tree
 **/
function domUpdateProductList(id, options) {
  $(id).empty();
  $.each(options, function(key, value) {
    var tr = $('<tr>').append(
      $('<td>').text(value.id),
      $('<td>').text(value.supplier),
      $('<td>').text(value.name),
      $('<td>').text(value.price)
    ).appendTo( $(id) );
  });
}

/**
 * Take the supplier and product name from the select options
 * and call the api to get the resutl. Then update the html table
 **/
function updateProductList() {
  var supplier = $('#selSupplier').val();
  var product = $('#selProduct').val();
  
  $.ajax({
      url: '/products',
      data: {
        supplier: supplier,
        name: product
      },
      type: 'get',
      dataType: 'json',
      cache: false,
      success: function( data ) {
        domUpdateProductList('tbody', data);
      }.bind(this),
      error: function( xhr, status, err ) {
        console.log( err.toString() );
      }.bind(this),
    });
}


$(function() {
addSupplier();
addProducts();
updateProductList();
});