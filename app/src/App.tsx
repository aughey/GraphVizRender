import React, { useEffect } from 'react';
import './App.css';
import './index.scss';
import { ShowGraph } from './GraphView/ShowGraph';
import CommandPalette from 'react-command-palette';
import { Command } from 'react-command-palette';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { top_commands, ExtensionCommand } from './Commands';
import {
  ActionId,
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl,
  NO_GROUP
} from "kbar";
import { IVECommandBar } from './IVECommandBar';

interface Port {
  Kind: string;
  Name: string;
}
interface Node {
  Kind: string;
  Inputs: Port[];
  Outputs: Port[];
}
interface Connection {
  From: string;
  Output: string;
  To: string;
  Input: string;
}
interface NodeMap {
  [key: string]: Node;
}
interface ConnectionMap {
  [key: string]: Connection;
}
interface Graph {
  Nodes: NodeMap,
  Connections: ConnectionMap
}

function GraphApp() {
  const [graph, setGraph] = React.useState<Graph | null>(null);

  const createGraph = (data: any) => {
    console.log(data);

    const Nodes: NodeMap = {};
    for (let n of data.Nodes) {
      Nodes[n.Id] = {
        Kind: n.Name,
        Inputs: n.Inputs,
        Outputs: n.Outputs
      };
    }
    const Connections: ConnectionMap = {};
    let connectionid = 1;
    for (let c of data.Connections) {
      Connections[connectionid++] = {
        From: c.from,
        Output: c.outputname,
        To: c.to,
        Input: c.inputname
      };
    }

    const graph = {
      Nodes: Nodes,
      Connections: Connections
    }
    setGraph(graph);
  }

  React.useEffect(() => {
    fetch('/newsies.ive')
      .then((response) => response.json())
      .then((data) => createGraph(data));
  }, []);

  if (!graph) {
    return null;
  }

  const commands: any[] = [
    {
      name: 'Add Node',
      command: () => {
        console.log('Add Node');
      }
    }
  ];

  return (
    <div>
      <ShowGraph graph={graph} />
    </div>
  )
}

function App() {
  return (
    <div>
      <IVECommandBar />
      <GraphApp />
    </div>
  );
}

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};



function AppKBAR() {
  const actions = [
    {
      id: "blog",
      name: "Create New Node...",
      subtitle: "This is a subtitle",
      shortcut: ["n"],
      perform: () => { toast("Creating new node") },
    }
  ]

  return (
    <div>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner>
            <KBarAnimator style={animatorStyle}>
              <KBarSearch style={searchStyle} />
              <RenderResults />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        <GraphApp />
      </KBarProvider>
      <ToastContainer />
    </div>
  );

}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId!}
          />
        )
      }
    />
  );
}

function IVECommandPaletteZZ() {
  const [commands, setCommands] = React.useState<ExtensionCommand[]>(top_commands);
  const [open, setOpen] = React.useState<boolean>(true);

  const wrap = (command: ExtensionCommand, index: number): Command => {
    return {
      id: index,
      color: 'white',
      name: command.name,
      command: () => {
        console.log("In wrapped command");
        const result = command.command();
        if (!result) {

        }
        setTimeout(() => setOpen(false), 2000);
      }
    }
  };

  const wrapped_commands = commands.map(wrap);

  return (
    <CommandPalette onAfterOpen={() => setOpen(true)} open={open} commands={wrapped_commands} />
  )
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "var(--a1)" : "transparent",
          borderLeft: `2px solid ${active ? "var(--foreground)" : "transparent"
            }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

export default App;
