import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getProgramDetails, getProgramRecordUrl, getProgramRecordCsv } from './service';

const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
  })),
}));

jest.mock('@edx/frontend-platform/config', () => ({
  getConfig: jest.fn(() => ({
    CREDENTIALS_BASE_URL: 'https://credentials.example.com',
  })),
}));

describe('ProgramRecordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProgramDetails', () => {
    it('calls the correct API endpoint with programUUID and isPublic', async () => {
      const programUUID = 'test-uuid';
      const isPublic = true;
      const expectedUrl = 'https://credentials.example.com/records/api/v1/program_records/test-uuid/?is_public=true';
      mockGet.mockResolvedValue({ data: { key: 'value' } });

      const result = await getProgramDetails(programUUID, isPublic);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { withCredentials: true });
      expect(result).toEqual({ key: 'value' });
    });

    it('returns an empty object if the API call fails', async () => {
      const programUUID = 'test-uuid';
      const isPublic = false;
      mockGet.mockRejectedValue(new Error('API error'));

      const result = await getProgramDetails(programUUID, isPublic);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith(expect.stringContaining(programUUID), { withCredentials: true });
      expect(result).toEqual({});
    });
  });

  describe('getProgramRecordUrl', () => {
    it('calls the correct API endpoint with programUUID and username', async () => {
      const programUUID = 'test-uuid';
      const username = 'testuser';
      const expectedUrl = 'https://credentials.example.com/records/programs/test-uuid/share';
      const mockResponse = { data: { url: 'shared-url' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await getProgramRecordUrl(programUUID, username);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { username }, { withCredentials: true });
      expect(result).toEqual(mockResponse);
    });

    it('correctly handles API errors', async () => {
      const mockError = new Error('API request failed');
      mockPost.mockRejectedValue(mockError);

      await expect(getProgramRecordUrl('test-uuid', 'testuser')).rejects.toThrow(mockError);
    });
  });

  describe('getProgramRecordCsv', () => {
    it('calls the correct API endpoint with programUUID', async () => {
      const programUUID = 'test-uuid';
      const expectedUrl = 'https://credentials.example.com/records/programs/shared/test-uuid/csv';
      const mockResponse = { status: 200, data: 'csv data' };
      mockGet.mockResolvedValue(mockResponse);

      const result = await getProgramRecordCsv(programUUID);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { withCredentials: true });
      expect(result).toEqual(mockResponse);
    });

    it('correctly handles API errors', async () => {
      const mockError = new Error('API request failed');
      mockGet.mockRejectedValue(mockError);

      await expect(getProgramRecordCsv('test-uuid')).rejects.toThrow(mockError);
    });
  });
});
