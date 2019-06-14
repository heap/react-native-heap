import { PropExtractorConfig } from '../util/extractProps';

export const REACT_NATIVE_ELEMENTS_CONFIG: PropExtractorConfig = {
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
