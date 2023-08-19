import { program } from 'commander';

function commaSeparatedList(value: string, _previous: unknown) {
  return value.split(',');
}

program
  .command('generate <type> <name>')
  .description('Generate specific components for the T3 NextJS app')
  .option('-a, --attributes <items>', 'List of attributes written as name:type', commaSeparatedList);

export default program;
