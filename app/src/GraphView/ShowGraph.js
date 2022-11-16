//import { Graphviz } from 'graphviz-react';
import { useEffect, useRef } from 'react';

const d3 = window.d3;

function Dot({ dot }) {
  const ref = useRef(null);

  const startApp = () => {
    const graph = d3.select(ref.current).select("svg");
    var nodes = graph.selectAll(".node");
    var edges = graph.selectAll(".edge");

    const DeSelect = () => {
      edges.select('path').classed("selectedin",false).classed("selectedout", false);
    }

    // click outside of nodes
    graph.on("click", function (e) {
      var event = e;
      event.preventDefault();
      event.stopPropagation();
      console.log('document click');
      //   unSelectEdge();
    });

    // keyup outside of nodes
    // d3.select(document).on("keyup", function (e) {
    //   var event = e;
    //   event.preventDefault();
    //   console.log('document keyup', event);
    //   // if (event.keyCode == 27) {
    //   //     graphviz.removeDrawnEdge();
    //   //     unSelectEdge();
    //   // }
    //   // if (event.keyCode == 46) {
    //   //     deleteSelectedEdge();
    //   //     graphviz.removeDrawnEdge();
    //   //     graphviz
    //   //         .renderDot(dotSrc, startApp);
    //   // }
    //   // isDrawing = false;
    // });

    // move
    d3.select(document).on("mousemove", function (e) {
      //  console.log(e)
      // var event = e;
      // event.preventDefault();
      // event.stopPropagation();
      // console.log('document mousemove');
      // var graph0 = graph.selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      // var [x0, y0] = d3.pointer(e);
      // console.log('x0, y0', x0, y0);
      // var shortening = 2; // avoid mouse pointing on edge
      // if (isDrawing) {
      //     graphviz
      //         .moveDrawnEdgeEndPoint(x0, y0,  {shortening: shortening})
      // }
    });

    // click and mousedown on nodes
    nodes.on("click", function (e) {
      var event = e;
      event.preventDefault();

      //const id = d3.select(this).attr("id");
      const title = d3.select(this).select("title").text();

      DeSelect();
      edges.selectAll(`.EDGEFROM${title} path`).attr('class', 'selectedout');
      edges.selectAll(`.EDGETO${title} path`).attr('class', 'selectedin');

      //   unSelectEdge();
    });

    // double-click on nodes
    nodes.on("dblclick", function (e) {
      var event = e;
      event.preventDefault();
      event.stopPropagation();
      console.log('node dblclick');
      // unSelectEdge();
      // if (isDrawing) {
      //     var endNode = d3.select(this);
      //     var startNodeName = startNode.selectWithoutDataPropagation("title").text();
      //     var endNodeName = endNode.selectWithoutDataPropagation("title").text();
      //     graphviz
      //         .insertDrawnEdge(startNodeName + '->' + endNodeName);
      //     var dotSrcLines = dotSrc.split('\n');
      //     var newEdgeString = startNodeName + ' -> ' + endNodeName + ' [color="#800080"; fillcolor="orange"; penwidth="1"]';
      //     dotSrcLines.splice(-1, 0, newEdgeString);
      //     dotSrc = dotSrcLines.join('\n');
      //     graphviz
      //         .renderDot(dotSrc, startApp);
      // }
      // isDrawing = false;
    });

    // right-click on nodes
    nodes.on("contextmenu", function (e) {
      var event = e;
      event.preventDefault();
      event.stopPropagation();
      console.log('node contextmenu');
      // unSelectEdge();
      // startNode = d3.select(this);
      // var graph0 = graph.selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      // var [x0, y0] = d3.pointer(graph0.node());
      // graphviz
      //     .drawEdge(x0, y0, x0, y0, {fillcolor: "orange", color: "#800080"})
      // isDrawing = true;
    });

    // click and mousedown on edges
    edges.on("click mousedown", function (e) {
      var event = e;
      event.preventDefault();
      event.stopPropagation();
      console.log('edge node click or mousedown');
      //   selectEdge(d3.select(this));

    });

    // right-click outside of nodes
    d3.select(document).on("contextmenu", function (e) {
      var event = e;
      event.preventDefault();
      event.stopPropagation();
      console.log('document contextmenu');
      //  unSelectEdge();
    });

    console.log("Started app");
  }

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    d3.select(ref.current)
      .graphviz({ width: '100%', zoom: true, useWorker: false, fit: true, height: '100%' })
      .renderDot(dot, startApp);

    console.log("rendered dot")
  }, [dot]);

  return (<div ref={ref}></div>)
}

export function ShowGraph({ graph }) {

  if (!graph) return null;

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
    for (let i = 0; i < portlength; i++) {
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
    const fromid = id(c.From);
    const toid = id(c.To);
    return `${fromid}:o${srcindex} -> ${toid}:i${dstindex} [class="EDGEFROM${fromid} EDGETO${toid}"];`
  }

  var nodes = Object.keys(graph.Nodes).map(k => `${id(k)} [id="${k}" label=<${nodetable(graph.Nodes[k])}>];`);
  var connections = Object.keys(graph.Connections).map(k => connection(graph.Connections[k]));

  const dot = `
digraph{
  rankdir=LR;
  node [shape=plaintext];
  ${nodes.join("\n")}
  ${connections.join("\n")}
}`;


  return (
    <div className="graphcontainer">
      <Dot dot={dot} />
    </div>
  )
}