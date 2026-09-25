// eunomai safe-controls — the command reader.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "./segments.mjs";

const words = (command, opts) => parse(command, opts).map((s) => s.words.map((w) => w.text));

test("segments split on operators outside quotes only", () => {
  assert.deepEqual(words("a x && b 'y; z' | c; d"), [["a", "x"], ["b", "y; z"], ["c"], ["d"]]);
});

test("quotes are removed; only single-quoted words are literal (never expanded)", () => {
  const [seg] = parse(`echo "a b" 'c $HOME' d\\ e`);
  assert.deepEqual(seg.words.map((w) => [w.text, w.literal]), [["echo", false], ["a b", false], ["c $HOME", true], ["d e", false]]);
});

test("a heredoc body is kept apart from the words", () => {
  const [seg, next] = parse("cat > f <<'EOF'\nrm -rf /\nEOF\nls");
  assert.deepEqual(seg.words.map((w) => w.text), ["cat"]);
  assert.deepEqual(seg.redirects.map((r) => [r.op, r.target.text]), [[">", "f"]]);
  assert.deepEqual(seg.heredocs, ["rm -rf /"]);
  assert.deepEqual(next.words.map((w) => w.text), ["ls"]);
});

test("$( ) inside double quotes stays inside the word", () => {
  const segs = parse(`git commit -m "$(cat <<'EOF'\nfeat: x\nEOF\n)"`);
  assert.deepEqual(segs[0].words.map((w) => w.text), ["cat"]); // the substitution, read as code first
  assert.deepEqual(segs[0].heredocs, ["feat: x"]);
  const seg = segs.at(-1);
  assert.equal(seg.words.length, 4);
  assert.match(seg.words[3].text, /^\$\(cat <<'EOF'\nfeat: x\nEOF\n\)$/);
});

test("code passed to sh -c, eval, pwsh -Command and cmd /c is read as commands", () => {
  assert.deepEqual(words("sh -c 'rm -rf ~; ls'"), [["rm", "-rf", "~"], ["ls"]]);
  assert.deepEqual(words('eval "git push -f"'), [["git", "push", "-f"]]);
  assert.deepEqual(words("cmd /c rmdir /s /q build"), [["rmdir", "/s", "/q", "build"]]);
});

test("leading assignments and wrappers are set aside, assignments remembered", () => {
  const segs = parse("S=/tmp/x; sudo -E rm -rf $S");
  assert.deepEqual(segs.at(-1).words.map((w) => w.text), ["rm", "-rf", "$S"]);
  assert.equal(segs.at(-1).vars.S, "/tmp/x");
});

test("PowerShell: backtick escapes and doubled single quotes", () => {
  assert.deepEqual(words('git commit -m "a`nb"', { powershell: true }), [["git", "commit", "-m", "a\nb"]]);
  assert.deepEqual(words("echo 'it''s'", { powershell: true }), [["echo", "it's"]]);
});

test("redirections are not arguments, and 2>&1 does not split the command", () => {
  const segs = parse("rm -rf build 2>/dev/null | tail -1; cmd 2>&1");
  assert.deepEqual(segs.map((s) => s.words.map((w) => w.text)), [["rm", "-rf", "build"], ["tail", "-1"], ["cmd"]]);
  assert.equal(segs[0].redirects[0].target.text, "/dev/null");
});

test("assignments expand what is already known, export included", () => {
  const segs = parse("S=/tmp/x; R=$S/base; export T=$R/y; rm -rf $T");
  assert.equal(segs.at(-1).vars.T, "/tmp/x/base/y");
});

test("comments are dropped and malformed input does not throw", () => {
  assert.deepEqual(words("ls # rm -rf /"), [["ls"]]);
  assert.doesNotThrow(() => parse(`echo "unterminated`));
  assert.doesNotThrow(() => parse("cat <<EOF\nno end"));
});
