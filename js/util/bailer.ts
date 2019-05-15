const bail = (error: Error) => {
  // Swallow all errors.
  // TODO: Turn off Heap tracking for a while (short-circuit?)

  // KLUDGE: These properties don't show up if you `console.warn` the error object directly.
  const errorData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  console.warn('The Heap library has crashed with an exception.', errorData);
};

const bailOnError = (f: Function) => (...args: any[]) => {
  try {
    return f(...args);
  } catch (e) {
    bail(e);
  }
};

export { bail, bailOnError };
