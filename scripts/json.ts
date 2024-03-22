import fs from "fs";
const fileName = "info.json";
export const writeJsonFile = (name: string, address: string) => {
  const existFile = fs.existsSync(fileName);
  let data = { name: name, address: address };
  if (!existFile) {
    fs.writeFileSync(fileName, JSON.stringify(data));
  } else {
    data = { ...data, ...JSON.parse(fs.readFileSync(fileName, "utf-8")) };
  }
};
