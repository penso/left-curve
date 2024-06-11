# Contributing Guidelines

Guidelines for contributing code to this repository.

## Formatting

Please use _nightly_ toolchain to format your code before pushing. The easiest way to do this is using the following [just](https://github.com/casey/just) command:

```bash
just fmt
```

We use [several rustfmt configurations](./rustfmt.toml) that are not yet available in the stable channel.

Make sure to format macros by hand - rustfmt won't format macros.

## Flat structure

We prefer a _flat structure_ for our crates, meaning there should never be a crate nested inside another crate:

```plain
crates/
└── outer-crate/
    ├── inner-crate/
    │   ├── src/
    │   │   └── lib.rs
    │   └── Cargo.toml
    ├── src/
    │   └── lib.rs
    └── Cargo.toml
```

Nor should a crate contain sub-directories:

```plain
crate-name/
    ├── src/
    │   ├── math/
    │   │   └── mod.rs
    │   └── lib.rs
    └── Cargo.toml
```

If you find a crate needing a subdirectory, it's probably too complex, and should be broken down into multiple crates.

## No submodules

Within a single file, there shouldn't be sub-modules:

```rust
mod display {
    use std::fmt::Display;

    impl Display for MyType {
        // ...
    }
}
```

This means adding an extra 4 spaces of indentation to the code, which is ugly.

If you need to section the code, just add a separator comment instead:

```rust
use std::fmt::Display;

// -------------------------- implement display trait --------------------------

impl Display for MyType {
    // ...
}
```

The only exception to this is tests, which we always use a `tests` (plural, not `test`) submodule:

```rust
// ----------------------------------- tests -----------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn should_work() {
        // ...
    }
}
```

## Grouping imports

Use a single `use` statement at the beginning of the file to import all necessary dependencies:

```rust
// ❌ not this:
use crate::{Uint128, Uint256};
use serde::{de, ser};
use std::str::FromStr;

// ✅ this:
use {
  crate::{Uint128, Uint256},
  serde::{de, ser},
  std::str::FromStr,
};
```

## Comments

Comments should be in Markdown format, with a max width of 80.

This is narrower than the max width for code (100), because to me comments are harder to read if they are too wide.

It's helpful to add the following to VS Code config, so that it shows two rulers, one for comments and one for code:

```json
{
  "editor.rulers": [80, 100]
}
```

Prefer comments to be above a line, instead of trailing a line:

```rust
// ❌ not this:
let digits = S as u32 - decimal_places; // No overflow because decimal_places < S

// ✅ this:
// No overflow because decimal_places < S
let digits = S as u32 - decimal_places;
```

## Trailing whitespaces

Your code shouldn't have any trailing whitespace. We recommend installing [this VS Code extension](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces) which highlights all trailing whitespaces.

The last line of a file should end with a newline character (`\n`) which is [customary for UNIX systems](https://unix.stackexchange.com/questions/18743/whats-the-point-in-adding-a-new-line-to-the-end-of-a-file). This can be automated with the following VS Code config:

```json
{
  "files.insertFinalNewline": true
}
```