/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Factory } from 'rosie';
import {
  render, screen, cleanup, initializeMockApp,
} from '../../../setupTest';
import ProgramRecordHeader from '../ProgramRecordHeader';
import ProgramRecordTable from '../ProgramRecordTable';
import programRecordFactory from './__factories__/programRecord.factory';

describe('program-completion', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });
  const responseMock = programRecordFactory.build();
  it('renders a "Partially Completed" badge', async () => {
    render(
      <ProgramRecordHeader
        learner={responseMock.record.learner}
        program={responseMock.record.program}
        platform={responseMock.record.platform_name}
      />,
    );
    expect(await screen.findByText('Partially Completed')).toBeTruthy();
  });
  it('renders a "Not Earned" badge', async () => {
    responseMock.record.program.empty = true;
    render(
      <ProgramRecordHeader
        learner={responseMock.record.learner}
        program={responseMock.record.program}
        platform={responseMock.record.platform_name}
      />,
    );
    expect(await screen.findByText('Not Earned')).toBeTruthy();
  });
  it('renders an "Earned" badge', async () => {
    responseMock.record.program.completed = true;
    render(
      <ProgramRecordHeader
        learner={responseMock.record.learner}
        program={responseMock.record.program}
        platform={responseMock.record.platform_name}
      />,
    );
    expect(await screen.findByText('Earned')).toBeTruthy();
  });
});

it('renders the correct badges for course completion', async () => {
  const responseMock = programRecordFactory.build();
  render(<ProgramRecordTable grades={responseMock.record.grades} />);
  expect(await screen.findByText('Earned')).toBeTruthy();
  expect(await screen.findByText('Not Earned')).toBeTruthy();
});
