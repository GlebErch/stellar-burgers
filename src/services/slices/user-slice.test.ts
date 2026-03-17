import userReducer, { login, register, getUser } from './user-slice';

describe('userSlice', () => {
  const initialState = userReducer(undefined, { type: '@@INIT' });

  it('должен устанавливать isLoading в true при login.pending', () => {
    const action = { type: login.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять пользователя и устанавливать isLoading в false при login.fulfilled', () => {
    const mockUser = { email: 'test@test.com', name: 'Test' };
    const action = {
      type: login.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать isLoading в false при login.rejected', () => {
    const action = {
      type: login.rejected.type,
      error: { message: 'Ошибка входа' }
    };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка входа');
  });

  it('должен устанавливать isLoading в true при register.pending', () => {
    const action = { type: register.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать isLoading в true при getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
  });
});
