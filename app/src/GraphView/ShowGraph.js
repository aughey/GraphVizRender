//import { Graphviz } from 'graphviz-react';
import { useState, useEffect } from 'react';

const d3 = window.d3;

function Dot({dot}) {
  useEffect(() => {
    d3.select("#graph")
  .graphviz({ width: '100%', zoom: true, useWorker: true, fit: true, height: 500 })
    .renderDot(dot);

      console.log("rendered dot")
  }, [dot]);

  return (<div id="graph"></div>)
}

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

  function nodetable(n) {
    const inputs = n.Inputs;
    const outputs = n.Outputs;
    const portlength = Math.max(inputs.length, outputs.length);

    const preamble = `<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
      <TR><TD COLSPAN="2">${n.Kind}</TD></TR>`
      //<TR><TD>Inputs</TD><TD>Outputs</TD></TR>`

    const ports = [];
    for(let i = 0; i < portlength; i++) {
      ports.push(`<TR><TD PORT="i${i}">${inputs[i]?.Name || ''}</TD><TD PORT="o${i}">${outputs[i]?.Name || ''}</TD></TR>`);
    }

    const postamble = `</TABLE>`;
    return preamble + ports.join('') + postamble;
  }

  function portIndex(ports, name) {
    return ports.findIndex(p => p.Name === name);
  }

  function connection(c) {
    const from = graph.Nodes[c.From];
    const to = graph.Nodes[c.To];
    const srcindex = portIndex(from.Outputs, c.Output);
    const dstindex = portIndex(to.Inputs, c.Input);
    return `${id(c.From)}:o${srcindex} -> ${id(c.To)}:i${dstindex};`
  }

  var nodes = Object.keys(graph.Nodes).map(k => `${id(k)} [label=<${nodetable(graph.Nodes[k])}>];`);
  var connections = Object.keys(graph.Connections).map(k => connection(graph.Connections[k]));

  const dot = `
digraph{
  rankdir=LR;
  node [shape=plaintext];
  ${nodes.join("\n")}
  ${connections.join("\n")}
}`;

  const graphstring = doubleQuote ? JSON.stringify(graph, null, 2).replace(/"/g, '""') : JSON.stringify(graph, null, 2);

  return (
    <div style={{ width: '100%' }}>
      <h2>Rendering graph with {nodes.length} nodes</h2>

      {/* <Graphviz className="graphviz" options={{ width: '100%', zoom: true, useWorker: false }} dot={dot} /> */}
      <Dot dot={dot}/>
      String Graph: <input type="checkbox" checked={stripGraph} onChange={e => setStripGraph(e.target.checked)} />
      Double Quote: <input type="checkbox" checked={doubleQuote} onChange={e => setDoubleQuote(e.target.checked)} />
      {/* <pre>
        {graphstring}
      </pre> */}
    </div>
  )
}