import React from 'react';

export const HeapIgnore = props => {
  // The only purpose of HeapIgnore is to tell the us which props apply to the subtree when we're
  // traversing, so we just need to render it's children here.
  return props.children;
};

export const HeapCaptureRestrictor = props => {
  return props.children;
};

export const withHeapIgnore = (IgnoredComponent, heapIgnoreConfig) => {
  return class extends React.Component {
    render() {
      return (
        <HeapIgnore {...heapIgnoreConfig}>
          <IgnoredComponent {...this.props}>
            {this.props.children}
          </IgnoredComponent>
        </HeapIgnore>
      );
    }
  };
};
