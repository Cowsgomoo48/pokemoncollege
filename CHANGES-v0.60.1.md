# PokémonCollege v0.60.1

## 💻 Command-line questions you type out
- **New "Paths and awkward file names" problems:** you're told your current directory and where a file is, then you type the command. Example: *Your current directory is `/home/sam/to`. What command will read (print) the file `==double_equal.txt`? It's located in `/var/log/data`.*
  - **Tasks:** read it (`cat`), page through it (`less`), count its lines (`wc -l`), search it (`grep`), run a script, make a script executable for you, or copy it into your current directory.
  - **Where the file is:** inside your folder, in a sibling folder, a few folders up, or somewhere else entirely (like `/var/log/...`).
  - **Awkward names:** spaces, `&`, `#`, brackets, `==` and a leading `-`.
- **Every correct answer counts:**
  - a relative path (`../../file`), the absolute path, or `~/...`
  - quoting the whole path, just the name, or a backslash before each special character
  - `./` where it's needed
- **Wrong answers are caught:** a name with a space, `&`, `#` or brackets left unquoted, one `..` too many or too few, or the wrong command.
- **Hints:**
  - Count the folders up and down.
  - Spot the characters that need quoting.
  - Put the command together.
- **Typing is the default:** command problems now ask you to type the command most of the time (multiple choice is still the Make-Up after a miss). The regex and wildcard ones, whose answers are words, stay multiple choice.
- **More of them:** command problems show up twice as often in a study set, so they outnumber the flashcard terms.
