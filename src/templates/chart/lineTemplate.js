import {
  Option
} from '@/templates/chart'

import {
  middleFontSize
} from '@/styles/font.scss'

const deepColor = '#AF86D8'
const softColor = '#7f5ac3'
export class LineOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getLegend() {
    return {
      top: '6%',
    }
  }

  getColor() {
    return ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#5470c6', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  }

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    }
  }
  getXAxis() {
    return {
      type: 'time',
      axisLabel: {
        showMaxLabel: true,
        formatter: function (value, index) {
          function deepFormat(num) {
            return num < 10 ? '0' + num : num
          }
          const date = new Date(value)
          return `${date.getFullYear()}-${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())}\n${deepFormat(date.getHours())}:${deepFormat(date.getMinutes())}:${deepFormat(date.getSeconds())}`
        }
      },
      // splitNumber: 0
    }
  }

  getYAxis() {
    return {

      name: 'count',
      max: function (value) {
        return Math.ceil(value.max + parseInt(value.max * 0.2))
      },
      min: 0,

    }
  }

  getGrid() {
    return {
      width: '90%',
      left: 'center'
    }
  }
  getSeries() {
    return [{
      type: 'line',
      areaStyle: {},
      smooth: true,
      showSymbol: false,
    }]
  }

}



const dashboardAreaColor = '#AF86D8'
const dashboardLineColor = '#7f5ac3'
export class DashboardLineOption extends LineOption {


  constructor(...arg) {
    super(...arg)
    this.commonAxis = {
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    }
  }

  getXAxis() {
    return Object.assign({
      type: 'time'
    }, this.commonAxis)
  }

  getYAxis() {
    return {
      // type:'log',
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    }
  }

  getGrid() {
    return {
      bottom: '0%',
      containLabel: true,
      height: this.gridHeight,
      width: '100%',
      right: '0%'
    }
  }

  getSeries() {
    return [{
      name: 'Announced',
      type: 'line',
      areaStyle: {
        color: dashboardAreaColor
      },
      lineStyle: {
        color: dashboardLineColor

      },
      smooth: true,
      showSymbol: false,
      markLine: {
        lineStyle: {
          color: dashboardLineColor
        },
        symbol: ['none', 'none'],
        data: [
          [{
            // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
            yAxis: 'max',
            x: 0
          }, {
            // symbol:"circle",
            type: 'max',
            x: '100%'
          }],
        ],
        label: {
          show: true,
          position: 'middle',
          formatter: ({
            data
          }) => {
            return `max:${data.value}`
          }
        }
      },

      animationDurationUpdate: 100
    }]
  }
}

export class ResilienceLineOption extends LineOption {
  constructor(title) {
    super()
    this.title = title
  }

  // getLegend() {
  //   return {
  //     top: '6%',
  //   }
  // }

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: function (data) {
        // console.log(data)
        let param = data[0]
        return ` <div style="margin: 0px 0 0; line-height: 1">
        <div
          style="font-size: ${middleFontSize}; color: #666; font-weight: 400; line-height: 1"
        >
          ${param.seriesName}
        </div>
        <div style="margin: 10px 0 0; display: flex; justify-content: space-between">
          <div>${param.marker}${param.data[0]}</div>
          <div>
            <span style="font-weight: bold; margin-left: 20px; text-align: right"
              >${(param.data[1])}</span
            >
          </div>
        </div>
      </div>`
      }
    }
  }
  getXAxis() {
    return {
      name: 'resilience',
      show: true,
      nameLocation: 'center',
      min: 0.9,
      max: 1,
      nameTextStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        verticalAlign: 'top',
        padding: [10, 0, 0, 0],
      },
      type: 'value',
      // splitNumber: 4
    }
  }
  getDataZoom() {
    return [{
        type: 'inside',
        start: 90,
        end: 100
      },
      {
        start: 90,
        end: 100
      }
    ]
  }

  getYAxis() {
    return {
      name: 'CDF',
      show: true,
      nameLocation: 'center',
      nameTextStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        verticalAlign: 'bottom',
        padding: [0, 0, 15, 0],
      },
      max: function (value) {
        return Math.ceil(value.max + parseInt(value.max * 0.2))
      },
      min: 0,
    }
  }

  getGrid() {
    return {
      width: '65%',
      height: '55%',
      left: 'center'
    }
  }
  getSeries() {
    return [{
      type: 'line',
      areaStyle: {},
      smooth: true,
      showSymbol: false,
    }]
  }

}

export class DashboardRouteHistoryLineOption extends LineOption {
  constructor(title) {
    super()
    this.title = title
  }

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: (param) => {
        // console.log(param[0])
        const data = param[0].data
        const axisValueLabel = param[0].axisValueLabel.split(' ')[0]
        const marker = param[0].marker
        return `${axisValueLabel.split(' ')[0]}<br/>
        <div style="display:flex;justify-content: space-between;">
        <span style="text-align:left">${marker}</span>
        
        <span style="text-align:right">${data[1].split('.')[0]}</span>
        </div>`
      }
    }
  }
  getXAxis() {
    return {
      type: 'time',
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      // axisLabel:{
      //   show:false
      // },
      splitLine: {
        show: true
      },
      axisLabel: {
        showMaxLabel: true,
        formatter: function (value, index) {
          function deepFormat(num) {
            return num < 10 ? '0' + num : num
          }
          const date = new Date(value)
          return `${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())}`
        }
      },
      splitNumber: 1
    }
  }

  getYAxis() {
    return {
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          return `${value.toString().split('.').length > 1 ? '' : value}`
        },
      },
      splitLine: {
        show: false
      },
    }
  }

  getGrid() {
    return {
      width: '80%',
      height: '80%',
      bottom: 'middle',
      right: 20,
    }
  }
  getSeries() {
    return [{
      type: 'line',
      lineStyle: {
        color: softColor
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: softColor // 0% 处的颜色
          }, {
            offset: 1,
            color: '#fff' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      itemStyle: {
        color: softColor
      },
      markPoint: {

        data: [{
          name: 'Max',
          type: 'max',
          label: {
            offset: [0, -5]
          }
        }, {
          name: 'Min',
          type: 'min',
          symbolRotate: 180,
          label: {
            show: true,
            offset: [0, 10]
          }
        }, ],
        symbolSize: 70,
        label: {
          show: true,
          formatter: (params) => {
            const {
              data: {
                value,
                name
              }
            } = params
            return `${name}\n${value.toString().split('.')[0]}`
          }
        }
      },
      smooth: true,
      showSymbol: true,
    }]
  }

}

export class SubcribeRouteHistoryLineOption extends DashboardRouteHistoryLineOption {


  static getYAxis() {
    return {
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      axisLabel: {
        show: true,
        margin: 30,
        formatter: function (value, index) {
          return `${value.toString().split('.').length > 1 ? '' : value}`

        },
      },
      splitLine: {
        show: false
      },
    }
  }
  static getSeriesFirst() {
    return {
      type: 'line',
      lineStyle: {
        color: softColor
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: softColor // 0% 处的颜色
          }, {
            offset: 1,
            color: '#fff' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      itemStyle: {
        color: softColor
      },
      markPoint: {

        data: [{
          name: 'Max',
          type: 'max',
          label: {
            offset: [0, -5]
          }
        }, {
          name: 'Min',
          type: 'min',
          symbolRotate: 180,
          label: {
            show: true,
            offset: [0, 10]
          }
        }, ],
        symbolSize: 70,
        label: {
          show: true,
          formatter: (params) => {
            const {
              data: {
                value,
                name
              }
            } = params
            return `${name}\n${value.toString().split('.')[0]}`
          }
        }
      },
      smooth: true,
      showSymbol: true,
    }
  }
  getYAxis() {
    return {
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      axisLabel: {
        show: true,
        margin: 30,
        formatter: function (value, index) {
          return `${value.toString().split('.').length > 1 ? '' : value}`
        },
      },
      splitLine: {
        show: false
      },
    }
  }

  getGrid() {
    return {
      width: '70%',
      height: '80%',
      bottom: 'middle',
      right: 'center',
    }
  }

}


export class LineTestOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getLegend() {
    return {
      orient: 'vertical',
      right: 0
    }
  }

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    }
  }
  getXAxis() {
    return {
      name: 'Optmizing Link Number',
      type: 'category',
      nameLocation: 'middle',
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: [10, 0, 0, 0]
      }
    }
  }

  getYAxis() {
    return [{
      name: 'Intra-region survivability Ranking',
      type: 'value',
      nameLocation: 'middle',
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: [0, 0, 20, 0]
      }
    }]
  }
  getColor() {
    return ['#98EBD0', '#EAA9EB', '#EBDCA9', '#DEEBA4', '#A0AEEB', '#6CF5A7', '#D87DF5', '#F5D17D', '#F5F178', '#F305FF', '#00DB2C', '#7C10DB', '#DB8D10', '#DBC20C', '#F5796C', '#2EF525', '#7036F5', '#F59736', '#F525A4', '#2CEBF5', '#00DB2C', '#2615EB', '#DB001F', '#EBAD10', '#0CFECA', '#51EB04', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  }
  getGrid() {
    return {
      width: '80%',
      left: 'center'
    }
  }
  getSeries() {
    return []
  }
}

export class SubcribePeerDiffLineOption extends SubcribeRouteHistoryLineOption {
  constructor(title) {
    super()
    this.title = title
  }

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },

    }
  }



}

export class JitterLineOption2 extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getTitle() {
    return {
      left: 'center',
      text: this.title,
      textStyle: {
        color: '#fff',
      }
    }
  }

  getLegend() {
    return {
      orient: 'vertical',
      right: 0
    }
  }

  getToolTip() {
    return {
      // show:true,
      // trigger: 'axis',
      // triggerOn:'none',
    }
  }


  getXAxis() {
    return {
      type: 'time',
      nameLocation: 'middle',
      axisLabel: {
        showMaxLabel: true,
        formatter: function (value, index) {
          function deepFormat(num) {
            return num < 10 ? '0' + num : num
          }
          const date = new Date(value)
          return `${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())}\n${deepFormat(date.getHours())}:${deepFormat(date.getMinutes())}`
        }
      },
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: [10, 0, 0, 0]
      },
      axisLabel: {
        color: '#fff',
        formatter: function (value, index) {
          function deepFormat(num) {
            return num < 10 ? '0' + num : num
          }
          const date = new Date(value)
          return `${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())} ${deepFormat(date.getHours())}:${deepFormat(date.getMinutes())}`
        }
      },
      axisPointer: {
        show: true,
        triggerTooltip: true,
        triggerEmphasis: false,
        label: {
          show: false
        }
      },

    }
  }

  getYAxis() {
    return [{
      name: 'Prefix Flip Count',
      type: 'value',
      nameLocation: 'middle',
      nameTextStyle: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 20,
        padding: [0, 0, 40, 0]
      }
    }]
  }
  getColor() {
    return JitterLineOption2.getColor()
  }
  static getColor() {
    return ['#c0bbff', '#f3b3b3', '#27bedc', '#DEEBA4', '#A0AEEB', '#6CF5A7', '#D87DF5', '#F5D17D', '#F5F178', '#F305FF', '#00DB2C', '#7C10DB', '#DB8D10', '#DBC20C', '#F5796C', '#2EF525', '#7036F5', '#F59736', '#F525A4', '#2CEBF5', '#00DB2C', '#2615EB', '#DB001F', '#EBAD10', '#0CFECA', '#51EB04', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  }
  getGrid() {
    return {
      width: '80%',
      left: 'center'
    }
  }

  static getMarkLineOption(xAxis) {
    return {
      silent: true,
      lineStyle: {
        color: '#333'
      },
      data: [{
        // name: 'Y 轴值为 100 的水平线',
        xAxis
      }, ]
    }
  }
  getSeries() {
    return [{
        name: 'A',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        emphasis: {},
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#7a70ff' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#000' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line',

      },
      {
        name: 'W',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        emphasis: {},
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333'
          },
          label: {
            show: false
          },
          lineStyle: {
            opacity: 0
          },
          data: [{
            name: 'Y 轴值为 100 的水平线',
            xAxis: '2023-09-20'
          }, ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#ff8c8c' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#000' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line'
      },
      {
        name: 'flip',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        z: 1,
        emphasis: {},
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#27bedc' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#000' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line'
      },
    ]
  }





}

export class JitterLineOption extends Option {
  constructor(title) {
    super()
    this.title = title
  }

  getLegend() {
    return {
      orient: 'vertical',
      right: 0
    }
  }

  getToolTip() {
    return {
      // show:true,
      // trigger: 'axis',
      // triggerOn:'none',
    }
  }
  // getDataZoom() {
  //   return [{
  //       startValue: function () {
  //         function deepFormat(num) {
  //           return num < 10 ? '0' + num : num
  //         }
  //         const d = new Date()
  //         return `${d.getFullYear()}-${deepFormat(d.getMonth() + 1)}-${deepFormat(d.getDate())} 00:${deepFormat(d.getMinutes())}:00`
  //       }()
  //     },
  //     {
  //       type: 'inside'
  //     }
  //   ]
  // }

  getXAxis() {
    return {
      type: 'time',
      nameLocation: 'middle',
      axisLabel: {
        showMaxLabel: true,
        formatter: function (value, index) {
          function deepFormat(num) {
            return num < 10 ? '0' + num : num
          }
          const date = new Date(value)
          return `${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())}\n${deepFormat(date.getHours())}:${deepFormat(date.getMinutes())}`
        }
      },
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: [10, 0, 0, 0]
      },
      axisPointer: {
        show: true,
        triggerTooltip: true,
        triggerEmphasis: false,
        label: {
          show: false
        }
      },

    }
  }

  getYAxis() {
    return [{
      name: 'Prefix Flip Count',
      type: 'value',
      nameLocation: 'middle',
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: [0, 0, 40, 0]
      }
    }]
  }
  getColor() {
    return JitterLineOption.getColor()
  }
  static getColor() {
    return ['#7a70ff', '#ff8c8c', '#27bedc', '#DEEBA4', '#A0AEEB', '#6CF5A7', '#D87DF5', '#F5D17D', '#F5F178', '#F305FF', '#00DB2C', '#7C10DB', '#DB8D10', '#DBC20C', '#F5796C', '#2EF525', '#7036F5', '#F59736', '#F525A4', '#2CEBF5', '#00DB2C', '#2615EB', '#DB001F', '#EBAD10', '#0CFECA', '#51EB04', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  }
  getGrid() {
    return {
      width: '80%',
      left: 'center'
    }
  }

  static getMarkLineOption(xAxis) {
    return {
      silent: true,
      lineStyle: {
        color: '#333'
      },
      data: [{
        // name: 'Y 轴值为 100 的水平线',
        xAxis
      }, ]
    }
  }
  getSeries() {
    return [{
        name: 'A',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        emphasis: {},
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#7a70ff' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line',

      },
      {
        name: 'W',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        emphasis: {},
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333'
          },
          label: {
            show: false
          },
          lineStyle: {
            opacity: 0
          },
          data: [{
            name: 'Y 轴值为 100 的水平线',
            xAxis: '2023-09-20'
          }, ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#ff8c8c' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line'
      },
      {
        name: 'flip',
        data: [],
        smooth: false,
        showSymbol: true,
        selectedMode: true,
        z: 1,
        emphasis: {},
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#27bedc' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        type: 'line'
      },
    ]
  }





}