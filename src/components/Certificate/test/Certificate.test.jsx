/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
  render, screen, cleanup, initializeMockApp, fireEvent,
} from '../../../setupTest';
import Certificate from '../Certificate';

describe('program-certificate', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => jest.resetModules);
  afterEach(cleanup);

  const props = {
    credential_title: 'Certificate title',
    credential_org: 'Test org',
    modified_date: '2023-02-02',
    storages: [{ id: 'storageId', name: 'storageName' }],
    handleCreate: jest.fn(),
  };

  it('renders the component with type programm', () => {
    render(<Certificate {...props} type="program" />);

    expect(screen.getByText('Program Certificate')).toBeTruthy();
    expect(screen.getByText(props.credential_title)).toBeTruthy();
    expect(screen.getByText(props.credential_org)).toBeTruthy();
    expect(screen.getByText('Awarded on 2/2/2023')).toBeTruthy();
  });

  it('renders the component with type course', () => {
    render(<Certificate {...props} type="course" />);

    expect(screen.getByText('Course Certificate')).toBeTruthy();
    expect(screen.getByText(props.credential_title)).toBeTruthy();
    expect(screen.getByText(props.credential_org)).toBeTruthy();
    expect(screen.getByText('Awarded on 2/2/2023')).toBeTruthy();
  });

  it('should display "No organization" if Organization wasn\'t set', () => {
    render(<Certificate {...props} credential_org="" />);

    expect(screen.getByText('No organization')).toBeTruthy();
  });

  it('renders modal by clicking on a create button', () => {
    render(<Certificate {...props} />);
    fireEvent.click(screen.getByText('Create'));

    expect(screen.findByTitle('Verifiable credential')).toBeTruthy();
    expect(screen.findByLabelText('Close')).toBeTruthy();
  });
});
