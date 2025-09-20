import axios from "axios";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
const token = process.env.FIGMA_TOKEN as string;
const fileKey = process.env.FIGMA_FILE_KEY as string;
if (!token || !fileKey) {
  console.error("Missing FIGMA_TOKEN or FIGMA_FILE_KEY");
  process.exit(1);
}
async function main() {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
  const res = await axios.get(url, { headers: { "X-Figma-Token": token } });
  const outDir = path.join(process.cwd(), "src", "theme");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "figma-variables.json"), JSON.stringify(res.data, null, 2));
  console.log("Wrote src/theme/figma-variables.json");
}
main().catch((e) => { console.error(e); process.exit(1); });
