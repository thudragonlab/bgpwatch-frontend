<template>
  <div class="D3_graph-box" :id="d3Id"></div>
</template>

<script>
import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
export default {
  name: 'D3Graph',
  created() {},
  data() {
    return {}
  },
  props: {
    d3Id: {
      type: String,
      defalut: 'graph',
    },
    links: {
      type: Array,
      defalut: [],
    },
    nodes: {
      type: Array,
      defalut: [],
    },
    customerFunc: {
      type: Function,
      defalut: () => {},
    },
    moreAction: {
      type: Function,
      defalut: () => {},
    },
    options: {
      type: Object,
      default: () => {
        return {
          rankdir: 'LR',
          ranksep: 40, // 节点之间线距离
          nodesep: 10, // 节点之间距离
          marginx: 10,
        }
      },
    },
  },
  watch: {
    nodes(newV) {
      this.drawGraph(this.links, this.nodes, this.d3Id)
    },
  },
  mounted() {
    if (this.links && this.links.length !== 0 && this.nodes && this.nodes.length !== 0) {
      this.drawGraph(this.links, this.nodes, this.d3Id)
    }
  },
  methods: {
    drawGraph(linkArray, nodes, svgId) {
      // 获取所有节点
      const g = this.createInstanceofGraph()
      this.setNode(g, nodes)
      this.setEdge(g, linkArray)
      this.customerFunc(g, linkArray, nodes)
      this.renderGraph(g, svgId)
    },
    createInstanceofGraph() {
      return new dagreD3.graphlib.Graph().setGraph(this.options).setDefaultEdgeLabel(function () {
        return {}
      })
    },
    setNode(g, nodes) {
      var n_nodes = nodes.length
      for (var i = 0; i < n_nodes; i++) {
        g.setNode(nodes[i], {
          label: nodes[i],
          labelStyle: 'font-size: 10px',
          shape: 'circle',
          style: 'stroke: darkgray; fill: Gainsboro',
        })
      }
    },
    setEdge(g, linkArray) {
      var n_edges = linkArray.length
      for (var i = 0; i < n_edges; i++) {
        var edge = linkArray[i]
        g.setEdge(edge['from'], edge['to'], {
          style: 'stroke: rgb(20, 20, 20); fill: none;',
          arrowheadStyle: 'fill: rgb(20, 20, 20); stroke: rgb(20, 20, 20);',
          arrowhead: 'vee',
        })
      }
    },
    renderGraph(g, svgId) {
      var render = new dagreD3.render()
      var svg1 = d3.select(`#${svgId}`)
      if (svg1.selectAll('svg')._groups[0]?.length !== 0) {
        svg1.select('svg').remove() // remove previous nodes, clear the canvas
      }
      var svg = svg1.append('svg')
      var inner = svg.append('g')
      render(inner, g)
      this.moreAction(g, inner, svg, `${svgId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.D3_graph-box {
  width: 100%;
  // background: #000;
}
</style>
