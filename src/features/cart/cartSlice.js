import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const url = 'https://course-api.com/react-useReducer-cart-project';

export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI) => {
  try {
    const resp = await axios(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('something went wrong');
  }
});

const initialState = {
  cartItems: [],
  amount: 4,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemID = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemID);
    },
    increase: (state, action) => {
      const itemID = action.payload;
      const cartItem = state.cartItems.find((item) => item.id === itemID);
      cartItem.amount++;
    },
    decrease: (state, action) => {
      const itemID = action.payload;
      const cartItem = state.cartItems.find((item) => item.id === itemID);
      cartItem.amount--;
      if (cartItem.amount <= 0) {
        state.cartItems = state.cartItems.filter((item) => item.id !== itemID);
      }
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      // Reminder: "forEach" method doesn't return a value, but "map" method does; in this case both works!
      state.cartItems.map((cartItem) => {
        amount += cartItem.amount;
        total += cartItem.price * amount;
      });
      state.amount = amount;
      state.total = total;
    },
  },

  // This is considered as the "execution" of the "createAsyncThunk"; Meaning, if "extraReducers" isn't present, "createAsyncThunk" won't execute.
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;

// Instead of sending the initialState object, we send the "reducer" function since it controls the "initialState".
export default cartSlice.reducer;
