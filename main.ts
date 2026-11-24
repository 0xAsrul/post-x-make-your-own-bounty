// Entry for make.fun competition "post-x-promote-make-your-own-bounty-01".
//
// The grader runs this file as `node /bot/main.ts` with the repository
// mounted read-only. It reads the X post address recorded in POST.json
// and writes a short plain-text summary of the entry into the output
// directory, then exits 0.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMPETITION_SLUG = "post-x-promote-make-your-own-bounty-01";
const PLAY_CODE = "makefun-warren-sonnet-kettle";

// The entry only makes sense if POST.json names a real X status address,
// so check its shape and refuse to write a summary for anything else.
function parsePostUrl(raw: string): { url: string; handle: string; statusId: string } {
  const match = /^https:\/\/x\.com\/([A-Za-z0-9_]+)\/status\/(\d+)$/.exec(raw.trim());
  if (!match) {
    throw new Error(`POST.json url is not an x.com status address: ${raw}`);
  }
  return { url: match[0], handle: match[1], statusId: match[2] };
}

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? ".";

  const postFile = join(botDir, "POST.json");
  const post = JSON.parse(readFileSync(postFile, "utf8")) as { url?: string };
  if (typeof post.url !== "string" || post.url.length === 0) {
    throw new Error("POST.json is missing its \"url\" field");
  }
  const postInfo = parsePostUrl(post.url);

  const lines = [
    `Competition: ${COMPETITION_SLUG}`,
    `Post: ${postInfo.url}`,
    `Author: @${postInfo.handle}`,
    `Status id: ${postInfo.statusId}`,
    `Play code: ${PLAY_CODE}`,
  ];

  const outFile = join(outputDir, "entry.txt");
  writeFileSync(outFile, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${outFile}`);
}

main();
