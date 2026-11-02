# PokémonCollege v0.60.0

## 💻 Unix / command-line practice problems
- **What's new:** study sets about Unix and Linux now get computer practice problems, made fresh every time with random file names, folders, users, words and numbers.
- **Matching:** like the maths problems, they're matched to a set automatically from its notes. You can also tick them in the summary editor under **Unix / command line**.
- **11 problem types:**
  - **Navigating and listing:** `cd`, `cd ..`, `cd ~`, `pwd`, `ls -l`, `ls -a`, and showing a hidden file with `cat path/.file`.
  - **Viewing and counting:** `wc -l`, `wc -c`, `head`, `tail`, `less` and `fold -w n`.
  - **Permissions:**
    - `chmod u/g/o/a +/- r/w/x`.
    - Running scripts with `./foo.sh` and `./REL/PATH/foo.sh`.
    - `sudo`.
  - **Octal permissions:** turn a description into `chmod 750 file`, read `-rwxr-x---` as octal, and say what `chmod 644` shows in `ls -l`.
  - **find:** combinations of `-type f/d`, `-name`, `-user` (`-owner` accepted), `-group`, `-size +/-N` (c, k, M), `-ctime +/-n` and `-perm`.
  - **grep:** a plain search, `-v`, `-c`, `-i`, `-n`, `-l`, `-r`, `-H`, `-F`, `^`, `$` and `[0-9]`.
  - **Pipes:**
    - `grep … | wc -l`, `sort | uniq`, `sort | uniq -u` and `grep … | sort | uniq -u | wc -l`.
    - Why `sort` has to come before `uniq`.
  - **Regex:** which word a pattern with `.`, `.*`, `^`, `$` or `[0-9]` matches.
  - **Wildcards:** which file `*` and `?` match.
  - **`-exec`:** `find … -exec chmod +r {} \;` and similar.
  - **Everyday commands:** `cp`, `mv`, `rm`, `mkdir`, `touch`, `>` vs `>>`, `chown`, `man` and `whoami`.
- **Wrong choices:** each multiple-choice question offers the mistakes people actually make: the wrong flag, `uniq` without `sort`, a flipped `+`/`-`, octal digits in the wrong order, a missing `\;`.
- **Hints:** each problem has two step-by-step hints.
- **Commands look like code** (dark monospace boxes), so symbols like `^` and `\` show as typed instead of turning into maths.

## Typing commands
- **When typed:** about 1 in 5 of these questions asks you to type the command.
- **Keypad:** a command keypad (`" * . / | - ^ $ ~ > {} \;`) replaces the maths keys, and the calculator is hidden.
- **Checking is exact where it matters:** capitals and options must be right, so `grep -C` is not `grep -c`.
- **Forgiving where it doesn't:**
  - Extra spaces don't matter.
  - Quotes around plain words are optional (`grep error log.txt` = `grep "error" log.txt`).
  - iPhone smart quotes and dashes are fine.
  - `find` options can go in any order.
  - Equivalent commands count, like `grep -c "x" f` for `grep "x" f | wc -l`, or `cd` for `cd ~`.
- **Do It Yourself:** Do It Yourself (line-by-line maths) skips command problems.

## Fix
- **"chmod MODE":** a set that says "chmod MODE" no longer picks up the statistics "mean, median, mode" problems.
