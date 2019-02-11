import Heap from "@heap/react-native-heap";
import { applyMiddleware, createStore } from "redux";

// Action Types

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Actions

export const incrementAction = amount => {
  return {
    type: INCREMENT,
    amount: amount,
    sampleNestedObject: {
      nested: true,
      secondLevel: {
        alsoNested: "absolutely"
      }
    }
  };
};

export const decrementAction = amount => {
  return {
    type: DECREMENT,
    amount: amount
  };
};

// Reducer
const initialState = {
  value: 0
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + action.amount
      };
    case DECREMENT:
      return {
        ...state,
        value: state.value - action.amount
      };
  }
  return state;
};

// Store

export const store = createStore(
  reducer,
  applyMiddleware(Heap.reduxMiddleware)
);
