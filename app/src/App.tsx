import React from 'react';
import './App.css';
import { ShowGraph } from './GraphView/ShowGraph';

function App() {
  const [data, setData] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/newsies.ive')
      .then((response) => response.json())
      .then((data) => setData(data));
  },[]);

  if(!data) {
    return null;
  }

  const graph = {
    Nodes:{},
    Connections: {}
  }

  return (
    <div>
      <ShowGraph graph={graph} />
    </div>
  )
}

export default App;
