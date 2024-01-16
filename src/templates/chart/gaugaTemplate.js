import {
    Option,
} from '@/templates/chart'


const deepColor = '#c8b3dd'
const softColor = '#fbf9fc'
export class GaugeOption extends Option {
    constructor(title) {
        super()
        this.title = title
    }


    getTitle() {
        return {
            left: '50%',
            top: '30%',
            textAlign: 'center',
            text: this.title,
            textStyle: {
                color: '#000',
                overflow: 'break',
                lineHeight: 25,
                fontSize:15,
            }
        }
    }

    getSeries() {
        return [{
            type: 'gauge',
            radius: '90%',
            progress: {
                show: true,
                roundCap :true,
                width: 30,
                itemStyle:{
                    color:'#956dbd',
                }

            },
            max: 10000,
            pointer: {
                show: false
            },
            axisLine: {
                roundCap :true,
                lineStyle: {
                    color:[[1,{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: softColor,
                          },
                          {
                            offset: 1,
                            color: deepColor,
                          },
                        ],
                      }]],
                    width: 30
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            anchor: {
                show: false,
            },
            title: {
                show: false
            },
            detail: {
                valueAnimation: true,
                offsetCenter: [0, '90%'],
                fontSize:20,
                formatter:(data) => {
                    return handleNumByDot(data)
                }
            },
            data: [{
                value: 7000
            }]
        }]
    }
}

function handleNumByDot(num) {
    const str = new String(num).toString()
    // if(str.length < 3){
    //     return str
    // }else{
    //     return  str.slice(0, LongNum.length - 3) + ',' + handleNumByDot(str.slice(LongNum.length - 3))
        
    // }
    const numberArray = str.split('.')
    const floatNum = numberArray[1] ? '.' + numberArray[1] : ''
    var LongNum = numberArray[0]
    for (var i = 3; i < LongNum.length; i += 4) {
      LongNum = LongNum.slice(0, LongNum.length - i) + ',' + LongNum.slice(LongNum.length - i)
    }
    return LongNum + floatNum
  }