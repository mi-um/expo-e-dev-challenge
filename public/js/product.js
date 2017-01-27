
class ProductRow extends React.Component {
  render() {
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        this.props.product.id
      ),
      React.createElement(
        'td',
        null,
        this.props.product.supplier
      ),
      React.createElement(
        'td',
        null,
        this.props.product.name
      ),
      React.createElement(
        'td',
        null,
        this.props.product.price
      )
    );
  }
};

class ProductTable extends React.Component {
  render() {
    var rows = [];
    this.props.products.forEach(function (product) {
      rows.push(React.createElement(ProductRow, { product: product, key: product.id }));
    });

    return React.createElement(
      'table',
      { className: 'table table-striped' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            '#'
          ),
          React.createElement(
            'th',
            null,
            'Supplier'
          ),
          React.createElement(
            'th',
            null,
            'Product'
          ),
          React.createElement(
            'th',
            null,
            'Price'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows
      )
    );
  }
}

class SearchFormOption extends React.Component {
  render() {

    if (this.props.value == this.props.selected) {
      var selected = 'selected';
    } else {
      var selected = '';
    }

    return React.createElement(
      'option',
      { value: this.props.value, selected: selected },
      this.props.name
    );
  }
};

class SearchFormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.selected };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onHandleChange();
  }

  render() {
    var options = [];
    this.props.options.forEach(function (option) {
      options.push(React.createElement(SearchFormOption, { value: option.value, name: option.name }));
    });

    return React.createElement(
      'div',
      { className: 'form-group col-md-6' },
      React.createElement(
        'label',
        { htmlFor: this.props.id },
        this.props.label
      ),
      React.createElement(
        'select',
        { ref: input => this.props.id = input, className: 'form-control', id: this.props.id, onChange: this.handleChange, value: this.state.value },
        options
      )
    );
  }
};

class SearchForm extends React.Component {
  render() {

    // Options as array for the product and supplier search
    var products = [{ 'value': '', 'name': '- All -' }, { 'value': 'Small wongle', 'name': 'Small wongle' }, { 'value': 'Large wongle', 'name': 'Large wongle' }, { 'value': 'Super wongle', 'name': 'Super wongle' }];
    var suppliers = [{ 'value': '', 'name': '- All -' }, { 'value': 'New Co Ltd', 'name': 'New Co Ltd' }, { 'value': 'Old Co Ltd', 'name': 'Old Co Ltd' }];

    return React.createElement(
      'form',
      null,
      React.createElement(
        'div',
        { 'class': 'row' },
        React.createElement(SearchFormSelect, { options: suppliers, id: 'selSupplier', label: 'Supplier', selected: this.props.selectedSupplier }),
        React.createElement(SearchFormSelect, { options: products, id: 'selProduct', label: 'Product', selected: this.props.selectedProduct })
      )
    );
  }
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
    return React.createElement(
      'div',
      { className: 'col-sm-12 col-md-12 main' },
      React.createElement(
        'h1',
        { className: 'page-header' },
        'Product pricing'
      ),
      React.createElement(SearchForm, { products: this.props.products,
        selectedProduct: this.state.product,
        selectedSupplier: this.state.supplier,
        onHandleChange: this.handleUserInput }),
      React.createElement(
        'h2',
        { className: 'sub-header' },
        'Product details'
      ),
      React.createElement(
        'div',
        { className: 'table-responsive' },
        React.createElement(ProductTable, { products: this.props.products, supplier: this.props.supplier })
      )
    );
  }

  componentDidMount() {
    // Get products
    // @todo: jquery might be a bit too much for just an AJAX request
    $.ajax({
      url: '/products',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.props.products = data;
        this.setState({ loaded: true });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err.toString());
      }.bind(this)
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

ReactDOM.render(React.createElement(ShowProductTable, { products: PRODUCTS }), document.getElementById('row'));