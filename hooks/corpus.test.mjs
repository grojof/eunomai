// eunomai safe-controls — the everyday-command corpus, at the default (standard) level.
// Every command a developer or an agent runs daily must pass silently; every real hit must still fire.
// Run: node --test "hooks/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import { decide } from "./decide.mjs";
import { DEFAULTS } from "./config.mjs";

const CTX = {
  cwd: "/home/u/proj",
  projectDir: "/home/u/proj",
  home: "/home/u",
  env: { HOME: "/home/u" },
  readFile: () => null,
};

const AI = "Co-Authored-By: Claude Opus <noreply@anthropic.com>";

// [tool, command, decision, gate?]
const CORPUS = [
  // secrets: reading a real secret asks; writing one, the word, examples and public keys do not
  ["Bash", "cat .env.example", "allow"],
  ["Bash", "cp .env.example .env", "allow"],
  ["Bash", "cp .env backup.env", "ask", "secret-read"],
  ["Bash", "cat .env", "ask", "secret-read"],
  ["Bash", "cat config/.env.production", "ask", "secret-read"],
  ["Bash", 'echo "FOO=1" >> .env', "allow"],
  ["Bash", "source .env", "ask", "secret-read"],
  ["Bash", "psql < .pgpass", "ask", "secret-read"],
  ["Bash", "cat ~/.aws/credentials", "ask", "secret-read"],
  ["Bash", "cat ~/.ssh/id_ed25519", "ask", "secret-read"],
  ["Bash", "cat ~/.ssh/id_ed25519.pub", "allow"],
  ["Bash", "grep -r credential src/", "allow"],
  ["Bash", "grep -rn credentials docs/", "allow"],
  ["Bash", "ls secrets/", "allow"],
  ["Bash", "docker compose --env-file .env up", "allow"],
  ["Bash", "echo $CREDENTIALS_PATH", "allow"],
  ["Bash", "pytest tests/test_credentials.py", "allow"],
  ["Bash", "python manage.py test apps.credentials", "allow"],
  ["Bash", "git log --oneline -- src/auth/credential_store.py", "allow"],
  ["Bash", "git diff HEAD -- .env.example", "allow"],
  ["Bash", "git log --all -- '*.env'", "allow"],
  ["Bash", "npx dotenv -e .env.test -- jest", "allow"],
  ["Bash", "openssl x509 -in cert.pem -text", "allow"],
  ["Bash", "kubectl get secrets", "allow"],
  ["Bash", "source .venv/bin/activate", "allow"],
  ["Bash", 'node -e "console.log(process.env.HOME)"', "allow"],
  ["Bash", "git config --global credential.helper store", "allow"],
  ["Bash", "git config credential.https://github.com.username me", "allow"],
  ["Bash", "vim src/env.ts", "allow"],
  // version bumps: strict only
  ["Bash", "npm version", "allow"],
  ["Bash", "npm version --json", "allow"],
  ["Bash", "npm version minor", "allow"],
  // force-push
  ["Bash", "git push --force-with-lease", "allow"],
  ["Bash", "git push -u origin feature", "allow"],
  ["Bash", "git push origin main:refs/heads/main", "allow"],
  ["Bash", "git push --force origin main", "ask", "force-push"],
  ["Bash", "git push -f origin main", "ask", "force-push"],
  ["Bash", "git push origin +main", "ask", "force-push"],
  ["Bash", "git --no-pager -C repo push --force", "ask", "force-push"],
  ["Bash", "git --git-dir=.git push -f", "ask", "force-push"],
  ["Bash", "grep -rn 'git push --force' docs/", "allow"],
  ["Bash", "npm run build -- --force", "allow"],
  // recursive deletes: regenerable and temp targets pass, risky targets ask
  ["Bash", "rm -rf node_modules", "allow"],
  ["Bash", "rm -rf dist build", "allow"],
  ["Bash", "rm -rf .pytest_cache __pycache__", "allow"],
  ["Bash", "rm -rf /tmp/foo", "allow"],
  ["Bash", "rm -rf /tmp/odwg-mail-*", "allow"],
  ["Bash", "rm -rf /tmp/*", "ask", "recursive-delete"],
  ["Bash", "rm -rf ~/.cache/*", "allow"],
  ["Bash", "rm -rf ~/*", "ask", "recursive-delete"],
  ["Bash", "S=/tmp/claude-1000/x; rm -rf $S/mut", "allow"],
  ["Bash", "cd dist && rm -rf *", "allow"],
  ["Bash", "rm -rf ~", "ask", "recursive-delete"],
  ["Bash", "rm -rf /", "ask", "recursive-delete"],
  ["Bash", "rm -rf $HOME/project", "ask", "recursive-delete"],
  ["Bash", 'rm -rf "$HOME"', "ask", "recursive-delete"],
  ["Bash", "rm -rf ../other", "ask", "recursive-delete"],
  ["Bash", "rm -rf .", "ask", "recursive-delete"],
  ["Bash", "rm -rf *", "ask", "recursive-delete"],
  ["Bash", "rm -rf $UNSET_VAR/x", "ask", "recursive-delete"],
  ["Bash", "sudo rm -r /var/lib/foo", "ask", "recursive-delete"],
  ["Bash", "sh -c 'rm -rf ~'", "ask", "recursive-delete"],
  ["Bash", "echo 'never run rm -rf /' >> notes.txt", "allow"],
  // deep paths outside the project are clean-ups; scopes that cannot be are not
  ["Bash", "rm -rf ~/.local/share/Odoo/filestore/rolechk", "allow"],
  ["Bash", "rm -rf ~/workspaces/acme/build", "allow"],
  ["Bash", "for m in 12 13; do rm -rf ~/.local/share/Odoo/filestore/allver_$m; done", "allow"],
  ["Bash", "rm -rf /mnt/c/Users/me/AppData/Local/Temp/shots", "allow"],
  ["Bash", "rm -rf ~/.config/someapp", "allow"],
  ["Bash", "rm -rf build 2>/dev/null", "allow"],
  ["Bash", "S=/tmp/x; R=$S/base; rm -rf $R/checkpoints", "allow"],
  ["Bash", "rm -rf ~/Documents", "ask", "recursive-delete"],
  ["Bash", "rm -rf ~/.ssh/old", "ask", "recursive-delete"],
  ["Bash", "rm -rf /mnt/c/Users/me/Documents", "ask", "recursive-delete"],
  ["Bash", "sudo rm -rf /etc/opensnitchd", "ask", "recursive-delete"],
  ["Bash", "sudo rm -rf /var/lib/postgresql", "ask", "recursive-delete"],
  ["Bash", "rm -rf /tmp", "ask", "recursive-delete"],
  ["Bash", "rm -rf $DIR", "ask", "recursive-delete"],
  ["Bash", 'gh pr merge 3 --squash --body "Merges the parser fix."', "allow"],
  ["Bash", "rm -f single-file.log", "allow"],
  ["Bash", "find . -name '*.pyc' -delete", "allow"],
  // git clean / reset
  ["Bash", "git clean -fdx", "ask", "git-clean"],
  ["Bash", "git clean -fd", "ask", "git-clean"],
  ["Bash", "git clean -n -d", "allow"],
  ["Bash", "git clean -fdn", "allow"],
  ["Bash", "git reset --hard HEAD~3", "ask", "reset-hard"],
  ["Bash", "git reset --soft HEAD~1", "allow"],
  ["Bash", "git checkout -- .", "allow"],
  ["Bash", "git branch -D feature", "allow"],
  // attribution: only the real message or PR body counts
  ["Bash", `git commit -m "feat: x\n\n${AI}"`, "deny", "ai-coauthor"],
  ["Bash", `git commit -m "$(cat <<'EOF'\nfeat: x\n\n${AI}\nEOF\n)"`, "deny", "ai-coauthor"],
  ["Bash", `git -C /some/repo commit -m "feat: z\n\n${AI}"`, "deny", "ai-coauthor"],
  ["Bash", 'git commit -m "fix: y\n\n🤖 Generated with Claude Code"', "deny", "ai-coauthor"],
  ["Bash", 'git commit -m "docs: explain why the hook refuses noreply@anthropic.com"', "allow"],
  ["Bash", 'git commit -m "feat: x" -m "Co-authored-by: Jane Doe <jane@example.com>"', "allow"],
  ["Bash", 'git commit -m "feat: x" -m "Co-authored-by: Claude Monet <claude@example.org>"', "allow"],
  ["Bash", 'git commit -m "feat: x" -m "Assisted-by: Claude"', "allow"],
  ["Bash", 'git commit -m "feat: x" -m "Assisted-by: Claude Opus 5.5"', "ask", "disclosure-detail"],
  ["Bash", "git commit -F /tmp/msg.txt", "allow"],
  ["Bash", `cat > test/fixture.mjs <<'EOF'\nconst c = 'git commit -m x';\nconst t = '${AI}';\nEOF`, "allow"],
  ["Bash", "grep -rn 'Co-Authored-By: Claude' . && git commit -m 'chore: tidy'", "allow"],
  ["Bash", 'git commit -m "fix env parsing"', "allow"],
  ["Bash", 'git commit -m "fix .env parsing"', "allow"],
  ["Bash", 'gh pr create --title x --body "🤖 Generated with [Claude Code](https://claude.com/claude-code)"', "deny", "ai-coauthor"],
  ["Bash", 'gh pr create --title x --body "Fixes the parser."', "ask", "pr-disclosure"],
  ["Bash", 'gh pr create --title x --body "Fixes the parser.\n\nAssisted-by: Claude"', "allow"],
  // ordinary commands
  ["Bash", "git status", "allow"],
  ["Bash", "npm test", "allow"],
  ["Bash", "psql -c 'DROP DATABASE prod'", "allow"],
  // PowerShell
  ["PowerShell", "Get-Content .env.example", "allow"],
  ["PowerShell", "Get-Content .env", "ask", "secret-read"],
  ["PowerShell", "Remove-Item -Recurse -Force node_modules", "allow"],
  ["PowerShell", "Remove-Item -Path build -Recurse -Force -ErrorAction SilentlyContinue", "allow"],
  ["PowerShell", "ri dist -r -fo", "allow"],
  ["PowerShell", "rm -r -fo node_modules", "allow"],
  ["PowerShell", "cmd /c rmdir /s /q build", "allow"],
  ["PowerShell", "Remove-Item -Recurse -Force C:\\", "ask", "recursive-delete"],
  ["PowerShell", "$env:PATH", "allow"],
  ["PowerShell", "Get-ChildItem env:", "allow"],
  ["PowerShell", "Get-Content $env:USERPROFILE\\.ssh\\id_rsa.pub", "allow"],
  ["PowerShell", `git commit -m "feat: x\`n\`n${AI}"`, "deny", "ai-coauthor"],

  // --- regressions found by review ---
  // a heredoc belongs to the command that opened it
  ["Bash", `git commit -F - <<'X' && git push\nfeat: x\n\n${AI}\nX`, "deny", "ai-coauthor"],
  ["Bash", `git add -A && git commit -F - <<'X' && git log -1\nfeat: x\n\n${AI}\nX`, "deny", "ai-coauthor"],
  // commands inside shell keywords are commands
  ["Bash", "if [ -d ~/.ssh ]; then rm -rf ~/.ssh; fi", "ask", "recursive-delete"],
  ["Bash", "for f in a b; do git push --force origin $f; done", "ask", "force-push"],
  ["Bash", "if true; then git reset --hard; fi", "ask", "reset-hard"],
  ["Bash", "{ rm -rf ~; }", "ask", "recursive-delete"],
  ["Bash", "! rm -rf ~", "ask", "recursive-delete"],
  ["Bash", 'for d in */; do rm -rf "$d/node_modules"; done', "allow"],
  // trailers written with =
  ["Bash", "git commit -m 'feat: x' --trailer 'Co-authored-by=Claude <noreply@anthropic.com>'", "deny", "ai-coauthor"],
  // nested shells are read in their own dialect
  ["PowerShell", "cmd /c rd /s /q C:\\", "ask", "recursive-delete"],
  ["Bash", 'pwsh -c "Remove-Item -Recurse -Force ~"', "ask", "recursive-delete"],
  ["Bash", 'powershell.exe -Command "Remove-Item -Recurse -Force C:\\\\Users\\\\u"', "ask", "recursive-delete"],
  ["Bash", "cmd.exe /c rd /s /q C:\\\\Users\\\\u", "ask", "recursive-delete"],
  // paths and variables
  ["Bash", 'rm -rf "${HOME:?}"', "ask", "recursive-delete"],
  ["Bash", 'rm -rf "${HOME:?}"/.ssh', "ask", "recursive-delete"],
  ["Bash", "D=~; rm -rf $D", "ask", "recursive-delete"],
  ["Bash", "D=~/.ssh; rm -rf $D", "ask", "recursive-delete"],
  ["Bash", "rm -rf /mnt/c/Windows/System32", "ask", "recursive-delete"],
  ["Bash", 'rm -rf "/mnt/c/Program Files/x"', "ask", "recursive-delete"],
  ["Bash", "cd src && rm -rf C:/*", "ask", "recursive-delete"],
  ["Bash", "rm -rf /home/other", "ask", "recursive-delete"],
  ["Bash", "rm -rf /Users/u", "ask", "recursive-delete"],
  ["Bash", "cd && rm -rf .ssh", "ask", "recursive-delete"],
  ["Bash", "rm -rf .git", "ask", "recursive-delete"],
  ["Bash", "T=$(mktemp -d); rm -rf \"$T\"", "allow"],
  ["Bash", 'rm -rf "$(mktemp -d)"', "allow"],
  ["Bash", 'rm -rf "${TMPDIR:-/tmp}/x"', "allow"],
  // wrappers with values
  ["Bash", "sudo -u root rm -rf /etc/x", "ask", "recursive-delete"],
  ["Bash", "timeout 10 rm -rf ~", "ask", "recursive-delete"],
  // substitutions are code
  ["Bash", "echo $(rm -rf ~)", "ask", "recursive-delete"],
  ["Bash", "x=$(git push -f)", "ask", "force-push"],
  ["Bash", "TOKEN=$(cat .env)", "ask", "secret-read"],
  ["Bash", "echo `cat .env`", "ask", "secret-read"],
  // git abbreviations and other message carriers
  ["Bash", "git reset --har", "ask", "reset-hard"],
  ["Bash", "git clean -d --f", "ask", "git-clean"],
  ["Bash", "git push --mirror", "ask", "force-push"],
  ["Bash", `MSG="feat: x\n\n${AI}"; git commit -m "$MSG"`, "deny", "ai-coauthor"],
  ["Bash", `git merge feature -m "Merge\n\n${AI}"`, "deny", "ai-coauthor"],
  ["Bash", `git tag -a v1 -m "v1\n\n${AI}"`, "deny", "ai-coauthor"],
  // gh with -R, the new alias, and a body the guard cannot see
  ["Bash", 'gh -R o/r pr create --title x --body "🤖 Generated with [Claude Code](x)"', "deny", "ai-coauthor"],
  ["Bash", 'gh pr new --title x --body "🤖 Generated with Claude Code"', "deny", "ai-coauthor"],
  ["Bash", 'gh pr create --title x --body "$(cat pr.md)"', "allow"],
  // a search pattern is not a file
  ["Bash", 'grep -rn ".env" src', "allow"],
  ["Bash", "rg -l .env", "allow"],
  ["Bash", 'grep -rln "id_rsa" docs', "allow"],
  ["Bash", "grep -n KEY .env", "ask", "secret-read"],
  ["Bash", "grep -e KEY .env", "ask", "secret-read"],
  // the guard's own settings are a person's to change
  ["Bash", `echo '{"mode":"report"}' > .claude/eunomai.local.json`, "ask", "guard-config-write"],
  ["Bash", "cat .claude/eunomai.json", "allow"],
];

for (const [tool, command, decision, gate] of CORPUS) {
  test(`${decision}${gate ? ` [${gate}]` : ""}: ${tool} ${command.replace(/\n/g, "\\n")}`, () => {
    const r = decide(tool, { command }, DEFAULTS, CTX);
    assert.equal(r.decision, decision, r.reason);
    if (gate) assert.equal(r.gate, gate);
  });
}
