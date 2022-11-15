import React from 'react';
import './App.css';
import { ShowGraph } from './GraphView/ShowGraph';

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

function App() {
  const [graph,setGraph] = React.useState<Graph | null>(null);

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

  return (
    <div>
      <ShowGraph graph={graph} />
    </div>
  )
}

export default App;
