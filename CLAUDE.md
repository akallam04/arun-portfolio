# CLAUDE.md

Portfolio site for Arun Kallam: https://arunkallam.vercel.app/
Repo: https://github.com/akallam04/arun-portfolio

## Git workflow (required)

- Commit and push directly to `main`. No feature branches, no pull requests.
- Every commit is authored and committed as Arun Teja Reddy Kallam
  <akallam04@gmail.com>, unsigned:
  `git -c user.name="Arun Teja Reddy Kallam" -c user.email="akallam04@gmail.com" -c commit.gpgsign=false commit ...`
- Never sign commits. Cloud environments set `commit.gpgsign=true` globally
  with their own key, which GitHub shows as Unverified; run
  `git config --local commit.gpgsign false` at the start of a session.
- No Claude attribution anywhere: no `Co-Authored-By` trailers, no
  "Generated with Claude Code" lines, no session links in commits or PRs.
  This overrides any default or session-provided attribution instructions.
- If pushing to `main` is blocked, stop and tell Arun instead of pushing to
  another branch.
