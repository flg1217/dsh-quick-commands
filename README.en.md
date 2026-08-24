# dsh-quick-commands

> **User-defined slash commands — a quick-instruction booster for DeepSeek Harness**
> Configure your own slash commands and their insert prompts in the settings panel: typing `/name` in the composer inserts a chip (placeholder) that expands into the full prompt on send. Zero source changes, works out of the box.

## 1. What it is

**dsh-quick-commands** is an open-source plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) that turns frequently used instructions into one-shot slash commands:

| Capability | Description |
| --- | --- |
| **Custom slash commands** | Manage commands freely under Settings → Plugins → Quick Commands; each command = name + prompt |
| **Chip (placeholder) input** | Typing `/name` and picking it shows a chip placeholder in the composer (not a wall of text); it expands into the full prompt only on send |
| **Live updates** | Config changes take effect immediately (no restart); the settings panel stays in sync, and IME (pinyin) input is never interrupted |
| **Persistent** | Config is written to the dsh settings document and survives restarts |

The plugin follows official dsh extension mechanisms (profile bundle patch / settings namespace / client input-trigger source) and **does not modify any dsh source**, so it upgrades cleanly with dsh.

## 2. Core features

### 2.1 Custom slash commands

Manage the command list in Settings → Plugins → Quick Commands:

- **Name**: triggered as `/name` in the composer (e.g. `subagent` → `/subagent`)
- **Prompt**: the full text the command expands to on send

Example: a command `subagent` with prompt `使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:` — typing `/subagent` and sending delivers exactly that prompt.

### 2.2 Chip (placeholder) input

After picking a command, the composer shows a `/subagent` chip instead of pasting the whole text:

- Draft stays clean; you can keep typing around it
- The full prompt is expanded only at send time
- Copy / persistence projects to the `/subagent` text

### 2.3 Live updates & persistence

- Saves (400 ms debounced auto-save) appear in the `/` menu immediately — no restart needed
- Config is written to `settings.yaml` and survives restarts
- External edits (e.g. editing the settings file directly) are picked up by the panel automatically

## 3. Quick start

### Install

```bash
# 1. Clone
git clone https://github.com/flg1217/dsh-quick-commands.git
cd dsh-quick-commands

# 2. Install deps and build
pnpm install
pnpm build

# 3. Mount into a dsh profile (web profile shown)
dsh plugin --profile web add <repo dir>
# or manually add to the profile's package.json dependencies:
#   "@flg1217/dsh-quick-commands": "link:<absolute path>"
# then run pnpm install in that profile dir
```

### Usage

1. Open dsh web (e.g. `http://127.0.0.1:3080`)
2. Go to **Settings → Plugins → Quick Commands**
3. Add a command: name + prompt (e.g. `subagent` / `使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:`)
4. Type `/` in the composer, pick your command, press Enter

### Uninstall

```bash
dsh plugin --profile web remove dsh-quick-commands
# or remove the dependency from the profile package.json and run pnpm install
# optionally delete the `quick-commands` section from ~/.dsh/settings.yaml
```

## 4. Configuration

Configured in Settings → Plugins → Quick Commands, backed by the `quick-commands` settings namespace:

| Key | Type | Description |
| --- | --- | --- |
| `commands[].name` | string | Command name, triggered as `/name` in the composer |
| `commands[].prompt` | string | Full prompt the command expands to on send |

You can also edit `~/.dsh/settings.yaml` directly:

```yaml
quick-commands:
  commands:
    - name: subagent
      prompt: 使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:
```

## 5. Permissions & data

- **Config data**: reads/writes only the dsh settings document (`quick-commands` namespace); no other files
- **Network**: no network requests
- **Credentials**: never stores or reads any secrets
- **Local execution**: spawns no external processes

## 6. Troubleshooting

### My command is missing from the `/` menu

Make sure it was saved (the panel auto-saves after 400 ms; `settings.yaml` should show the `quick-commands` section). If it is saved but still missing, refresh the page (the browser may cache the old bundle).

### `no serializer for reference source` on send

Usually a stale browser bundle. Hard-refresh (e.g. Ctrl+Shift+R) and retry.

### Config lost

Config persists in the `quick-commands` section of `~/.dsh/settings.yaml`. If you deleted or hand-edited it, restart the dsh service.

## 7. Development

```bash
pnpm install
pnpm build     # tsc for the server half + copy the client bundle
pnpm typecheck # type check
pnpm test      # run tests (vitest)
```

Layout:

```
src/
├─ index.ts          # Server half: settings namespace registration
├─ settings.ts       # Schema + defaults
└─ client/index.js   # Browser half: input-trigger source + settings panel card
```

## 8. License & security

- **License**: MIT (see [LICENSE](LICENSE))
- **Security**: do not file security issues publicly; contact the maintainers via the repository page (see [SECURITY.md](SECURITY.md))
