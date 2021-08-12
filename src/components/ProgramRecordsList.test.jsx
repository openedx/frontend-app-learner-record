import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import ProgramRecordsList from './ProgramRecordsList';
import getProgramRecords from './data/service';

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedUser.mockReturnValue(axios);
axiosMock.onAny().reply(200);
axios.get = jest.fn();

jest.mock('./data/service.js');

describe('ProgramRecordsList test components', () => {
  const container = shallow(<ProgramRecordsList />);

  it('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  it('should have an profile component', () => {
    expect(container.find('FormattedMessage[id="records.profile.link"]').props()).toEqual({
      id: 'records.profile.link',
      defaultMessage: 'Back to My Profile',
      description: 'Link text that redirects logged-in user to their profile page',
      values: {},
    });
  });

  it('should have a `My Learner Records` header', () => {
    expect(container.find('FormattedMessage[id="records.header"]').props()).toEqual({
      id: 'records.header',
      defaultMessage: 'My Learner Records',
      description: 'Header for the Learner Records page',
      values: {},
    });
  });

  it('should have a help section', () => {
    expect(container.find('FormattedMessage[id="records.help.header"]').props()).toEqual({
      id: 'records.help.header',
      defaultMessage: 'Questions about Learner Records?',
      description: 'Header for the help section of Learner Records page',
      values: {},
    });
  });
});

describe('ProgramRecordsList tests with completed programs', () => {
  let container;
  const wrapper = shallow(<div><ProgramRecordsList /></div>);

  beforeAll(() => {
    getProgramRecords.mockResolvedValue({
      enrolled_programs: [
        {
          name: 'myProgram',
          uuid: '12345',
          partner: 'edX',
          completed: true,
          empty: false,
        },
      ],
    });
  });

  beforeEach(() => {
    container = wrapper.find('ProgramRecordsList').dive();
  });

  it('should call get API data request', () => {
    expect(getProgramRecords).toBeCalledTimes(1);
  });

  it('should contain DataTable with completed programs', () => {
    expect(container.html()).toMatchSnapshot();
  });
});

describe('ProgramRecordsList tests with partially completed data', () => {
  let container;
  const wrapper = shallow(<div><ProgramRecordsList /></div>);

  beforeAll(() => {
    getProgramRecords.mockResolvedValue({
      enrolled_programs: [
        {
          name: 'myProgram',
          uuid: '12345',
          partner: 'edX',
          completed: false,
          empty: false,
        },
      ],
    });
  });

  beforeEach(() => {
    container = wrapper.find('ProgramRecordsList').dive();
  });

  it('should contain DataTable with partially completed programs', () => {
    expect(container.html()).toMatchSnapshot();
  });
});

describe('ProgramRecordsList tests with empty data', () => {
  let container;
  const wrapper = shallow(<div><ProgramRecordsList /></div>);

  beforeAll(() => {
    getProgramRecords.mockResolvedValue({});
  });

  beforeEach(() => {
    container = wrapper.find('ProgramRecordsList').dive();
  });

  it('should not contain a DataTable', () => {
    expect(container.html()).toMatchSnapshot();
  });
});
