import * as fs from 'fs';
import path from 'path';

function generateConfigFile() {
  const configContent = fs.readFileSync(path.resolve(__dirname, '../templates/next-gen.json.template'));

  console.log("Generating config file");
  fs.writeFileSync(path.resolve(__dirname, './next-gen.json'), configContent);
}

export default generateConfigFile;
