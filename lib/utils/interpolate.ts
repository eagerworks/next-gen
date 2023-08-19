import pluralize from 'pluralize';
import camelize from './camelize';
import pascalize from './pascalize';

declare global {
  function pluralize(str: string): string;
  function camelize(str: string): string;
  function pascalize(str: string): string;
}

global.pluralize = pluralize;
global.camelize = camelize;
global.pascalize = pascalize;

export default function interpolate(str: string, values: Record<string, string>) {
  // Use eval to interpolate the string replacing ${} with evaled values
  const fileContent = str.replace(/\${([^}]*)}/g, (_r, k) => {
    return eval(k);
  });

  return fileContent;
};

