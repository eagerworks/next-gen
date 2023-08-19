import * as fs from "fs";
import path from "path";

function generateConfigFile() {
  const configContent = fs.readFileSync(
    path.resolve(__dirname, "../templates/next-gen.json.template"),
  );

  fs.writeFileSync("./next-gen.json", configContent);
}

export default generateConfigFile;
