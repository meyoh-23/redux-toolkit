import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import cartItems from "../../cartItems";

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    amount: 4,
    total: 0,
    isLoading: true,
}

export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
    return fetch(url)
    .then(resp => resp.json())
    .catch((error) =>console.log(error.message));
})

const cartSlice = createSlice({ 
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            // action has 2 properties 
                // the type, which for this case will be  'cart/RemoveItem'
                // the entire cartSlice has been labeled as 'cart' in the store.js file
            
                // the other property of the action i the payload, which for this case is the id.
                // this particular function will be dispatched for a particular cartItem, so it will access the respective id
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item)=>item.id !== itemId)
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            cartItem.amount = cartItem.amount + 1;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) =>item.id === payload.id );
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.price * item.amount;
            });
            state.amount = amount;
            state.total = total;
        },
    },
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true;
        },
        [getCartItems.fulfilled]: (state, action) => {
            console.log(action);
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.rejected]: (state) => {
            state.isLoading = false
        },
    },
})

// console.log(cartSlice);

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;