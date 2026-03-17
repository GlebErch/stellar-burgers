import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burger-slice';
import { TIngredient } from '@utils-types';

describe('burgerSlice', () => {
  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 10,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockMain: TIngredient = {
    _id: 'main1',
    name: 'Начинка',
    type: 'main',
    price: 50,
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 5,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockSauce: TIngredient = {
    _id: 'sauce1',
    name: 'Соус',
    type: 'sauce',
    price: 30,
    proteins: 3,
    fat: 3,
    carbohydrates: 3,
    calories: 3,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    }
  };

  it('должен добавлять булку', () => {
    const action = addIngredient(mockBun);
    const newState = burgerReducer(initialState, action);

    expect(newState.constructorItems.bun).toEqual(
      expect.objectContaining({
        _id: 'bun1',
        name: 'Булка',
        price: 100
      })
    );
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен добавлять начинку', () => {
    const action = addIngredient(mockMain);
    const newState = burgerReducer(initialState, action);

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: 'main1',
        name: 'Начинка',
        price: 50
      })
    );
  });

  it('должен добавлять соус', () => {
    const action = addIngredient(mockSauce);
    const newState = burgerReducer(initialState, action);

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: 'sauce1',
        name: 'Соус',
        price: 30
      })
    );
  });

  it('должен удалять ингредиент', () => {
    const addAction = addIngredient(mockMain);
    const stateWithIngredient = burgerReducer(initialState, addAction);

    const ingredientId = stateWithIngredient.constructorItems.ingredients[0].id;
    const removeAction = removeIngredient(ingredientId);
    const newState = burgerReducer(stateWithIngredient, removeAction);

    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент вверх', () => {
    const addFirst = addIngredient(mockMain);
    const addSecond = addIngredient(mockSauce);

    let state = burgerReducer(initialState, addFirst);
    state = burgerReducer(state, addSecond);

    const moveAction = moveIngredient({ index: 1, direction: 'up' });
    const newState = burgerReducer(state, moveAction);

    expect(newState.constructorItems.ingredients[0].type).toBe('sauce');
    expect(newState.constructorItems.ingredients[1].type).toBe('main');
  });

  it('должен перемещать ингредиент вниз', () => {
    const addFirst = addIngredient(mockMain);
    const addSecond = addIngredient(mockSauce);

    let state = burgerReducer(initialState, addFirst);
    state = burgerReducer(state, addSecond);

    const moveAction = moveIngredient({ index: 0, direction: 'down' });
    const newState = burgerReducer(state, moveAction);

    expect(newState.constructorItems.ingredients[0].type).toBe('sauce');
    expect(newState.constructorItems.ingredients[1].type).toBe('main');
  });

  it('должен очищать конструктор', () => {
    const addBun = addIngredient(mockBun);
    const addMain = addIngredient(mockMain);

    let state = burgerReducer(initialState, addBun);
    state = burgerReducer(state, addMain);

    const clearAction = clearConstructor();
    const newState = burgerReducer(state, clearAction);

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });
});