// Configuration exports

import { developmentConfig } from './development';
import { productionConfig } from './production';

const isDevelopment = __DEV__;

export const config = isDevelopment ? developmentConfig : productionConfig;

export { developmentConfig, productionConfig };