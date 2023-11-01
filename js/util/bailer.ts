export const logError = (message: string, error: any) => {
  if (error instanceof Error) {
    // KLUDGE: These properties don't show up if you `console.warn` the error object directly.
    console.warn(message, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.warn(message, {
      message: String(error),
    });
  }
};

export const swallowErrors = <T extends Array<any>, U>(fn: (...args: T) => U, name: string | null = null) => {
  return (...args: T): U | void => {
    try {
      return fn(...args);
    } catch (e) {
      logError(
        name ? `Heap: ${name} failed with an error.` : 'Heap: The Heap SDK encountered an error while tracking.',
        e
      );
    }
  }
}
