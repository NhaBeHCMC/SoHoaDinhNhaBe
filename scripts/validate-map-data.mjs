import { execFileSync } from "node:child_process";

execFileSync("npm", ["run", "test", "--", "src/test/map-data.test.ts"], {
  stdio: "inherit",
  shell: process.platform === "win32"
});
