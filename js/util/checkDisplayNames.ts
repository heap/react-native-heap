class DisplayNameTest {
  render() {}
}

let warningGiven = false;

export const checkDisplayNamePlugin = () => {
  // @ts-ignore
  if (!DisplayNameTest.displayName && !warningGiven) {
    console.warn(
      'Heap: Display names are not being generated for React components, which will cause Heap to populate captured component hierarchies with dummy component names. Make sure the "add-react-displayname" plugin is specified in your babel config, and that the config is being properly picked up by the app.'
    );
    warningGiven = true;
  }
};
