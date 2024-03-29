import { getConfig, getPath } from '@edx/frontend-platform';

/**
 * Create a correct inner path depend on config PUBLIC_PATH.
 * @param {string} checkPath - the internal route path that is validated
 * @returns {string} - the correct internal route path
 */
export default function createCorrectInternalRoute(checkPath) {
  let basePath = getPath(getConfig().PUBLIC_PATH);

  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1);
  }

  if (!checkPath.startsWith(basePath)) {
    return `${basePath}${checkPath}`;
  }

  return checkPath;
}
