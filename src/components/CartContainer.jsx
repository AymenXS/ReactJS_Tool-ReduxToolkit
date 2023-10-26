import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { calculateTotals, getCartItems } from '../features/cart/cartSlice';
import { useEffect } from 'react';
import { openModal } from '../features/modal/modalSlice';

const CartContainer = () => {
  const dispatch = useDispatch();
  const { isLoading, cartItems, total, amount } = useSelector((store) => store.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (amount < 1) {
    return (
      <section className="cart">
        <header>
          <h2>your bag</h2>
          <h4 className="empty-cart">is currently empty</h4>
        </header>
      </section>
    );
  }

  return (
    <section className="cart">
      {/* Cart Header */}
      <header>
        <h2>your bag</h2>
      </header>

      {/* Cart Items */}
      <div>
        {cartItems.map((cartItem) => {
          return <CartItem key={cartItem.id} {...cartItem} />;
        })}
      </div>

      {/* Cart Footer */}
      <footer>
        <hr />
        <div className="cart-total">
          <h4>
            total <span>${total.toFixed(2)}</span>
          </h4>
        </div>
        <button className="btn clear-btn" onClick={() => dispatch(openModal())}>
          clear cart
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
