# jmux

`jmux` is a command line tool that automates building tmux sessions.

## Installation

< insert description >

## Configuration

By default, `jmux` will try to load the configuration defined in `~/.jmux.yml`. Alternatively, you can use a file in a different location using the `-f` flag.

Multiple session configurations can exist within `~/.jmux.yml`. Below is a guide for configuring `jmux`.

```yaml
env: # session name
  dir: ~/Desktop # session directory
  zeroIndex: <true|false> # start window numbering at 0 when true or 1 when false
  windows:
    - name: desktop # window name
      dir: ~/Desktop # optional directory -- if undefined, the session directory is used
      layout: <default|rows|columns> # optional layout -- if undefined, the default layout is used
      splitPercent: 35 # size of the sidebar (only used for the default layout)
      panes:
        - dir: ~/Desktop # optional directory -- if undefined, the window directory is used
          command: nvim # command that will be executed (nvim will be open)
        - dir: ~/Desktop
          placeholder: nvim # command that will not be executed (nvim won't be open)
```

## Layouts

### Default
< insert screenshot >

### Rows
< insert screenshot >

### Columns
< insert screenshot >

## Resources

[tmux manual](https://man7.org/linux/man-pages/man1/tmux.1.html)
