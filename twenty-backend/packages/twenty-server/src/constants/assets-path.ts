import path from 'path';

const IS_BUILT_THROUGH_TESTING_MODULE = !__dirname
  .replace(/\\/g, '/')
  .includes('/dist/');

export const ASSET_PATH = IS_BUILT_THROUGH_TESTING_MODULE
  ? path.resolve(__dirname, `../`)
  : path.resolve(__dirname, `../assets`);
