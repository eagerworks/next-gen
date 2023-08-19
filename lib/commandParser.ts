import { program } from 'commander';

function commaSeparatedList(value: string, _previous: unknown) {
  return value.split(',');
}

const configProgram = program
  .command('init')
  .description('Generate specific components for the T3 NextJS app');

const generatorProgram = program
  .command('generate <type> <name>')
  .description('Generate specific components for the T3 NextJS app')
  .option('-a, --attributes <items>', 'List of attributes written as name:type', commaSeparatedList);

export { configProgram, generatorProgram };
