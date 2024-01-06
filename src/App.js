/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "./components/Navbar";
import CartContainer from "./components/CartContainer";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotals, getCartItems } from "./features/cart/cartSlice";
import { useEffect } from "react";
import Modal from "./components/Modal";

function App() {
  const { cartItems, isLoading, isError } = useSelector((state) => state.cart);
  const { isOpen } = useSelector((state) => state.modal)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cartItems]);

  // fetch cartItems on initial rendering
  useEffect(()=> {
    dispatch(getCartItems())
  }, []);

  if (isLoading) {
    return ( 
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    )
  }
  if (isError) {
    return ( 
      <div className="loading">
        <h1>Error loding your Items...</h1>
        <h2>Please try again later</h2>
      </div>
    )
  }

  return <main>
    {isOpen && <Modal/>}
    <Navbar/>
    <CartContainer/>
  </main>;
}
export default App;
