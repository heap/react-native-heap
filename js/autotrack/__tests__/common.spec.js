/**
 * @jest-environment jsdom
 */
import React from 'React';
import { Text, View } from 'react-native';
const foo = require('react-native');
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native'

import { getBaseComponentProps } from '../common';
import {
  HeapIgnore,
  HeapIgnoreTargetText,
  withHeapIgnore,
} from '../heapIgnore';

const packageJson = require('../../../package.json');

const SDK_VERSION = packageJson.version;
expect(SDK_VERSION).toBeDefined();

jest.unmock('react-native');

// Placeholder functional component for hierarchy tests.
const BarFunction = props => {
  return props.children;
};

// Placeholder class component for hierarchy tests.
class BarClass extends React.Component {
  render() {
    return this.props.children;
  }
}

const Foo = props => {
  return (
    <View>
      <BarClass>
        <BarFunction>{props.children}</BarFunction>
      </BarClass>
    </View>
  );
};

describe('Common autotrack utils', () => {
  describe('Hierarchy capture', () => {
    it('Captures hierarchies normally', () => {
      const { getByTestId } = render(
        <Foo>
          <Text testID="targetElement">{'foobar'}</Text>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });

    it('Removes special characters from component names', () => {
      const MySpecialComponent = props => {
        return <View>{props.children}</View>;
      };

      MySpecialComponent.displayName = '@My@Special;|[Component#=';

      const { getByTestId } = render(
        <MySpecialComponent>
          <Text testID="targetElement">{'foobar'}</Text>
        </MySpecialComponent>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@MySpecialComponent;|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });

    it('Can capture props that are JSX components', () => {
      const ListItem = props => {
        return <View>{props.children}</View>;
      };
      const { getByTestId } = render(
        <ListItem rightTitle={<Text>Foo</Text>}>
          <Text testID="targetElement">{'foobar'}</Text>
        </ListItem>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@ListItem;[rightTitle=React.element];|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });
  });

  describe('HeapIgnore', () => {
    it('Ignores interaction', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore>
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toBe(null);
    });

    it('Ignores inner hierarchy', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore allowInteraction={true} allowTargetText={true}>
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnore;|',
        source_version: SDK_VERSION,
      });
    });

    it('Ignores props', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore
            allowInteraction={true}
            allowInnerHierarchy={true}
            allowTargetText={true}
          >
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnore;|@Text;|',
        source_version: SDK_VERSION,
      });
    });

    it('Ignores target text', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore
            allowInteraction={true}
            allowInnerHierarchy={true}
            allowAllProps={true}
          >
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnore;|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });

    it('Ignores nothing', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore
            allowInteraction={true}
            allowInnerHierarchy={true}
            allowAllProps={true}
            allowTargetText={true}
            // :TODO: (jmtaber129): Add additional capture restriction props to this when we add
            // them to HeapIgnore.
          >
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        target_text: 'foobar',
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnore;|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });

    it('Props stack correctly', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnore allowInteraction={true} allowInnerHierarchy={true}>
            <BarFunction>
              <HeapIgnore allowInteraction={true}>
                <BarFunction>
                  <HeapIgnore
                    allowInteraction={true}
                    allowInnerHierarchy={true}
                    allowAllProps={true}
                    allowTargetText={true}
                  >
                    <Text testID="targetElement">{'foobar'}</Text>
                  </HeapIgnore>
                </BarFunction>
              </HeapIgnore>
            </BarFunction>
          </HeapIgnore>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnore;|@BarFunction;|@HeapIgnore;|',
        source_version: SDK_VERSION,
      });
    });

    it('Works as an HOC', () => {
      const IgnoredText = withHeapIgnore(Text, {
        allowInteraction: true,
        allowInnerHierarchy: true,
      });
      const { getByTestId } = render(
        <Foo>
          <IgnoredText testID="targetElement">{'foobar'}</IgnoredText>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@withHeapIgnore(Text);[testID=targetElement];|@HeapIgnore;|@Text;|',
        source_version: SDK_VERSION,
      });
    });

    it('Ignores target text via convenience component', () => {
      const { getByTestId } = render(
        <Foo>
          <HeapIgnoreTargetText>
            <Text testID="targetElement">{'foobar'}</Text>
          </HeapIgnoreTargetText>
        </Foo>
      );
      const normalComponent = getByTestId('targetElement');
      const normalProps = getBaseComponentProps(normalComponent);
      expect(normalProps).toEqual({
        is_using_react_navigation_hoc: false,
        react_native_version: null,
        rn_hierarchy:
          '@Foo;|@BarClass;|@BarFunction;|@HeapIgnoreTargetText;|@HeapIgnore;|@Text;[testID=targetElement];|',
        source_version: SDK_VERSION,
      });
    });

    it('Forwards refs as an HOC', () => {
      const NoOpIgnore = withHeapIgnore(Text, {
        allowInteraction: true,
        allowAllProps: true,
        allowInnerHierarchy: true,
        allowTargetText: true,
      });

      const myRef = React.createRef();

      render(
        <Foo>
          <NoOpIgnore ref={myRef} testID="targetElement">
            {'foobar'}
          </NoOpIgnore>
        </Foo>
      );

      expect(myRef.current._reactInternals.type.displayName).toEqual(
        'Text'
      );
    });
  });
});
