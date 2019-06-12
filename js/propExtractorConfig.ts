import { PropExtractorConfig } from './util/extractProps';

const REACT_NATIVE_ELEMENTS_CONFIG: PropExtractorConfig = {
  // Interactive components.
  Avatar: {
    include: [
      'editButton.name',
      'editButton.type',
      'icon.name',
      'icon.type',
      'showEditButton',
      'title',
    ],
    exclude: [],
  },
  Badge: {
    include: ['status', 'value'],
    exclude: [],
  },
  Button: {
    include: [
      'icon.name',
      'icon.type',
      'iconRight',
      'loading',
      'type',
      'disabled',
    ],
    exclude: [],
  },
  CheckBox: {
    include: ['iconType', 'title', 'checkedTitle'],
    exclude: [],
  },
  Icon: {
    include: ['name', 'type'],
    exclude: [],
  },
  Input: {
    include: ['errorMessage', 'label', 'placeholder'],
    exclude: [],
  },
  ListItem: {
    include: ['title', 'subtitle', 'rightTitle', 'rightSubtitle'],
    exclude: [],
  },
  PricingCard: {
    include: ['price', 'title', 'button.title'],
    exclude: [],
  },
  TapRating: {
    include: ['count'],
    exclude: [],
  },
  SearchBar: {
    include: ['platform', 'placeholder'],
    exclude: [],
  },
  SocialIcon: {
    include: ['button', 'type', 'title'],
    exclude: [],
  },
  Tile: {
    include: ['caption', 'featured', 'icon.name', 'icon.type', 'title'],
    exclude: [],
  },
  // Non-interactive components.
  Card: {
    include: ['featuredSubtitle', 'featuredTitle', 'title'],
    exclude: [],
  },
};

const builtinPropExtractorConfig: PropExtractorConfig = {
  '*': {
    include: ['testID'],
    exclude: [],
  },
  Button: {
    include: ['title'],
    exclude: [],
  },
  // :TODO: (jmtaber129): Consider allowing users to specify whether these library-specific prop
  // configs are included in the default config.
  ...REACT_NATIVE_ELEMENTS_CONFIG,
};

export { builtinPropExtractorConfig };
