import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { create }  from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import { XML_BUILDER_PROVIDER } from '../constant/xmlbuilder.provider.constant';

// No need to custom more XML ELEMENT for now
export const xmlElementProvider: ValueProvider<XMLBuilder> = {
  useValue: create(),
  provide: XML_BUILDER_PROVIDER
};
