import React, { useState, useEffect, useContext } from 'react';
import Loading from '../Loading/Loading';
import { StoreContext } from '../../contexts/UserContext';
import { getStore } from '../../services/storeService';
import { createOrder } from '../../services/orderService';
import cartStyles from './cart.module.scss';

const Cart = ({ cart, storeId, removeItemsFromCart, setCart }) => {
  const [whatsApp, setWhatsApp] = useState('');
  const { storeName } = useContext(StoreContext);
  let [loading, setLoading] = useState(false);

  let total = 0;
  let products = [];
  let message = '';

  useEffect(() => {
    getWhatsApp();
  }, []);

  const getWhatsApp = async () => {
    const [{ phone }] = await getStore(storeName);
    setWhatsApp(phone);
  };

  const createWhatsAppOrder = (cart, name) => {
    let message = ''
    cart.forEach(product => {
      message += `${product.quantity} x *${product.name}*: R$ ${product.price * product.quantity}.00%0a`
    })
    return message += `%0a%0atotal: R$ ${total}.00%0a%0a*Muito obrigado por enviar a sua ordem!*%0aEntraremos em contato em breve%0a%0a*${name}*<3`
  }

  const sendOrder = () => {
    let order = {
      products,
      total,
    };

    createOrder(storeId, order)
      .then((response) => {
        setCart([]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h1>Carrinho</h1>
      {cart.map((product, i) => {
        total += product.quantity * product.price;
        products.push({
          product: product._id,
          quantity: product.quantity,
        });
        return (
          <div key={i}>
            <h2>{product.name}</h2>
            <h2>{product.quantity}</h2>
            <button onClick={() => removeItemsFromCart(product._id)}>
              remove
            </button>
          </div>
        );
        })
      }
      <strong>{total}</strong>
      <button onClick={sendOrder}>ENVIAR</button>
      <a
        target="_blank"
        href={`https://api.whatsapp.com/send?text=%0aEsse é o meu pedido: %0a%0a${createWhatsAppOrder(cart, storeName)}%0a&phone=${whatsApp}`}
      >
        Send Message
      </a>
    </div>
  );
};

export default Cart;
