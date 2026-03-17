import ingredientsReducer, { fetchIngredients } from './ingredients-slice';

describe('ingredientsSlice', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Ингредиент 1',
      type: 'bun',
      price: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 10,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  const initialState = ingredientsReducer(undefined, { type: '@@INIT' });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять данные и устанавливать loading в false при fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать loading в false при rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при получении ингредиентов');
  });
});
