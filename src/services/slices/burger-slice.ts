import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

type TBurgerState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const ingredients = [...state.constructorItems.ingredients];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= ingredients.length) return;

      [ingredients[index], ingredients[newIndex]] = [
        ingredients[newIndex],
        ingredients[index]
      ];
      state.constructorItems.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    selectBun: (state) => state.constructorItems.bun,
    selectIngredients: (state) => state.constructorItems.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerSlice.actions;

export const { selectBun, selectIngredients } = burgerSlice.selectors;

export default burgerSlice.reducer;
