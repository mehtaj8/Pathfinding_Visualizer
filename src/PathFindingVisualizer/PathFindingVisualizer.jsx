import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

import "./PathFindingVisualizer.css";

const START_NODE_ROW = 12;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 12;
const FINISH_NODE_COL = 59;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      dijkstraStart: false,
      mazeGenerated: false,
      reset: true,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  resetBoard() {
    if (!this.state.dijkstraStart) {
      var grid = getInitialGrid();
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 81; j++) {
          document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
          ).className = "node node-start";
          document.getElementById(
            `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
          ).className = "node node-finish";
          document.getElementById(`node-${i}-${j}`).className =
            "node node-reset";
        }
      }
      this.setState({ grid: grid, mazeGenerated: false, reset: true });
    }
  }

  handleMouseDown(row, col) {
    if (!this.state.dijkstraStart && this.state.reset) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    this.setState({ dijkstraStart: true });
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(
          `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node node-start";
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
        document.getElementById(
          `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node node-finish";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(
          `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node node-start";
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
        document.getElementById(
          `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node node-finish";
      }, 50 * i);
    }
    setTimeout(() => {
      this.setState({ dijkstraStart: false, reset: false });
    }, 50 * nodesInShortestPathOrder.length);
  }

  visualizeDijkstra() {
    if (this.state.reset) {
      this.setState({ reset: false });
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  makeMaze() {
    var newGrid = getInitialGrid();
    if (!this.state.dijkstraStart && this.state.reset) {
      for (let j = 0; j < 80; j++) {
        newGrid = getNewGridWithWallToggled(newGrid, 0, j);
        document.getElementById(`node-${0}-${j}`).className = "node node-wall";
      }
      for (let i = 0; i < 25; i++) {
        newGrid = getNewGridWithWallToggled(newGrid, i, 80);
        document.getElementById(`node-${i}-${80}`).className = "node node-wall";
      }
      for (let j = 79; j >= 0; j--) {
        newGrid = getNewGridWithWallToggled(newGrid, 24, j);
        document.getElementById(`node-${24}-${j}`).className = "node node-wall";
      }
      for (let i = 24; i >= 0; i--) {
        newGrid = getNewGridWithWallToggled(newGrid, i, 0);
        document.getElementById(`node-${i}-${80}`).className = "node node-wall";
      }
      newGrid = verticalMaze(newGrid);
      this.setState({ grid: newGrid, mazeGenerated: true });
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <body>Welcome To The Dijkstra's Pathfinding Visualizer</body>
        <h1>Legend:</h1>
        <p2>Click on the grid to draw walls!!!!</p2>
        <br></br>
        <p1>Please resize screen until scroll bar on right is gone.</p1>
        <p>
          <img
            alt="Unvisited"
            className="iconSize"
            src={require("./Node/images/Unvisited.png")}
          ></img>
          &nbsp; --> Unvisited State
          <br></br>
          <img alt="Visited" src={require("./Node/images/Visited.png")}></img>
          &nbsp; --> Visited State
          <br></br>
          <img alt="Path" src={require("./Node/images/Path.png")}></img>
          &nbsp; --> Path
          <br></br>
          <img
            alt="Start"
            className="iconSize"
            src={require("./Node/images/Start.png")}
          ></img>
          &nbsp; --> Start State
          <br></br>
          <img
            alt="Final"
            className="iconSize"
            src={require("./Node/images/Final.png")}
          ></img>
          &nbsp; --> Final State
          <br></br>
          <img
            alt="Wall"
            className="iconSize"
            src={require("./Node/images/Wall.png")}
          ></img>
          &nbsp; --> Wall
        </p>
        <div className="button-container2">
          <button href="#" className="button" onClick={() => this.makeMaze()}>
            Generate Maze
          </button>
        </div>
        <div className="button-container1">
          <button href="#" className="button" onClick={() => this.resetBoard()}>
            Reset Board
          </button>
        </div>
        <div className="button-container">
          <button
            href="#"
            className="button"
            onClick={() => this.visualizeDijkstra()}
          >
            Visualize Dijkstra's Algorithm
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < 81; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const verticalMaze = (grid) => {
  var newGrid = grid;
  for (let j = 2; j <= 78; j += 2) {
    for (let i = 1; i < 24; i++) {
      newGrid = getNewGridWithWallToggled(newGrid, i, j);
    }
    for (let k = 0; k < 3; k++) {
      var randomNum = Math.floor(Math.random() * 23) + 1;
      newGrid = getNewGridWithWallToggled(newGrid, randomNum, j);
    }
  }
  return newGrid;
};
