import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

export const getProgramCredentialsFactory = Factory.define('program_credentials')
  .attr('program_credentials', [
    {
      uuid: '12345',
      status: 'awarded',
      username: 'honor',
      download_url: null,
      credential_id: 1,
      program_uuid: '54321',
      program_title: 'Program title 1',
      program_org: 'Program org 1',
      modified_date: '2022-10-08',
    },
    {
      uuid: '67890',
      status: 'awarded',
      username: 'honor',
      download_url: null,
      credential_id: 1,
      program_uuid: '09876',
      program_title: 'Programm title 2',
      program_org: '',
      modified_date: '2023-02-02',
    },
  ]);

export const getAvailableStoragesFactory = Factory.define('storages')
  .attrs({
    id: 'test_storage',
    name: 'Test Storage Name',
  });
