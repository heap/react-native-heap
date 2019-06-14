import { PropExtractorConfig } from '../util/extractProps';

export const NATIVE_BASE_CONFIG: PropExtractorConfig = {
  // Interactive components.
  Button: {
    include: [
      'active',
      'transparent',
      'badge',
      'bordered',
      'rounded',
      'block',
      'full',
      'disabled',
      'small',
      'large',
      'iconRight',
      'iconLeft',
      'light',
      'primary',
      'success',
      'info',
      'warning',
      'danger',
      'dark',
      'vertical',
    ],
    exclude: [],
  },
  CheckBox: {
    include: ['checked', 'color'],
    exclude: [],
  },
  CardItem: {
    include: ['header', 'footer', 'bordered', 'first', 'last'],
    exclude: [],
  },
  DeckSwiper: {
    include: ['looping'],
    exclude: [],
  },
  Fab: {
    include: ['position'],
    exclude: [],
  },
  // This is instantiated as 'Picker', but shows up in hierarchies as 'PickerNB'.
  PickerNB: {
    include: ['headerBackButtonText', 'placeholder'],
    exclude: [],
  },
  Tab: {
    include: ['heading'],
    exclude: [],
  },
  // :TODO: (jmtaber129): See about adding the Toast component's 'text' prop (this is on the Toast
  // component's 'state', rather than 'props').

  // Non-interactive components.
  Badge: {
    include: ['primary', 'success', 'info', 'warning', 'danger'],
    exclude: [],
  },
  Card: {
    include: ['transparent'],
    exclude: [],
  },
  Header: {
    include: [
      'searchBar',
      'hasSubtitle',
      'hasSegment',
      'hasTabs',
      'transparent',
    ],
    exclude: [],
  },
};
