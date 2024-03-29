import { getConfig, getPath } from '@edx/frontend-platform';

import createCorrectInternalRoute from './utils';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  ensureConfig: jest.fn(),
  getPath: jest.fn(),
}));

describe('LearnerRecord utils', () => {
  describe('createCorrectInternalRoute', () => {
    beforeEach(() => {
      getConfig.mockReset();
      getPath.mockReset();
    });

    it('returns the correct internal route when checkPath is not prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com' });
      getPath.mockReturnValue('/');

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/some/path');
    });

    it('returns the input checkPath when it is already prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com' });
      getPath.mockReturnValue('/learner-record');

      const checkPath = '/learner-record/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/learner-record/some/path');
    });

    it('handles basePath ending with a slash correctly', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com/' });
      getPath.mockReturnValue('/learner-record/');

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/learner-record/some/path');
    });
  });
});
