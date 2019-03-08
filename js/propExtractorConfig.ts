import { PropExtractorConfig } from './util/extractProps';

const builtinPropExtractorConfig: PropExtractorConfig = {
  '*': {
    include: ['testID'],
    exclude: [],
  },
  Button: {
    include: ['title'],
    exclude: [],
  },
};

export { builtinPropExtractorConfig };
