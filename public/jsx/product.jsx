
class ProductRow extends React.Component {
  render() {
    return (
    <tr>
      <td>{this.props.product.id}</td>
      <td>{this.props.product.supplier}</td>
      <td>{this.props.product.name}</td>
      <td>{this.props.product.price}</td>
    </tr>
    );
  }
};

class ProductTable extends React.Component {
  render() {
    var rows = [];
    this.props.products.forEach(function(product) {
      rows.push(<ProductRow product={product} key={product.id} />);
    });
  
    return (
      <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Supplier</th>
                            <th>Product</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
  );
  };
}

class SearchFormOption extends React.Component {
  render() {
    
    if( this.props.value == this.props.selected) {
      var selected='selected';
    } else {
      var selected = '';
    }
    
    return(
      <option value={this.props.value} selected={selected}>{this.props.name}</option>
    );
  };
};


class SearchFormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.selected};
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange( event ) {
    this.setState({value: event.target.value})
    this.props.onHandleChange();
  }
  
  render() {
    var options = [];
    this.props.options.forEach( function(option) {
      options.push(<SearchFormOption value={option.value} name={option.name} />);
    });
    
    
    
    return(
      <div className="form-group col-md-6">
          <label htmlFor={this.props.id}>{this.props.label}</label>
          <select ref={(input) => this.props.id = input} className="form-control" id={this.props.id} onChange={this.handleChange} value={this.state.value} >
              {options}
          </select>
      </div>
    );
  }
};


class SearchForm extends React.Component {
  render() {
  
    // Options as array for the product and supplier search
    var products  = [ {'value': '', 'name': '- All -'},
                      {'value': 'Small wongle', 'name': 'Small wongle'},
                      {'value': 'Large wongle', 'name': 'Large wongle'},
                      {'value': 'Super wongle', 'name': 'Super wongle'} ];
    var suppliers = [ {'value': '', 'name': '- All -'},
                      {'value': 'New Co Ltd', 'name': 'New Co Ltd'},
                      {'value': 'Old Co Ltd', 'name': 'Old Co Ltd'} ];
    
    return(
	      <form>
                <div class="row">
                    <SearchFormSelect options={suppliers} id="selSupplier" label="Supplier" selected={this.props.selectedSupplier} />
                    <SearchFormSelect options={products} id="selProduct" label="Product" selected={this.props.selectedProduct} />
                </div>
            </form>
    );
  };
};


class ShowProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '',
      supplier: '',
      loaded: false
    };
    
    this.handleUserInput = this.handleUserInput.bind(this);
  }
  
  handleUserInput(supplier, product) {
    this.setState({
      product: product,
      supplier: supplier
    });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 main">
            <h1 className="page-header">Product pricing</h1>

            <SearchForm products={this.props.products}
                selectedProduct={this.state.product}
                selectedSupplier={this.state.supplier}
                onHandleChange={this.handleUserInput}   />

            <h2 className="sub-header">Product details</h2>
            <div className="table-responsive">
                <ProductTable products={this.props.products} supplier={this.props.supplier} />
            </div>
        </div>
    );
  }
  
  componentDidMount() {
    // Get products
    // @todo: jquery might be a bit too much for just an AJAX request
    $.ajax({
      url: '/products',
      dataType: 'json',
      cache: false,
      success: function( data ) {
        this.props.products = data;
        this.setState( {loaded: true} );
      }.bind(this),
      error: function( xhr, status, err ) {
        console.log( err.toString() );
      }.bind(this),
    });
  }
}

/**
var PRODUCTS = [
  {id: 1, supplier: 'New Co Ltd', name: 'Small wongle', price: 5},
  {id: 2, supplier: 'New Co Ltd', name: 'Large wongle', price: 8},
  {id: 3, supplier: 'New Co Ltd', name: 'Super wongle', price: 12},
  {id: 4, supplier: 'Old Co Ltd', name: 'Small wongle', price: 6},
  {id: 5, supplier: 'Old Co Ltd', name: 'Large wongle', price: 9},
  {id: 6, supplier: 'Old Co Ltd', name: 'Super wongle', price: 4},
];
**/

PRODUCTS = [];

ReactDOM.render(
  <ShowProductTable products={PRODUCTS} />,
  document.getElementById('row')
);