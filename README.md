# jmux

`jmux` is a command line tool that automates building tmux sessions.

## Installation

`npm install -g @joshddunn/jmux`

## Configuration

By default, `jmux` will try to load the configuration defined in `~/.jmux.yaml`. Alternatively, you can use a file in a different location using the `-f` flag.

Multiple session configurations can exist within `~/.jmux.yaml`. Below is a guide for configuring `jmux`.

```yaml
env: # session name
  dir: ~/Desktop # session directory
  zeroIndex: <true|false> # window numbering starts at 0 when true or 1 when false -- default false
  selectWindow: 1 # open specific window on start
  windows:
    - name: desktop # window name
      dir: ~/Desktop # optional directory -- if undefined, the session directory is used
      layout: <default|rows|columns> # optional layout -- if undefined, the default layout is used
      splitPercent: 35 # optional default layout sidebar size -- if undefined, 35 is used
      panes:
        - dir: ~/Desktop # optional directory -- if undefined, the window directory is used
          command: nvim # command that will be executed (nvim will be open)
        - dir: ~/Desktop
          placeholder: nvim # command that will not be executed (nvim won't be open)
```

## Usage

See `jmux help` for available commands and usage.

Add the following to your zshrc file to automatically evaluate the command with `mux`

```
mux() {
  if [[ "$1" == "ls" ]]; then
    jmux $@
  else
    eval $(jmux $@)
  fi
}
```

## Layouts

### Default

![Screen Shot 2022-07-20 at 2 22 07 AM](https://user-images.githubusercontent.com/7513070/179911297-b6754c16-0825-414c-94b2-facd207ae1ca.png)

### Rows

![Screen Shot 2022-07-20 at 2 22 21 AM](https://user-images.githubusercontent.com/7513070/179911303-8b191ba4-de6d-473f-bc94-0a585d5d1148.png)

### Columns

![Screen Shot 2022-07-20 at 2 22 31 AM](https://user-images.githubusercontent.com/7513070/179911314-28eb8ba7-ab9c-4053-88ef-3804048316e5.png)

## Resources

[tmux manual](https://man7.org/linux/man-pages/man1/tmux.1.html)
