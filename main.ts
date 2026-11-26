/**
 * The 3 AM Excuse — make.fun entry
 * (competition u-hazel-walrus-38-4764-the-3-am-excuse-c1017878)
 *
 * Deterministically composes one original, ready-to-hand-over excuse for
 * being awake at 3 AM and writes it to $MAKEFUN_OUTPUT_DIR/entry.txt.
 * Node 22+, standard library only. No network, no randomness, no clock:
 * the same input always produces the same bytes.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HEADER = "THE 3 AM EXCUSE";
const SUBHEADER =
  "An official explanation, prepared in advance, for use when caught awake at 3 AM.";

const BODY: string[] = [
  "To whom it may concern,",
  "",
  'I was not "still awake at 3 AM." I was awake at 3 AM on purpose, performing a scheduled inspection of the night shift. Someone has to check that the dark is still working, and I volunteered.',
  "",
  "My findings:",
  "- The fridge light turns off when the door closes. I verified this personally, several times, because science demands replication.",
  "- The house makes exactly eleven noises after midnight. Ten are the pipes. The eleventh is none of your business.",
  "- Sleep is not late; sleep is merely queued behind several urgent thoughts, including whether penguins have knees (they do) and whether I left the oven on (I did not own the oven in question).",
  "",
  'I therefore request that my 3 AM wakefulness be recorded not as "staying up too late" but as "arriving early for tomorrow, with notes."',
  "",
  "Respectfully submitted,",
  "The Night Shift",
];

function buildEntry(): string {
  const lines: string[] = [HEADER, "", SUBHEADER, ""];
  for (const line of BODY) lines.push(line);
  return lines.join("\n") + "\n";
}

function fail(message: string): never {
  console.error(`self-check failed: ${message}`);
  process.exit(1);
}

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
  if (outputDir.length === 0) fail("MAKEFUN_OUTPUT_DIR is empty");
  const outputPath = join(outputDir, "entry.txt");

  const entry = buildEntry();

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, entry, "utf8");

  // Self-check: read it back and verify the format.
  const roundTrip = readFileSync(outputPath, "utf8");
  if (roundTrip !== entry) fail("round-trip content differs from generated entry");
  if (!roundTrip.startsWith("THE 3 AM EXCUSE\n")) fail("missing title line");
  if (!roundTrip.includes(SUBHEADER)) fail("missing subheader");
  if (!roundTrip.includes("Respectfully submitted,")) fail("missing sign-off");
  if (!roundTrip.endsWith("\n")) fail("entry does not end with a newline");
  const lines = roundTrip.split("\n");
  if (lines.length < 10) fail(`too few lines: ${lines.length}`);
  if (roundTrip.length < 200 || roundTrip.length > 5000) {
    fail(`unexpected entry length: ${roundTrip.length}`);
  }

  console.log(`wrote ${outputPath} (${roundTrip.length} bytes, ${lines.length - 1} lines)`);
  console.log("self-check passed");
}

main();
