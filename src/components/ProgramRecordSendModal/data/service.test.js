import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { sendRecords } from './service';

const mockPost = jest.fn();

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(() => ({
    post: mockPost,
  })),
}));

jest.mock('@edx/frontend-platform/config', () => ({
  getConfig: jest.fn(() => ({
    CREDENTIALS_BASE_URL: 'https://credentials.example.com',
  })),
}));

describe('SendRecordModalService', () => {
  it('calls the correct API endpoint with programUUID, username, and pathwayId', async () => {
    const programUUID = 'test-uuid';
    const username = 'testuser';
    const pathwayId = 'pathway-123';
    const expectedUrl = 'https://credentials.example.com/records/programs/test-uuid/send';
    const mockResponse = { status: 200, data: { message: 'Records sent successfully' } };
    mockPost.mockResolvedValue(mockResponse);

    const result = await sendRecords(programUUID, username, pathwayId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith(
      expectedUrl,
      { username, pathway_id: pathwayId },
    );
    expect(result).toEqual(mockResponse);
  });

  it('correctly handles API errors', async () => {
    const mockError = new Error('API request failed');
    mockPost.mockRejectedValue(mockError);

    await expect(sendRecords('test-uuid', 'testuser', 'some-pathway')).rejects.toThrow(mockError);
  });
});

// TODO: check package-lock.json for history package and remove if possible -- might be needed for Router
