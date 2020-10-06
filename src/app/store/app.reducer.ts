import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface IAppState {
  shoppingList: fromShoppingList.IState;
  auth: fromAuth.IState;
}

export const appReducer: ActionReducerMap<IAppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};
