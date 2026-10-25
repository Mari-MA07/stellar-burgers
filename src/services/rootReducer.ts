import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './constructor/constructorSlice';
import { feedReducer } from './feed/feedSlice';
import { ingredientsReducer } from './ingredients/ingredientsSlice';
import { orderReducer } from './order/orderSlice';
import { userReducer } from './user/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
});
