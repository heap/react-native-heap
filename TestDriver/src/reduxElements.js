import Heap from 'react-native-heap-analytics';
import { applyMiddleware, createStore } from 'redux';

// Action Types

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// Actions

const incrementAction = amount => {
  return {
    type: INCREMENT,
    amount: amount,
    sampleNestedObject: {
      nested: true,
      secondLevel: {
        alsoNested: 'absolutely',
      },
    },
  };
};

const decrementAction = amount => {
  return {
    type: DECREMENT,
    amount: amount,
  };
};

// Reducer

const initialState = {
  value: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + action.amount,
      };
    case DECREMENT:
      return {
        ...state,
        value: state.value - action.amount,
      };
  }
  return state;
};

// Store

const store = createStore(reducer, applyMiddleware(Heap.reduxMiddleware));

export { incrementAction, decrementAction, reducer, store };
