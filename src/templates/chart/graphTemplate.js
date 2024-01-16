import {
  Option
} from '@/templates/chart'
const echarts = require('echarts')
import {
  middleFontSize,
  subTitleFontSize
} from '@/styles/font.scss'
export const arrowIcon =
  'path://M470.016 976.896q-44.032 0-59.392-20.48t-15.36-65.536q0-20.48-0.512-64.512t-1.024-93.696-1.536-96.768-1.024-74.752q0-39.936-7.68-62.464t-35.328-21.504q-20.48 0-48.64-1.024t-49.664 0q-35.84 0-45.568-19.456t13.824-50.176q24.576-30.72 57.344-72.704t67.584-86.016 68.096-87.04 58.88-75.776q23.552-29.696 45.568-30.72t46.592 26.624q24.576 29.696 56.832 69.632t67.072 82.432 68.608 83.968 60.416 73.216q29.696 35.84 23.04 58.88t-43.52 23.04q-11.264 0-25.088 0.512t-29.184 1.024-30.208 1.024-27.136 0.512q-25.6 1.024-32.256 16.384t-5.632 41.984q0 29.696 0.512 77.824t1.024 100.352 1.536 101.376 1.024 79.872q0 13.312-2.048 27.648t-9.728 26.112-21.504 19.968-36.352 8.192q-27.648 0-52.736 0.512t-56.832 1.536z'
// export const exportColor = '#349ca6'
// export const importColor = '#ee8b76'
export const exportColor = '#D65ACC'
export const importColor = '#5E8FD1'
export const providerColor = '#349ca6'
export const peerColor = '#ee8b76'
export const customerColor = '#D9CB71'
export const unknownColor = '#aeaeae'
export const softPeerColor = '#F03600'
export const customerDeepColor = '#0191FF'
export const customerSoftColor = '#F03600'
export const centerColor = '#7E5ECA'
export const topoStartColor = '#4F6DE3'
export const topoAcrossColor = '#8249B8'
export const topoEndColor = '#BF3483'
export const topoLineCommonColor = '#dedede'
export const topoCilckedLineColor = '#ff990a'



export const EXPROT_IMPORT_ROW_NUMBER = 0
const ellipseIcon =
  'path://M44.521739 512a734.608696 467.478261 0 1 0 1469.217391 0 734.608696 467.478261 0 1 0-1469.217391 0Z'
const rectIcon = 'path://M112 272h800v480H112z'
export class GraphOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getLegend() {
    return {
      data: ['Provider', 'Peer', 'Customer', 'Unknown', {
        name: 'Export',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#fff'
              },
              {
                offset: 0.44,
                color: '#fff'
              },
              {
                offset: 0.45,
                color: exportColor
              },
              {
                offset: 0.55,
                color: exportColor
              },
              {
                offset: 0.56,
                color: '#fff'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ],
            global: false // 缺省为 false
          }
        },
      }, {
        name: 'Import',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#fff'
              },
              {
                offset: 0.44,
                color: '#fff'
              },
              {
                offset: 0.45,
                color: importColor
              },
              {
                offset: 0.55,
                color: importColor
              },
              {
                offset: 0.56,
                color: '#fff'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ],
            global: false // 缺省为 false
          }
        },
      }],
      orient: 'vertical',
      right: 0,
    }
  }

  getToolTip() {
    return {
      formatter: function ({
        data
      }) {
        const {
          name,
          asName,
          org,
          country,
        } = data
        if (name) {
          return `
          <div>
          <div style="display: flex;justify-content: space-between;"><span>AS Name:</span> <span>${asName}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Org:</span> <span>${org}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Country:</span> <span>${country}</span></div>
          </div>
          `
        }
      },
    }
  }
  getSeries() {
    return [{
      name: 'ASN Relation',
      type: 'graph',
      symbol: ellipseIcon,
      symbolKeepAspect: true,
      symbolSize: [70, 70],
      symbolOffset: [0, 0],
      // ['-10%', '10%'],
      // draggable: true,
      nodeScaleRatio: 0,
      center: [0, 0],
      categories: [{
          name: 'Peer',
          itemStyle: {
            color: peerColor,
          },
        },
        {
          name: 'Provider',
          itemStyle: {
            color: providerColor,
          },
        },
        {
          name: 'Customer',
          itemStyle: {
            color: customerColor,
          },
        },
        {
          name: 'Unknown',
          itemStyle: {
            color: unknownColor,
          },
        },

        {
          name: 'Export',
          itemStyle: {
            color: exportColor,
          },
        },
        {
          name: 'Import',
          itemStyle: {
            color: importColor,
          },
        },
      ],
      zoom: 1,
      // roam: false,
      label: {
        show: true,
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        formatter: function ({
          data: {
            name
          }
        }) {
          return name
        },
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 20,
      edgeLabel: {
        show: true,
        // width:150,
        padding: [0, 0, -15, 0],
        formatter: ({
          data
        }) => {
          let returnArray = []
          if (data.IE.includes('Export')) {
            if (data.index >= 0 && data.index < 8) {
              returnArray.push(`{right|${data.valueArray[0]}}`, )
            } else if (data.index >= 8 && data.index < 16) {
              returnArray.push(`{lr|${data.valueArray[0]}}`, )
            } else if (data.index >= 16 && data.index < 24) {
              returnArray.push(`{lr|${data.valueArray[0]}}`, )
            } else if (data.index >= 24 && data.index < 32) {
              returnArray.push(`{right|${data.valueArray[0]}}`, )
            }
          }
          if (data.IE.includes('Import')) {
            if (data.index >= 0 && data.index < 8) {
              returnArray.push(`{lr|${data.valueArray[1]}}`, )
            } else if (data.index >= 8 && data.index < 16) {
              returnArray.push(`{right|${data.valueArray[1]}}`, )
            } else if (data.index >= 16 && data.index < 24) {
              returnArray.push(`{right|${data.valueArray[1]}}`, )
            } else if (data.index >= 24 && data.index < 32) {
              returnArray.push(`{lr|${data.valueArray[1]}}`, )
            }

          }
          return returnArray.join('\n')
        },
      },
      emphasis: {
        edgeLabel: {
          formatter: ({
            data
          }) => {
            let returnArray = []
            let source = data.source
            let target = data.target
            if (data.IE.includes('Export')) {
              if (data.index >= 0 && data.index < 8) {
                returnArray.push(`{right|${source} -> ${target}}`, )
              } else if (data.index >= 8 && data.index < 16) {
                returnArray.push(`{lr|${target} <- ${source}}`, )
              } else if (data.index >= 16 && data.index < 24) {
                returnArray.push(`{lr|${target} <- ${source}}`, )
              } else if (data.index >= 24 && data.index < 32) {
                returnArray.push(`{right|${source} -> ${target}}`, )
              }

            }
            if (data.isBoth) {
              source = data.target
              target = data.source
            }
            if (data.IE.includes('Import')) {
              if (data.index >= 0 && data.index < 8) {
                returnArray.push(`{lr|${target} <- ${source}}`, )
              } else if (data.index >= 8 && data.index < 16) {
                returnArray.push(`{right|${source} -> ${target}}`, )
              } else if (data.index >= 16 && data.index < 24) {
                returnArray.push(`{right|${source} -> ${target}}`, )
              } else if (data.index >= 24 && data.index < 32) {
                returnArray.push(`{lr|${target} <- ${source}}`, )
              }
            }
            return returnArray.join('\n')
          },
          rich: {
            left: {
              align: 'center',
              padding: [0, 120, 2, 0],
            },
            right: {
              align: 'center',
              padding: [-20, 0, 0, 120],
            },
            rl: {
              align: 'center',
              padding: [0, 0, 5, 120],
            },
            lr: {
              align: 'center',
              padding: [-20, 120, 0, 0],
            }
          }
        }
      },
      lineStyle: {
        opacity: 1,
        width: 1,
        curveness: -0.2,
      },
    }, ]
  }
}

export class GraphTopoOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }
  getSeries() {
    return [{
      name: 'Test',
      type: 'graph',
      symbolSize: 10,
      layout: 'none',
      zoom: 2,
      center: [0, -100],
      // roam: 'scale',
      roam: 'move',
      // roam: false,
      label: {
        position: 'top',
        show: true,
        color: '#000',
        fontWeight: 'bold',
        formatter: function ({
          data: {
            name
          }
        }) {
          return name.split('|')[0]
        },
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 5,
      lineStyle: {
        opacity: 1,
        width: 1,
        curveness: 0.2,
        color: topoLineCommonColor,
      },
    }, ]
  }
}

export function setDataInGraphData(peerMap, SourceDataList, maxLength, graphDataObj) {
  // 每个点x坐标偏移量
  const xOffset = 50
  // 每个点y坐标偏移量
  const yOffset = 35
  // 同一行点间距
  const xGap = 50
  // 同一纵行间距
  const yGap = 10
  const firstPoint = graphDataObj.data[0]
  const inputAsn = `${firstPoint.name}`
  // 每一个象限允许的最大点的数量
  const length = maxLength
  // Same点起始高度
  // const SamePointOriginHeightIndex = SourceDataList.length
  // 同一象限一行或者一列点的个数
  const pointNumOfSameDimension = 4
  let distinctList = Array.from(new Set(SourceDataList.map(name => peerMap[name].value)))
  // if (type === 'Same') {
  //   distinctList = Array.from(new Set(SourceDataList.map(name => peerMap[name][0] + peerMap[name][1])))
  // } else {
  // distinctList = Array.from(new Set(SourceDataList.map(name => peerMap[name])))
  // }

  // 其中value最大的点的列表
  let realMaxList = []

  const maxAsn = Math.max(...distinctList)

  const maxBoldValue = 3000,
    minBoldValue = 1000

  if (maxAsn >= maxBoldValue) {
    realMaxList = distinctList
      .filter(max => max > maxBoldValue)
      .sort((a, b) => b - a)
    // .slice(0, 3)
  } else if (maxAsn < maxBoldValue && maxAsn > minBoldValue) {
    realMaxList = distinctList
      .filter(max => max > minBoldValue)
      .sort((a, b) => b - a)
    // .slice(0, 3)
  }
  let yIndex = 0
  let xIndex = 0
  SourceDataList.forEach((asn, index) => {
    let source,
      target,
      x,
      y,
      name = `${asn}`,
      value,
      color,
      width,
      symbolSize,
      itemStyle = {},
      curveness = 0,
      edgeSymbol = ['none', 'arrow']

    // 同一行或者同一列下标最小值 = 允许的个数 - 相同点的个数（比如10个点，我允许4个点，当下标到10-6时，开始设置同行的坐标）
    const sameDimensionlimit = length - pointNumOfSameDimension

    // if (type === 'Peer' || type === 'Provider') {
    value = peerMap[asn].value
    if (realMaxList.includes(value)) {
      width = Math.log(value) - 5
      symbolSize = Math.log(value) + 5
    } else {
      width = 0.5
      symbolSize = 8
    }
    const sourceIndex = index
    const quadrant = Math.floor(sourceIndex / length)
    index = sourceIndex % length
    if (quadrant === 0) {
      if (index === 0) {
        yIndex = -0.1
        xIndex = 0
      }
      if (index === 0) {
        xIndex += length / 2 + 1
      }
      if (index === length / 2) {
        xIndex -= 1
      }
      if (index > length / 2) {
        xIndex -= 1
      } else {
        yIndex -= 1
      }
      y = yIndex * yOffset
      x = xIndex * xOffset
    } else if (quadrant === 1) {
      if (index === 0) {
        yIndex = -0.1
        xIndex = 0
      }
      if (index === 0) {
        yIndex -= length / 2 + 1
      }
      if (index === length / 2) {
        yIndex += 1
      }
      if (index > length / 2) {
        yIndex += 1
      } else {
        xIndex -= 1
      }
      y = yIndex * yOffset
      x = xIndex * xOffset

    } else if (quadrant === 2) {
      if (index === 0) {
        yIndex = -0.1
        xIndex = 0
      }
      if (index === 0) {
        xIndex -= length / 2 + 1
      }

      if (index === length / 2) {
        xIndex += 1
      }

      if (index > length / 2) {
        xIndex += 1
      } else {
        yIndex += 1
      }
      y = yIndex * yOffset
      x = xIndex * xOffset
    } else if (quadrant === 3) {
      if (index === 0) {
        yIndex = -0.1
        xIndex = 0
      }
      if (index === 0) {
        yIndex += length / 2 + 1
      }

      if (index === length / 2) {
        yIndex -= 1
      }

      if (index > length / 2) {
        yIndex -= 1
      } else {
        xIndex += 1
      }
      y = yIndex * yOffset
      x = xIndex * xOffset
      // console.log(index, x, y)
    }

    if (peerMap[asn].IE[0] === 'Export') {
      target = name
      source = inputAsn
      color = exportColor
      // curveness *= 1
    } else if (peerMap[asn].IE[1] === 'Import') {
      // name = `${asn}`
      target = inputAsn
      source = name
      color = importColor
      // curveness *= -1
    }

    if (peerMap[asn].isBoth) {
      edgeSymbol = ['arrow', 'arrow']
      color = {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: Array(10).fill(0).map((item, index) => {
          const myIndex = index + 1
          return {
            offset: 0.1 * myIndex,
            color: myIndex % 2 === 0 ? importColor : exportColor // 0% 处的颜色
          }
        }),
        global: false // 缺省为 false
      }
    }

    // console.log('name', name)
    graphDataObj.data.push({
      name,
      x,
      y,
      category: peerMap[asn].type,
      asName: peerMap[asn].name,
      org: peerMap[asn].org,
      country: peerMap[asn].country,
      itemStyle,
    })

    graphDataObj.links.push({
      source,
      target,
      value,
      valueArray: peerMap[asn].valueArray,
      isBoth: peerMap[asn].isBoth,
      IE: peerMap[asn].IE,
      index: sourceIndex,
      symbolSize,
      symbol: edgeSymbol,
      lineStyle: {
        cap: 'round',
        width,
        color,
        curveness,
      },
      emphasis: {
        label: {
          width: peerMap[asn].isBoth ? 230 : 200,
        }
      },
      label: {
        width: peerMap[asn].isBoth ? 150 : 200,
        rich: {
          left: {
            align: 'center',
            fontSize: realMaxList.includes(value) ? 15 : 12,
            padding: [0, 100, 5, 0],
          },
          right: {
            align: 'center',
            fontSize: realMaxList.includes(value) ? 15 : 12,
            padding: [-20, 0, 0, 100],
          },
          rl: {
            align: 'center',
            fontSize: realMaxList.includes(value) ? 15 : 12,
            padding: [0, 0, 5, 100],
          },
          lr: {
            align: 'center',
            fontSize: realMaxList.includes(value) ? 15 : 12,
            padding: [-20, 100, 0, 0],
          }
        }
      }
    })
  })
}

export function highlightTest({
  data
}, chart) {
  const {
    series
  } = chart.getOption()
  const {
    data: seriesData,
    links
  } = series[0]
  let hoverName = data.name
  let hoverLink = undefined
  let hoverLinkArray = []
  if (data.source) {
    hoverLink = {
      source: data.source,
      target: data.target,
    }
  }
  if (hoverName) {
    if (hoverName.split('|').length === 2) {
      hoverName = hoverName.split('|')[0]
    }

    hoverLinkArray = links.map(item => {
      if (item.source === hoverName || item.target === hoverName) {
        const targetTierName = item.target + '|tier1'
        const superiorLinks = links.filter(link => link.target === targetTierName)

        if (superiorLinks.length === 1) {
          const superiorLink = superiorLinks[0]
          superiorLink.lineStyle = Object.assign({
              color: importColor,
            },
            superiorLink.lineStyle
          )
        }

        item.lineStyle = Object.assign({
            color: importColor,
          },
          item.lineStyle
        )
      }
      return item
    })
    chart.setOption({
      series: [{
        name: 'Test',
        links: hoverLinkArray,
      }, ],
    })
  }
  if (hoverLink) {
    const sourceTier1Name = hoverLink.source + '|tier1'
    const targetTier1Name = hoverLink.target + '|tier1'
    const clickLines = links.filter(
      link =>
      (link.target === hoverLink.target && link.source === hoverLink.source) ||
      (link.source === hoverLink.target && link.target === targetTier1Name)
    )
    if (clickLines.length !== 0) {
      clickLines.forEach(clickLine => {
        clickLine.lineStyle.color = topoCilckedLineColor
      })
    }
    if (sourceTier1Name === hoverLink.target) {
      const oneLink = links.filter(link => link.target === hoverLink.source)
      if (oneLink.length === 1) {
        oneLink[0].lineStyle.color = topoCilckedLineColor
        hoverLink.source = oneLink[0].source
      }
    }
    const haverDataArray = seriesData.map(item => {
      if (
        item.name === hoverLink.source ||
        item.name === hoverLink.target ||
        item.name === sourceTier1Name ||
        item.name === targetTier1Name
      ) {
        item.itemStyle = {
          color: importColor,
        }
      }
      return item
    })
    chart.setOption({
      series: [{
        name: 'Test',
        data: haverDataArray,
        links,
      }, ],
    })
  }
}
export function mouseoutTest(param, chart, {
  series
}) {
  const {
    series: chartSeries
  } = chart.getOption()
  const {
    data: seriesData,
    links
  } = chartSeries[0]
  const filterData = seriesData.filter((item, index) => {
    if (!item.itemStyle) {
      return false
    }
    if (item.itemStyle.color && !series[0].data[index].itemStyle) {
      return true
    }
    return item.itemStyle.color !== series[0].data[index].itemStyle.color
  })

  const filterLink = links.filter((link, index) => {
    if (!link.lineStyle) {
      return false
    }
    if (link.lineStyle.color && !series[0].links[index].lineStyle) {
      return true
    }
    return link.lineStyle.color !== series[0].links[index].lineStyle.color
  })
  delete series[0].zoom
  if (filterData.length || filterLink.length) {
    chart.setOption({
      series,
    })
  }
}

export class ResilienceGraphOption extends Option {

  constructor(title,maxCone, addZoomfunc, reduceZoomfunc) {
    super()
    this.title = title
    this.maxCone = maxCone
    this.addZoomfunc = addZoomfunc
    this.reduceZoomfunc = reduceZoomfunc

  }
  getTitle() {
    return {
      left: 'center',
      text: this.title,
      textStyle: {
        color: '#000',
        fontSize: subTitleFontSize
      }
    }
  }

  getLegend() {
    return {
      data: ['P2P', 'P2C', 'Origin'],
      left: 0,
      selectedMode: false,
      itemHeight: 1,
    }
  }
  getToolTip() {
    return [{
      enterable: true,
      position: function (point, params, dom, rect, size) {
        // 固定在顶部
        return [point[0] - size.contentSize[0], point[1]];
      },
      hideDelay: 100,
      formatter: function ({
        data,
        marker
      }) {
        if (data.name) {
          return `<div style="font-weight:bold">${data.name}(${data.asName})</div>
          <div style="width:100%;display:flex;justify-content:space-between;">
          <span >${marker}CONE: </span>
          <span >${data.value}</span>
          </div>
          <a target="_blank" href="/#/dashBoard?asn=${data.name}">Go to Dashboard</a>
          `

        } else {
          return `${data.source} > ${data.target} <br/> ${data.type}`
        }

      },
    }]

  }
  getVisualMap() {
    return {
      bottom: 50,
      left: 50,
      itemSymbol: 'circle',
      max: this.maxCone,
      min: 0,
      calculable: false,
      text: [`>${this.maxCone}`, '1'],
      inRange: {
        color: ['#0092CC', '#A1CC01', '#E0A200', '#E00C00'],
        // ,customerSoftColor, '#A8D9FF', '#F9CBBD', customerDeepColor
        symbolSize: [10, 20],
      }
    }
  }
  getToolBox() {
    return {
      feature: {
        myButtonAZ: {
          show: true, // 是否显示按钮
          title: 'add zoom', // 鼠标悬停时显示的文字
          // icon: 'path://M395.731085 571.196755l10.18176 10.18176q4.072704 4.072704 8.145408 7.63632t8.145408 7.63632l12.218112 12.218112q20.363521 20.363521 16.290817 35.636161t-25.454401 35.636161q-9.163584 10.18176-30.036193 31.054369t-44.799745 45.308833-46.32701 46.836098-34.617985 35.636161q-18.327169 18.327169-25.454401 32.072545t6.109056 26.981665q9.163584 9.163584 23.418049 24.436225t24.436225 25.454401q17.308993 17.308993 12.7272 30.545281t-30.036193 15.27264q-26.472577 3.054528-59.05421 7.127232t-67.199618 7.63632-67.708706 7.63632-60.581474 7.127232q-26.472577 3.054528-36.654337-6.618144t-8.145408-34.108897q2.036352-25.454401 5.599968-57.017858t7.63632-64.654178 7.63632-65.672354 6.618144-60.072386q3.054528-29.527105 16.799905-37.672513t31.054369 9.163584q10.18176 10.18176 26.472577 24.945313t27.490753 25.963489 21.381697 7.127232 23.418049-16.290817q13.236288-13.236288 36.145249-36.654337t47.854274-48.363362 48.363362-48.87245 37.672513-38.181601q6.109056-6.109056 13.745376-11.709024t16.799905-7.63632 18.836257 1.018176 20.872609 13.236288zM910.928158 58.036034q26.472577-3.054528 36.654337 6.618144t8.145408 34.108897q-2.036352 25.454401-5.599968 57.017858t-7.63632 64.654178-7.63632 66.181442-6.618144 60.581474q-3.054528 29.527105-16.799905 37.163425t-31.054369-9.672672q-10.18176-10.18176-27.999841-26.472577t-29.018017-27.490753-19.345345-9.672672-20.363521 13.745376q-14.254464 14.254464-37.163425 37.672513t-48.363362 49.381538-49.890626 50.399714l-37.672513 37.672513q-6.109056 6.109056-13.236288 12.218112t-15.781729 9.163584-18.327169 1.018176-19.854433-13.236288l-38.690689-38.690689q-20.363521-20.363521-17.818081-37.163425t22.908961-37.163425q9.163584-9.163584 30.545281-31.054369t45.817921-46.32701 47.345186-47.854274 36.145249-35.636161q18.327169-18.327169 22.908961-30.036193t-8.654496-24.945313q-9.163584-9.163584-21.890785-22.399873t-22.908961-23.418049q-17.308993-17.308993-12.7272-30.545281t30.036193-16.290817 58.545122-7.127232 67.708706-7.63632 67.708706-7.63632 60.581474-7.127232z', // 图标的路径
          // icon: 'path://M926.72 829.44q28.672 32.768 31.232 57.344t-18.944 48.128q-24.576 27.648-54.272 26.112t-57.344-24.064l-164.864-158.72q-46.08 30.72-99.84 47.616t-113.152 16.896q-80.896 0-151.552-30.72t-123.392-83.456-82.944-123.392-30.208-151.552q0-79.872 30.208-150.528t82.944-123.392 123.392-83.456 151.552-30.72 151.552 30.72 123.392 83.456 83.456 123.392 30.72 150.528q0 61.44-17.92 116.736t-49.664 101.376q13.312 14.336 37.376 38.4t48.128 48.64 44.544 44.032zM449.536 705.536q53.248 0 100.352-19.968t81.92-54.784 54.784-81.92 19.968-100.352-19.968-100.352-54.784-81.92-81.92-54.784-100.352-19.968-99.84 19.968-81.408 54.784-55.296 81.92-20.48 100.352 20.48 100.352 55.296 81.92 81.408 54.784 99.84 19.968zM512 384l128 0 0 128-128 0 0 128-129.024 0 0-128-126.976 0 0-128 126.976 0 0-128 129.024 0 0 128z', // 图标的路径
          icon: 'path://M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z', // 图标的路径

          onclick: this.addZoomfunc // 点击按钮时的回调函数
        },

        myButtonRZ: {
          show: true, // 是否显示按钮
          title: 'reduce zoom', // 鼠标悬停时显示的文字
          // icon: 'path://M445.411299 539.496019q25.974309-2.886034 36.556435 7.696092t8.658103 35.594423q-1.924023 25.974309-5.772069 58.682698t-8.177097 66.859795-8.177097 67.821807-6.73408 62.530744q-2.886034 30.784366-17.316206 38.961464t-31.746378-10.10112q-10.582126-10.582126-26.93632-25.974309t-27.898332-25.974309q-12.506149-12.506149-23.088275-8.658103t-24.050286 17.316206q-14.430172 14.430172-37.999452 38.480458t-49.062584 50.024595-49.543589 50.505601-39.442469 38.961464q-5.772069 6.73408-13.949166 12.506149t-17.316206 8.177097-19.240229-0.481006-21.645258-14.430172q-6.73408-6.73408-11.063132-10.582126t-8.177097-7.696092l-8.658103-8.658103-12.506149-12.506149q-21.164252-21.164252-16.8352-36.556435t25.493303-37.518446q9.620114-9.620114 31.746378-31.265372t46.657555-46.657555 47.619567-48.581578 36.556435-37.037441q19.240229-19.240229 25.974309-33.189395t-6.73408-27.417326q-9.620114-9.620114-24.050286-25.493303t-25.012298-26.455315q-17.316206-17.316206-12.987155-31.265372t31.265372-16.8352 60.606721-7.215086 69.264824-8.177097 70.226836-8.177097 63.492755-7.215086zM1018.770121 53.680239q21.164252 21.164252 18.759223 37.999452t-24.531292 38.961464q-10.582126 10.582126-32.227383 32.708389t-47.138561 47.619567-49.062584 49.543589-37.037441 37.518446q-19.240229 19.240229-23.56928 30.784366t9.139109 25.012298q9.620114 9.620114 22.607269 23.56928t23.56928 24.531292q17.316206 17.316206 12.506149 31.265372t-30.784366 16.8352q-26.93632 2.886034-60.606721 7.215086t-69.74583 8.177097-70.707841 8.177097-62.530744 7.215086q-50.024595 5.772069-46.176549-42.328504 2.886034-25.974309 6.253074-58.682698t7.696092-67.340801 8.177097-68.302813 6.73408-62.530744q2.886034-30.784366 17.316206-38.961464t32.708389 10.10112q4.810057 5.772069 12.506149 12.987155t15.873189 14.911177 15.873189 14.911177 13.46816 12.987155q12.506149 12.506149 20.20224 11.063132t21.164252-14.911177q14.430172-14.430172 38.480458-38.961464t50.505601-50.986607 50.986607-51.467612 39.923475-40.404481q5.772069-5.772069 13.46816-12.025143t16.354195-9.139109 18.278217-0.962011 21.164252 13.46816q6.73408 6.73408 11.063132 10.582126t8.177097 7.696092l8.658103 8.658103z',
          // icon: 'path://M927.744 829.44q28.672 32.768 31.232 57.344t-18.944 48.128q-24.576 27.648-54.272 26.112t-57.344-24.064l-164.864-157.696q-46.08 29.696-99.84 46.592t-113.152 16.896q-80.896 0-151.552-30.72t-123.392-83.456-82.944-123.392-30.208-151.552q0-79.872 30.208-150.528t82.944-123.392 123.392-83.456 151.552-30.72 151.552 30.72 123.392 83.456 83.456 123.392 30.72 150.528q0 61.44-17.92 116.736t-49.664 102.4l36.864 37.888q24.576 23.552 48.64 48.128t43.52 44.032zM450.56 705.536q53.248 0 100.352-19.968t81.92-54.784 54.784-81.92 19.968-100.352-19.968-100.352-54.784-81.92-81.92-54.784-100.352-19.968-99.84 19.968-81.408 54.784-55.296 81.92-20.48 100.352 20.48 100.352 55.296 81.92 81.408 54.784 99.84 19.968zM256 384l385.024 0 0 128-385.024 0 0-128z',
          icon: 'path://M935 423.3H89C40.2 423.3 0.3 463.2 0.3 512c0 48.8 39.9 88.7 88.7 88.7h846c48.8 0 88.7-39.9 88.7-88.7 0-48.8-39.9-88.7-88.7-88.7z',

          onclick: this.reduceZoomfunc // 点击按钮时的回调函数
        }
      }
    }
  }


  getSeries() {
    return [{
      type: 'graph',
      categories: [{
          name: 'P2P',
          itemStyle: {
            color: customerSoftColor,
          }
        },
        {
          name: 'P2C',
          itemStyle: {
            color: customerDeepColor,
          }
        },

      ],
      layout: 'none',
      roam: false,
      label: {
        position: 'right'
      },
      zoom: 0.5,
      width: 1000,
      emphasis: {
        focus: 'adjacency',
        scale: 1.5,
        itemStyle: {
          color: topoAcrossColor
        },
        lineStyle: {
          color: topoAcrossColor,
          width: 5,
        }
      },
    }]
  }
}

export function findPoint(layer, asn, graphLink, graphDataCone, maxCount = 10) {

  if (layer === 0) {
    if (maxCount === -1) {
      return graphLink.filter(link => link.source === asn || link.target === asn).map(link => [link.source,link.target]).flat()
    } else {
      return graphLink
      .filter(link => link.source === asn || link.target === asn)
      .slice(0, maxCount).map(link => [link.source,link.target]).flat()
    }
  }
  let node = []
  let count = 0
  graphLink.forEach(link => {
    if (maxCount !== -1 && count >= maxCount) {
      return
    }
    if (link.source === asn) {
      count += 1
      node = node.concat(findPoint(layer - 1, link.target, graphLink, graphDataCone, maxCount))

    } else if (link.target === asn) {
      count += 1
      node = node.concat(findPoint(layer - 1, link.source, graphLink, graphDataCone, maxCount))
    }
  })
  

  // const data = Array.from(returnDataSet).map(point => {
  //   const cone = graphDataCone[point]
  //   return {
  //     name: point,
  //     value: cone || 1,
  //   }
  // })

  return node
}

function setResillienceDataFormat(point, x, y, graphDataCone) {
  return {
    name: point,
    value: graphDataCone[point] || 1,
    x,
    y,
  }
}

export function calPointIndex(pointData, graphDataCone, targetAsn) {
  const pointTypeList = classifyPointByCone(pointData, graphDataCone)
  const result = innerCalPointIndex(pointTypeList, setResillienceDataFormat, [graphDataCone])
  if (targetAsn) {
    renderPointInSeries(result,targetAsn)
  }
  return result
}

export function renderPointInSeries(seriesData,targetAsn){
  seriesData.forEach(item => {
    if (item.name === targetAsn) {
      item.itemStyle = {
        borderColor: '#000',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
      }
    } else {
      delete item.itemStyle
    }
  })
}

export function innerCalPointIndex(pointTypeList, setDataFormat, args) {

  const FULL_ANGLE = 360
  const data = []
  pointTypeList.forEach((list, index) => {
    const radius = (pointTypeList.length - index) * 500
    const perAngle = FULL_ANGLE / list.length
    const radomAngle = (perAngle * 0.9) / 2
    const negativeRadomAngle = -radomAngle
    const angleOffSet = Math.random() * (radomAngle - negativeRadomAngle) + negativeRadomAngle
    list.forEach((point, pointIndex) => {
      let x, y
      let [x1, y1] = calPointIndexInCricle(perAngle * pointIndex, radius)
      x = x1
      y = y1
      data.push(setDataFormat(point, x, y, ...args))
    })
  })
  return data
}

function calPointIndexInCricle(angle, r) {
  const x0 = 0
  const y0 = 0
  const x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
  const y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
  return [x1, y1]
}

const MIN_LENGTH = 30

function classifyPointByCone(pointData, graphDataCone) {
  // 1
  // 2 - 10
  // 10 - 100
  // 100 - 500
  // >500
  if (pointData.length <= MIN_LENGTH) {
    return [pointData]
  }
  const result = [
    [],
    [],
    [],
    [],
    []
  ]
  result[0] = pointData.filter(point => !graphDataCone[point] || graphDataCone[point] === 1)
  const otherPoint = pointData.filter(point => graphDataCone[point] && graphDataCone[point] !== 1)
  otherPoint.sort((a, b) => graphDataCone[a] - graphDataCone[b])
  const limit = Math.ceil(otherPoint.length / 10)
  let endIndex = 0
  let startIndex = 0
  const scaleList = [4, 3, 2, 1]
  scaleList.forEach((scale, index) => {
    startIndex = endIndex
    endIndex = startIndex + scale * limit
    result[index + 1] = otherPoint.slice(startIndex, endIndex)
  })

  return result

}


export class PrefixGraphOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }
  getToolTip() {
    return {
      formatter: function ({
        data
      }) {
        const {
          name,
          asName,
          org,
          country,
        } = data
        if (name) {
          return `
          <div>
          <div style="display: flex;justify-content: space-between;"><span>AS Name:</span> <span>${asName}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Org:</span> <span>${org}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Country:</span> <span>${country}</span></div>
          </div>
          `
        }
      },
    }

  }
  getSeries() {
    return [{
      type: 'graph',
      layout: 'none',
      name: "Test",
      symbolSize: 60,
      // symbol:'Rect',
      // symbolSize:[100,50],
      // symbolOffset:[50,0],
      roam: false,
      // roam: 'move',
      // force: {
      //   repulsion: 500,
      //   gravity: 0.01,
      //   edgeLength: [50, 100]
      // },
      label: {
        show: true,
        color: '#fff',
        fontWeight: 'bold',
        formatter: function ({
          data: {
            name
          }
        }) {
          return name.split('|')[0]
        },
      },
      // width: 1200,
      zoom: 0.8,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 20,
    }]
  }
}

export class TestGraphOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getToolTip() {
    return {}
  }

  getSeries() {
    return [{
      type: 'graph',
      layout: 'force',
      symbolSize: 50,
      roam: true,
      label: {
        show: true
      },
      force: {
        repulsion: 200,
        gravity: 0.0001,
        edgeLength: 100
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      draggable: true,
      data: [],
      // links: [],
      links: [],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }]
  }
}

export class IPPathRouteGraphOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getToolTip() {
    return {
      formatter: function ({
        data
      }) {
        const {
          name,
          asName,
          org,
          country,
        } = data

        if (name) {
          //  IP
          if (name.indexOf('.') !== -1) {
            return `
            <div style="min-width:100px">
            <div style="font-weight:bold">${name}</div>
            </div>
            `
          }
          return `
          <div style="min-width:200px">
          <div style="font-weight:bold;text-align:center">${name}(${asName})</div>
          <div style="display: flex;justify-content: space-between;"><span>Org:</span> <span>${org}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Country:</span> <span>${country}</span></div>
          </div>
          `
        }
      },
    }
  }

  getSeries() {
    return [{
      type: 'graph',
      layout: 'none',
      symbolSize: 50,
      roam: 'move',
      label: {
        show: true,
        fontWeight:700,
        fontSize:middleFontSize
      },
      // height:100,
      // width:1000,
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: [],
      links: [],

      lineStyle: {
        width: 2,
        color:'#000'
      }
    }]
  }
}

export class ReverseRouteGrapOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getTitle() {
    return {
      left: 20,
      text: this.title,
      textStyle: {
        color: '#000',
        fontSize: middleFontSize
      },
    }
  }
  getLegend() {
    return {
      type: 'scroll',
      orient: 'vertical',
      align: 'left',
      bottom: '10px',
      right: '0px',
      formatter: function (name) {
        if (name.length > 7) {
          name = name.slice(0, 7) + '...';
          return name
        } else {
          return name
        }
      },
      itemHeight: 10,
      itemWidth: 12,
      textStyle: {
        fontSize: 10
      },

    }
  }
  getToolTip() {
    return {
      position: (point) => {
        return [point[0] + 10, point[1] + 10]
      },
      formatter: function ({
        data
      }) {
        const {
          name,
          asName,
          org,
          country,
        } = data

        if (name) {
          //  IP
          if (name.indexOf('.') !== -1) {
            return `
            <div style="min-width:200px">
            <div style="display: flex;justify-content: space-between;"><span>IP:</span>  <span>${name}</span></div>
            </div>
            `
          }
          return `
          <div style="min-width:200px">
          <div style="display: flex;justify-content: space-between;"><span>AS Name:</span>  <span>${asName}(${name})</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Org:</span> <span>${org}</span></div>
          <div style="display: flex;justify-content: space-between;"><span>Country:</span> <span>${country}</span></div>
          </div>
          `
        } else {
          return `
          <div style="min-width:200px">
          <div><span>${data.source} > ${data.target}</span></div>
          </div>
          `
        }
      },
    }

  }

  getSeries() {
    return [{
      type: 'graph',
      layout: 'force',
      roam: true,
      label: {
        show: true,
        position: 'top',
      },
      force: {
        repulsion: 100,
        friction: 0.1,
        layoutAnimation: false,
      },
      edgeSymbolSize: 4,
    }]
  }
}

export class ASPathGraphOption extends Option{
  constructor(title) {
    super()
    this.title = title
  }
  getSeries() {
    return [{
      type: 'graph',
      layout: 'none',
      symbolSize: 60,
      roam: false,
      label: {
        show: true,
        color: '#fff',
        fontWeight: 'bold',
      },
      zoom: 0.8,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 20,
    }]
  }
  static getSeries(){
    return {
      type: 'graph',
      layout: 'none',
      symbolSize: 60,
      roam: false,
      label: {
        show: true,
        color: '#fff',
        fontWeight: 'bold',
        formatter:param => {
          return param.data.name.split('|')[0]
        }
      },
      zoom: 0.8,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 20,
    }
  }
}