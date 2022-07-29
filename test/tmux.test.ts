import {
  tmuxCommand,
  tmuxSessions,
  tmuxExecAttachSession,
  tmuxExecKillSession,
  tmuxNewSession,
  tmuxNewWindow,
  tmuxSplitWindow,
  tmuxKillPane,
  tmuxSelectPane,
  tmuxKillWindow,
  tmuxSelectWindow,
  tmuxMoveWindow,
  tmuxSendKeys,
} from "../src/tmux"

describe("tmuxSessions", () => {
  it("returns expected value", () => {
    expect(tmuxSessions()).toBe("tmux ls");
  })
})

describe("tmuxCommand", () => {
  it("returns joined string of commands when there are arguments", () => {
    expect(tmuxCommand(["1", "2", "3"])).toBe("tmux 1 \\; 2 \\; 3 \\;")
  })

  it("returns joined string of commands when there are arguments", () => {
    expect(tmuxCommand([])).toBe("tmux  \\;")
  })
})

describe("tmuxExecAttachSession", () => {
  it("returns expected value", () => {
    expect(tmuxExecAttachSession("dev")).toBe("tmux attach-session -t dev");
  })
})

describe("tmuxExecKillSession", () => {
  it("returns expected value", () => {
    expect(tmuxExecKillSession("dev")).toBe("tmux kill-session -t dev");
  })
})

describe("tmuxNewSession", () => {
  it("returns expected value", () => {
    expect(tmuxNewSession("dev")).toBe("new-session -s dev");
  })
})

describe("tmuxNewWindow", () => {
  it("returns expected value", () => {
    expect(tmuxNewWindow("dev")).toBe("new-window -n dev");
  })
})

describe("tmuxSplitWindow", () => {
  const startDirectory = "~/code"
  const percent = Math.round((Math.random() * 100))

  describe("with no additional arguments", () => {
    it("returns expected value", () => {
      expect(tmuxSplitWindow(startDirectory)).toBe("split-window -c ~/code -v");
    })
  })

  describe("with vertical type", () => {
    it("returns expected value without percent", () => {
      expect(tmuxSplitWindow(startDirectory, { type: "vertical" })).toBe("split-window -c ~/code -v");
    })

    it("returns expected value with percent", () => {
      expect(tmuxSplitWindow(startDirectory, { type: "vertical", percent: 25 })).toBe("split-window -c ~/code -v -l 25%");
    })
  })

  describe("with horizontal type", () => {
    it("returns expected value without percent", () => {
      expect(tmuxSplitWindow(startDirectory, { type: "horizontal" })).toBe("split-window -c ~/code -h");
    })

    it("returns expected value with percent", () => {
      expect(tmuxSplitWindow(startDirectory, { type: "horizontal", percent: 25 })).toBe("split-window -c ~/code -h -l 25%");
    })
  })
})

describe("tmuxKillPane", () => {
  it("returns expected value", () => {
    expect(tmuxKillPane(1)).toBe("kill-pane -t 1");
  })
})

describe("tmuxSelectPane", () => {
  it("returns expected value", () => {
    expect(tmuxSelectPane(1)).toBe("select-pane -t 1");
  })
})

describe("tmuxKillWindow", () => {
  it("returns expected value", () => {
    expect(tmuxKillWindow(1)).toBe("kill-window -t 1");
  })
})

describe("tmuxSelectWindow", () => {
  it("returns expected value", () => {
    expect(tmuxSelectWindow(1)).toBe("select-window -t 1");
  })
})

describe("tmuxMoveWindow", () => {
  it("returns expected value", () => {
    expect(tmuxMoveWindow(1, 2)).toBe("move-window -s 1 -t 2");
  })
})

describe("tmuxSendKeys", () => {
  it("returns expected value with Enter", () => {
    expect(tmuxSendKeys("test command", true)).toBe("send-keys 'test command' Enter");
  })

  it("returns expected value without Enter", () => {
    expect(tmuxSendKeys("test command", false)).toBe("send-keys 'test command'");
  })
})
