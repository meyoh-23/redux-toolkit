import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
//import { openModal } from "../modal/modalSlice";
//import cartItems from "../../cartItems";

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    amount: 4,
    total: 0,
    isLoading: true,
    isError: false,
}
/* NOTES */
/* 
    - the function 'createSyncThink' takes in 2 parameters
    - the type, from the action object that also contains the payload.
    - an asynchronous/ a function that returns a promise as the call-back function.
    - the callback function passed to it returns  lifecylce action, namely: 
        - pendding,
        - fulfilled,
        - rejected
*/

// the function has already been exported hence no export has been done in the cartSlice.actions, unlike other reducers
// the promise Style
/* export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
    return fetch(url)
    .then(resp => resp.json())
    .catch((error) =>console.log(error.message));
}) */

// passing async functions

export const getCartItems = createAsyncThunk("cart/getCartItems", async (_, thunkAPI) => {
    // thinkAPI has to be passed as the second variable to the actionCreator function;

    try {
        const resp = await axios(url);
        console.log(thunkAPI);
        console.log(resp); // to check the structure of the resp
        console.log(resp.data);; // to check the data fetched
        console.log(thunkAPI.getState());
        // thunkAPI.dispatch(openModal()) // opens the modal in the UI
        return resp.data; // when using axios, data is located in the resp.data property
    } catch (error) {
        return thunkAPI.rejectWithValue("Something Went Wrong!");
    }
})

const cartSlice = createSlice({ 
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state, {payload}) => {
            state.cartItems = [];
            console.log(payload); // payload is undefined because no payload is passed whenver the function is dispatched
        },
        removeItem: (state, action) => {
            // action has 2 properties 
                // the type, which for this case will be  'cart/RemoveItem'
                // the entire cartSlice has been labeled as 'cart' in the store.js file
            
                // the other property of the action i the payload, which for this case is the id.
                // this particular function will be dispatched for a particular cartItem, so it will access the respective id
            const itemId = action.payload; // id is passed to this function whenever it is dispatched, and that is why we are abel to access it as the payload
            console.log(itemId);
            console.log(action.payload);
            state.cartItems = state.cartItems.filter((item)=>item.id !== itemId)
        },
        increase: (state, { payload, type } /* payload and type has been destructured from action */) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            cartItem.amount = cartItem.amount + 1;
            console.log(type, payload);
        },
        decrease: (state, { payload } /* payload and type has been destructure from the ction */) => {
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
    extraReducers:(builder)=> {
        builder
        .addCase(getCartItems.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        })
        .addCase(getCartItems.fulfilled, (state, action) => {
            console.log(action);
            state.isLoading = false;
            state.isError = false; 
            state.cartItems = action.payload;
        })
        .addCase(getCartItems.rejected, (state, action) => {
            state.isLoading = false;
            state.isError  = true;
            console.log(action.payload);
            console.log(action.type);
        })
    },
})

// console.log(cartSlice);

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;