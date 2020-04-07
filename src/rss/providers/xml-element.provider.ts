import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { create } from 'xmlbuilder2';

import { XML_BUILDER_PROVIDER } from '../constant/xmlbuilder.provider.constant';

// No need to custom more XML ELEMENT for now
export const xmlElementProvider: ValueProvider<typeof create> = {
  useValue: create,
  provide: XML_BUILDER_PROVIDER,
};
