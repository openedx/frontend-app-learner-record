import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

export const getCredentialsFactory = Factory.define('credentials')
  .attr('program_credentials', () => [
    {
      uuid: '12345',
      status: 'awarded',
      username: 'honor',
      download_url: null,
      credential_id: 1,
      credential_uuid: '54321',
      credential_title: 'Program title 1',
      credential_org: 'Program org 1',
      modified_date: '2022-10-08',
    },
    {
      uuid: '67890',
      status: 'awarded',
      username: 'honor',
      download_url: null,
      credential_id: 1,
      credential_uuid: '09876',
      credential_title: 'Program title 2',
      credential_org: '',
      modified_date: '2023-02-02',
    },
  ])
  .attr('course_credentials', () => [
    {
      uuid: '1234512',
      status: 'awarded',
      username: 'honor',
      download_url: null,
      credential_id: 1,
      credential_uuid: '5432112',
      credential_title: 'Course title 1',
      credential_org: 'Course org 1',
      modified_date: '2022-10-08',
    },
  ]);

export const getAvailableStoragesFactory = Factory.define('storages')
  .attrs({
    id: 'test_storage',
    name: 'Test Storage Name',
  });
