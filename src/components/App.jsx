import React from 'react';
import {
  Grid,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import { connect } from 'react-redux';

import '../styles/App.css';
import logo from '../assets/logo.png';
import Cart from './cart';
import Gallery from './gallery';
import coneImg from '../assets/ice-cream-cone.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.props.socket.on('INIT', async ({ coneCount, cart, btcPrice }) => {
      cart.forEach((x, i) => {
        cart[i].priceBtc = cart[i].price / btcPrice;
      });
      this.props.handleInit({ coneCount, cart, btcPrice });
    });
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={2} md={2} style={{ marginTop: '10px' }}>
            <Link to="/about-us" style={{ color: 'white' }} >
              <i className="fa fa-users" />
              About Us
            </Link>
          </Col>
          <Col xs={6} xsOffset={1} mdOffset={2} md={4} >
            <Image responsive rounded src={logo} alt="LND logo" style={{ paddingTop: '0.5em' }} />
            <h3 style={{ textAlign: 'center' }}><i>Ice Cream Delivery powered by the Bitcoin Lightning Network</i></h3>
          </Col>
          <Col xsOffset={0} xs={3} md={2} mdOffset={2} style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '16px', color: 'white' }}><b>{this.props.coneCount}</b></span>
            <img alt="Cute Cone" src={coneImg} style={{ width: '33px' }} />
          </Col>
        </Row>
        <Gallery />
        <div style={{ marginBottom: '20px', marginTop: '30px', textAlign: 'center' }}>
          <RaisedButton
            label="Checkout"
            secondary
            style={{ marginRight: '10px' }}
            onClick={this.props.handleOpenClose}
          />
          <span style={{ fontSize: '17px' }}> Cart Total: ${this.props.cartTotal}</span>
          <RaisedButton
            label="Clear Cart"
            default
            onClick={this.props.handleClearCart}
            style={{ marginRight: '10px', marginLeft: '10px' }}
          />
        </div>
        <p>
          Use of this website constitutes your acceptance of Block And Jerry&#39;s <Link to="/t-and-c">Terms & Conditions</Link>.
        </p>
        <Dialog open={this.props.open} onRequestClose={this.props.handleOpenClose}>
          <Cart />
        </Dialog>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  coneCount: state.coneCount,
  cart: state.cart,
  open: state.open,
  cartTotal: state.cartTotal,
});

const mapDispatchToProps = dispatch => ({
  handleAdd: ({ id }) => {
    dispatch({ type: 'ADD', id });
  },
  handleSubtract: ({ id }) => {
    dispatch({ type: 'SUBTRACT', id });
  },
  handleInit: ({ coneCount, cart, btcPrice }) => {
    dispatch({ type: 'INIT', coneCount, cart, btcPrice });
  },
  handleOpenClose: () => {
    dispatch({ type: 'OPEN' });
  },
  handleClearCart: () => {
    dispatch({ type: 'HANDLE_CLEAR_CART' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
