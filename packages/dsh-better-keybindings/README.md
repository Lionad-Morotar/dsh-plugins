# dsh-better-keybindings

Keyboard fixes for the DeepSeek Harness client. One job today: make Home and
End move the caret when you are typing, instead of yanking the conversation.

## The bug

Focus the message composer and press Home or End. You expect the caret to jump
to the start or end of the current line. Chromium instead runs the editable's
default action, which is "move the caret, then scroll every scrollable ancestor
into view". On the Harness the nearest such ancestor is
`[data-conversation-scroll]`, so the transcript jumps to its top or bottom while
the composer keeps the old caret. Pressing the key again scrolls again, because
the caret is already on the boundary and only the scroll is left to do.

Verbatim in a bare page (Chromium, an overflowing scroller around a
contenteditable): pressing Home with the caret mid-line scrolls the scroller
from 589 to 0 and leaves the caret untouched.

## What this plugin does

A capture-phase keydown listener on the window. When the stroke is Home or End,
the target is an editable, and Alt is not held, it cancels the default action
and performs the move itself:

| Stroke | Result |
| --- | --- |
| Home / End | Start / end of the current line |
| Ctrl+Home / Ctrl+End (Cmd on macOS) | Start / end of the whole value |
| Shift+Home / Shift+End | Extend the selection to that boundary |
| Alt+Home / Alt+End | Left alone (the host owns those chords) |
| Home / End with no editable focused | Left alone: the chat area keeps its scrolling |

Rich text goes through `Selection.modify(alter, direction, granularity)`, the
primitive browsers use internally for these keys. It is the only approach that
survives the composer's node tree (Lexical spans, line breaks, zero-width
spacers) and it gets bidi and soft wrapping right, which a hand-rolled node walk
does not. Text fields use plain string arithmetic on their selection API.

Because cancelling the keydown also cancels the browser's scroll-into-view, the
plugin reveals the caret itself. The conversation scrollport is explicitly
excluded: that container belongs to the host, which owns follow-the-tail,
reading-intent attribution and scroll restoration. A plugin whose whole purpose
is "stop scrolling the chat" must never scroll it as a side effect.

## Surface coverage

- Web GUI: covered by this package.
- Desktop app: covered, because the desktop shell runs the same client bundles.
- TUI: nothing to fix. `@deepseek-harness-tui/dsh-tui` implements Home/End
  per line in its own `PromptInput` (`key.home` -> `lastIndexOf("\\n")`), its
  transcript never binds these keys, and it exposes no plugin seam for
  rebinding them anyway. This package is web-only on purpose.

## Install (web profile)

Add to `~/.dsh/profiles/web/package.json`:

```json
{
  "dependencies": {
    "dsh-better-keybindings": "link:/Users/lionad/Github/Lionad-Morotar/dsh-plugins/packages/dsh-better-keybindings"
  },
  "dsh": {
    "profile": {
      "bundles": ["...", "dsh-better-keybindings"]
    }
  }
}
```

Then `dsh plugin --profile web install` and restart DSH.

**B. Manual patch**

Append to the profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: better-keybindings
      name: 'dsh-better-keybindings'
```

The top level of that file must always stay a YAML array (`[]` when empty).

## Layout

- `src/index.ts` host half (empty `apply`; the Loader requires it to resolve)
- `src/client/keys.ts` event -> caret action mapping, target classification
- `src/client/caret.ts` the two caret primitives (string arithmetic, Selection.modify)
- `src/client/reveal.ts` scroll-into-view arithmetic that replaced the suppressed default
- `src/client/app.ts` the single window listener and every DOM side effect
- `lib/` committed build products (`pnpm --filter dsh-better-keybindings build`)
