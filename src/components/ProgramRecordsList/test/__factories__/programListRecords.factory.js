import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

export default Factory.define('enrolled_programs')
  .attr('enrolled_programs', [
    {
      name: 'myProgram',
      uuid: '12345',
      partner: 'edX',
      completed: true,
      empty: false,
    },
    {
      name: 'anotherProgram',
      uuid: '54321',
      partner: 'edX',
      completed: false,
      empty: false,
    },
  ]);
