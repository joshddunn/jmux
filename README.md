# jmux

`jmux` is a command line tool for building tmux sessions.

## Installation

`npm install -g @joshddunn/jmux`

## Configuration

The default configuration filepath is `~/.jmux.yaml`.

```yaml
# [required] session name
env:
  # [optional] session directory
  # default: home directory
  dir: string

  # [optional] window numbering starts at 0 (true) or 1 (false)
  # default: false
  zeroIndex: boolean

  # [optional] selected window after starting session
  # default: 1
  selectWindow: number

  windows:
    # [required] window name
    - name: string

      # [optional] window directory
      # default: session directory
      dir: string

      # [optional] how panes will be organized within the window
      # default: default
      layout: <default|rows|columns>

      # [optional] sidebar size when using default layout
      # default: 35
      splitPercent: number

      panes:
        # [optional] pane directory
        # default: window directory
        - dir: string

          # [optional] either run a command or add a placeholder
          command: string
          placeholder: string
```

## Usage

See `jmux help` for available commands and usage.

Add the following to your zshrc file to automatically evaluate the command with `mux`

```
mux() {
  eval $(jmux $@ -e)
}
```

## Resources

[tmux manual](https://man7.org/linux/man-pages/man1/tmux.1.html)
