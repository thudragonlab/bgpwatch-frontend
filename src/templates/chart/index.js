import { middleFontSize } from '@/styles/font.scss'

export class Option {
  
  constructor(){
  }

  getOption(subOptionArray){
    //一定得在函数里面
    const optionRule={
      'title':this.getTitle(),
      'dataZoom':this.getDataZoom(),
      'yAxis':this.getYAxis(),
      'xAxis':this.getXAxis(),
      'tooltip':this.getToolTip(),
      'toolbox':this.getToolBox(),
      'legend':this.getLegend(),
      'grid':this.getGrid(),
      'geo':this.getGeo(),
      'geo3D':this.getGeo3D(),
      'series':this.getSeries(),
      'visualMap':this.getVisualMap(),
      'color':this.getColor(),
    }
    const option = {}
    for (let i = 0; i < subOptionArray.length; i++) {
      const subOption = subOptionArray[i];
      const optionComponents = optionRule[subOption]
      option[subOption] = optionComponents
    }
    return option
  }
  getTitle(){
    return {
        left: 'center',
        text: this.title,
        textStyle: {
          color: '#000',
          fontSize: middleFontSize
        }
      }
}

getDataZoom(){
    return [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ]
}

getYAxis(){
    return  {
        max: function(value) {
          return Math.ceil(value.max + parseInt(value.max * 0.2))
        },
        min: 0,
      }
}


getXAxis(){
    return {
        splitNumber: 4
      }
}

getColor(){
  return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
}

getToolTip(){
    return {
      }
}

getLegend(){
    return {
      type: 'scroll',
      orient: 'vertical',
      align: 'left',
      top:'10%',
      right: '0px',
      formatter: function (name) {
        if (name.length > 7) {
          name =  name.slice(0,7) + '...';
          return name
        }else{
          return name
        }
     },
      itemHeight: 10,
      itemWidth: 12,
      textStyle: {
        fontSize: 10
      }
    }
}

getVisualMap(){
  return {}
}

getGrid(){
    return  {
      width: '90%',
      left: 'center'
    }
}
getGeo3D(){
  return {
    map:this.mapName,
    shading: 'realistic',
      silent: true,
      environment: '#333',
      realisticMaterial: {
        roughness: 0.8,
        metalness: 0
      },
      postEffect: {
        enable: true
      },
      groundPlane: {
        show: false
      },
      light: {
        main: {
          intensity: 1,
          alpha: 30
        },
        ambient: {
          intensity: 0
        }
      },
      viewControl: {
        distance: 70,
        alpha: 89,
        panMouseButton: 'left',
        rotateMouseButton: 'right'
      },
      itemStyle: {
        color: '#000'
      },
      regionHeight: 0.5
  }
}
getGeo(map){
  return{
    map:this.mapName,
    nameProperty: 'name_en',
    zoom: 1.2,
    emphasis: {
      itemStyle: {
        areaColor: '' // 设置为空字符串可使颜色不变
      },
      label: {
        show: false
      }
    },
    roam: true,
    itemStyle: {
      areaColor: '#F6F3F8',
      borderColor: '#302f8d00'
    }
  }
}

getSeries(){
  return []
}
getToolBox(){
  return {}
}
}
