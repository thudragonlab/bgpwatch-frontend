import {
  Option,
  DEFALUT
} from '@/templates/chart'



export const softColor = '#AF86D8'
export const deepColor = '#7f5ac3'
export class BarOption extends Option {
  constructor(title,className='',enlarge=()=>{},reduce=()=>{}) {
    super()
    this.title = title
    this.className = className
    this.enlarge = enlarge
    this.reduce = reduce
  }

  getXAxis() {
    return {
      type: 'category',
      name: 'prefix\nlength',
    }
  }

  getYAxis() {
    return {
      type: 'value',
      name: 'Count',
      splitLine: {
        show: false
      },
      axisLine: {
        show: true
      }
    }
  }

  getGrid() {
    return {
      width: '60%',
      height: '60%',
      left: 'center'
    }
  }


  static getIcon(key){
    const iconMap = {
      enlarge:'path://M395.731085 571.196755l10.18176 10.18176q4.072704 4.072704 8.145408 7.63632t8.145408 7.63632l12.218112 12.218112q20.363521 20.363521 16.290817 35.636161t-25.454401 35.636161q-9.163584 10.18176-30.036193 31.054369t-44.799745 45.308833-46.32701 46.836098-34.617985 35.636161q-18.327169 18.327169-25.454401 32.072545t6.109056 26.981665q9.163584 9.163584 23.418049 24.436225t24.436225 25.454401q17.308993 17.308993 12.7272 30.545281t-30.036193 15.27264q-26.472577 3.054528-59.05421 7.127232t-67.199618 7.63632-67.708706 7.63632-60.581474 7.127232q-26.472577 3.054528-36.654337-6.618144t-8.145408-34.108897q2.036352-25.454401 5.599968-57.017858t7.63632-64.654178 7.63632-65.672354 6.618144-60.072386q3.054528-29.527105 16.799905-37.672513t31.054369 9.163584q10.18176 10.18176 26.472577 24.945313t27.490753 25.963489 21.381697 7.127232 23.418049-16.290817q13.236288-13.236288 36.145249-36.654337t47.854274-48.363362 48.363362-48.87245 37.672513-38.181601q6.109056-6.109056 13.745376-11.709024t16.799905-7.63632 18.836257 1.018176 20.872609 13.236288zM910.928158 58.036034q26.472577-3.054528 36.654337 6.618144t8.145408 34.108897q-2.036352 25.454401-5.599968 57.017858t-7.63632 64.654178-7.63632 66.181442-6.618144 60.581474q-3.054528 29.527105-16.799905 37.163425t-31.054369-9.672672q-10.18176-10.18176-27.999841-26.472577t-29.018017-27.490753-19.345345-9.672672-20.363521 13.745376q-14.254464 14.254464-37.163425 37.672513t-48.363362 49.381538-49.890626 50.399714l-37.672513 37.672513q-6.109056 6.109056-13.236288 12.218112t-15.781729 9.163584-18.327169 1.018176-19.854433-13.236288l-38.690689-38.690689q-20.363521-20.363521-17.818081-37.163425t22.908961-37.163425q9.163584-9.163584 30.545281-31.054369t45.817921-46.32701 47.345186-47.854274 36.145249-35.636161q18.327169-18.327169 22.908961-30.036193t-8.654496-24.945313q-9.163584-9.163584-21.890785-22.399873t-22.908961-23.418049q-17.308993-17.308993-12.7272-30.545281t30.036193-16.290817 58.545122-7.127232 67.708706-7.63632 67.708706-7.63632 60.581474-7.127232z',
      reduce:'path://M445.411299 539.496019q25.974309-2.886034 36.556435 7.696092t8.658103 35.594423q-1.924023 25.974309-5.772069 58.682698t-8.177097 66.859795-8.177097 67.821807-6.73408 62.530744q-2.886034 30.784366-17.316206 38.961464t-31.746378-10.10112q-10.582126-10.582126-26.93632-25.974309t-27.898332-25.974309q-12.506149-12.506149-23.088275-8.658103t-24.050286 17.316206q-14.430172 14.430172-37.999452 38.480458t-49.062584 50.024595-49.543589 50.505601-39.442469 38.961464q-5.772069 6.73408-13.949166 12.506149t-17.316206 8.177097-19.240229-0.481006-21.645258-14.430172q-6.73408-6.73408-11.063132-10.582126t-8.177097-7.696092l-8.658103-8.658103-12.506149-12.506149q-21.164252-21.164252-16.8352-36.556435t25.493303-37.518446q9.620114-9.620114 31.746378-31.265372t46.657555-46.657555 47.619567-48.581578 36.556435-37.037441q19.240229-19.240229 25.974309-33.189395t-6.73408-27.417326q-9.620114-9.620114-24.050286-25.493303t-25.012298-26.455315q-17.316206-17.316206-12.987155-31.265372t31.265372-16.8352 60.606721-7.215086 69.264824-8.177097 70.226836-8.177097 63.492755-7.215086zM1018.770121 53.680239q21.164252 21.164252 18.759223 37.999452t-24.531292 38.961464q-10.582126 10.582126-32.227383 32.708389t-47.138561 47.619567-49.062584 49.543589-37.037441 37.518446q-19.240229 19.240229-23.56928 30.784366t9.139109 25.012298q9.620114 9.620114 22.607269 23.56928t23.56928 24.531292q17.316206 17.316206 12.506149 31.265372t-30.784366 16.8352q-26.93632 2.886034-60.606721 7.215086t-69.74583 8.177097-70.707841 8.177097-62.530744 7.215086q-50.024595 5.772069-46.176549-42.328504 2.886034-25.974309 6.253074-58.682698t7.696092-67.340801 8.177097-68.302813 6.73408-62.530744q2.886034-30.784366 17.316206-38.961464t32.708389 10.10112q4.810057 5.772069 12.506149 12.987155t15.873189 14.911177 15.873189 14.911177 13.46816 12.987155q12.506149 12.506149 20.20224 11.063132t21.164252-14.911177q14.430172-14.430172 38.480458-38.961464t50.505601-50.986607 50.986607-51.467612 39.923475-40.404481q5.772069-5.772069 13.46816-12.025143t16.354195-9.139109 18.278217-0.962011 21.164252 13.46816q6.73408 6.73408 11.063132 10.582126t8.177097 7.696092l8.658103 8.658103z'
    }
    return iconMap[key]
  }
  
  getToolBox() {
    return {
      feature: {
        mybtnEnlarge: {
          show: true, // 是否显示按钮
          icon: BarOption.getIcon('enlarge'), // 图标的路径
          onclick:() => {
            this.enlarge(this.className,'barExtraOption')
          } // 点击按钮时的回调函数
        },
        mybtnReduce: {
          show: false, // 是否显示按钮
          icon: BarOption.getIcon('reduce'), // 图标的路径
          onclick:this.reduce // 点击按钮时的回调函数
        },
      }
    }
  }

  getSeries() {
    return [{
      data: [],
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0,
              color: softColor, // 0% 处的颜色
            },
            {
              offset: 1,
              color: deepColor, // 100% 处的颜色
            },
          ],
        }
      },
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  }
}

export class OverviewBarOption extends BarOption {

  getToolTip() {
    return {
      // alwaysShowContent: true,
      enterable: true,
      position: 'top',
      hideDelay:500,
      formatter: (param) => {
        const data = param.data
        const pss = param.seriesName.split('-')
        const seriesName = pss[0]
        let searchContent = ''
        if(data.condition){
          const actType = pss[1]

          if(isNaN(parseInt(data.condition))){
            const cc = data.condition
            searchContent = `${actType}:${cc}`
          }else{
            const asn = parseInt(data.condition)
            searchContent = `${actType},${asn}`
          }
          
          
        }
        
        // const axisValueLabel = param.axisValueLabel.split(' ')[0]
        const marker = param.marker
        return `${param.seriesName}<br/>
          <div style="display:flex;justify-content: space-between;width:200px">
          <span style="text-align:left">${marker} ${data.name}</span>
          <span style="text-align:right;font-weight:bold">${data.value[1]}</span>
          </div>
          <div>
          <a target="_blank" href="/#/anomaly?st=${param.data.st}&et=${param.data.et}&event_type=${seriesName}&searchContent=${searchContent}">Go to Anomaly</a>
          </div>`
      }
    }
  }
  getLegend() {
    return [{
      top: '6%',
      data: ['Possible Hijack', 'Possible SubHijack', 'All',

      ],
      // selected: {
      //   'Possible Hijack': true,
      //   'Possible SubHijack': true,
      //   'All': true
      // }
    }, {
      top: '7%',
      left: 'center',
      data: [{
        name: 'Possible Hijack-Victim',
        textStyle: {
          backgroundColor: '#fff',
          width: 140
        }
      }, {
        name: 'Possible SubHijack-Victim',
        textStyle: {
          backgroundColor: '#fff',
          width: 160
        }
      }, {
        name: 'All-Victim',
        textStyle: {
          backgroundColor: '#fff',
          width: 140
        }
      }],
      // selected: {
      //   'Possible Hijack-Victim': true,
      //   'Possible SubHijack-Victim': true,
      //   'All-Victim': true
      // },
      // itemWidth:40,
    }, {
      top: '4%',
      left: 'center',
      data: [{
        name: 'Possible Hijack-Attacker',
        textStyle: {
          backgroundColor: '#fff',
          width: 140
        }
      }, {
        name: 'Possible SubHijack-Attacker',
        textStyle: {
          backgroundColor: '#fff',
          width: 160
        },
      }, {
        name: 'All-Attacker',
        textStyle: {
          backgroundColor: '#fff',
          width: 140
        }
      }],
      // selected: {
      //   'Possible Hijack-Attacker': true,
      //   'Possible SubHijack-Attacker': true,
      //   'All-Attacker': true
      // },
    }]
  }

  getXAxis() {
    return {
      type: 'category',
      splitNumber: 4,
    }
  }

  getYAxis() {
    return {
      name: 'count',
      // max: function (value) {
      //   return Math.ceil(value.max + parseInt(value.max * 0.1))
      // },
      min: 0,
    }
  }

  getGrid() {
    return {
      width: '90%',
      left: 'center',
      height: '80%',
      bottom: 50,
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

export class BashboardBarOption extends BarOption {
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

  getToolTip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
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
      large: true,
      largeThreshold: 500,
      progressiveThreshold: 500,
      progressive: 1000,
      progressiveChunkMode: 'mod',
      type: 'bar',
      itemStyle: {
        color: '#AF86D8'
      },
      smooth: true,
      showSymbol: false,
      markLine: {
        lineStyle: {
          color: '#AF86D8'
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
      animationDuration: 1000,
      animationDurationUpdate: 100,
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    }]
  }

  // getSeries() {
  //   return [{
  //     data: [],
  //     type: 'bar',
  //     itemStyle: {
  //       color: {
  //         type: 'linear',
  //         x: 0,
  //         y: 0,
  //         x2: 0,
  //         y2: 1,
  //         colorStops: [{
  //             offset: 0,
  //             color: softColor, // 0% 处的颜色
  //           },
  //           {
  //             offset: 1,
  //             color: deepColor, // 100% 处的颜色
  //           },
  //         ],
  //       }
  //     },
  //     backgroundStyle: {
  //       color: 'rgba(180, 180, 180, 0.2)'
  //     }
  //   }]
  // }
}