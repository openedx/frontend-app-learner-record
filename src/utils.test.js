import { getConfig } from '@edx/frontend-platform';

import createCorrectInternalRoute from './utils';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  ensureConfig: jest.fn(),
}));

describe('LearnerRecord utils', () => {
  describe('createCorrectInternalRoute', () => {
    beforeEach(() => {
      getConfig.mockReset();
    });

    it('returns the correct internal route when checkPath is not prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: '/' });

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/some/path');
    });

    it('returns the input checkPath when it is already prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: '/learner-record' });

      const checkPath = '/learner-record/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/learner-record/some/path');
    });

    it('handles basePath ending with a slash correctly', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: '/learner-record/' });

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/learner-record/some/path');
    });
  });
});
