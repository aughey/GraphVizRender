import { Graphviz } from 'graphviz-react';
import { useState } from 'react';

export function ShowGraph({ graph }) {
  const [stripGraph, setStripGraph] = useState(false);
  const [doubleQuote, setDoubleQuote] = useState(false);

  if (!graph) return null;

  if (stripGraph) {
    graph = {
      ...graph,
      Nodes: graph.Nodes.map(n => ({ Id: n.Id, Kind: n.Kind, Parameters: n.Parameters }))
    }
  }

  function id(i) {
    return "ID" + i.replace(/-/g, '');
  }

  var nodes = Object.keys(graph.Nodes).map(k => `${id(k)} [label="${graph.Nodes[k].Kind}"];`);
  var connections = Object.keys(graph.Connections).map(k => `${id(graph.Connections[k].From)} -> ${id(graph.Connections[k].To)};`);

  const dot = `
digraph{
  rankdir=LR;
  ${nodes.join("\n")}
  ${connections.join("\n")}
}`;

  const graphstring = doubleQuote ? JSON.stringify(graph, null, 2).replace(/"/g, '""') : JSON.stringify(graph, null, 2);

  return (
    <div style={{ width: '100%' }}>
      <Graphviz className="graphviz" width="100%" dot={dot} />
      String Graph: <input type="checkbox" checked={stripGraph} onChange={e => setStripGraph(e.target.checked)} />
      Double Quote: <input type="checkbox" checked={doubleQuote} onChange={e => setDoubleQuote(e.target.checked)} />
      <pre>
        {graphstring}
      </pre>
    </div>
  )
}