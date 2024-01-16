export const title = '202.127.237.0/24\n2023-06-08'
export const chartCategories = [
    "layer0",
    "layer1",
    "layer2",
    "layer3",
    "layer4",
    "layer5"
]
export const chartData = [{
        "name": "8888",
        "category": "layer5",
        "categoryIndex": 5,
        "country": "AU",
        "org": "xTom Pty Ltd",
        "asName": "XTOM",
        "symbolSize": -3,
        "itemStyle": {},
        "label": {
            "color": "#00000059",
            "show": true,
            "fontSize": 12,
            "fontWeight": "normal"
        },
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "3214",
        "category": "layer4",
        "categoryIndex": 4,
        "country": "DE",
        "org": "xTom GmbH",
        "asName": "XTOM",
        "symbolSize": 2,
        "itemStyle": {},
        "label": {
            "color": "#00000059",
            "show": true,
            "fontSize": 12,
            "fontWeight": "normal"
        },
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "10099",
        "category": "layer3",
        "categoryIndex": 3,
        "country": "HK",
        "org": "China Unicom (Hong Kong) Operations Limited",
        "asName": "UNICOM-Global",
        "symbolSize": 7,
        "itemStyle": {},
        "label": {
            "color": "#00000059",
            "show": true,
            "fontSize": 12,
            "fontWeight": "normal"
        },
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "9929",
        "category": "layer2",
        "categoryIndex": 2,
        "country": "CN",
        "org": "CHINA UNICOM Industrial Internet Backbone",
        "asName": "CUII",
        "symbolSize": 12,
        "itemStyle": {},
        "label": {
            "color": "#00000059",
            "show": true,
            "fontSize": 12,
            "fontWeight": "normal"
        },
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "4837",
        "category": "layer1",
        "categoryIndex": 1,
        "country": "CN",
        "org": "CHINA UNICOM Industrial Internet Backbone",
        "asName": "CHINA169-Backbone",
        "symbolSize": 17,
        "x": 500,
        "y": 1500,
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "202.127.237.0/24",
        "category": "layer0",
        "categoryIndex": 0,
        "country": "",
        "org": "",
        "asName": "",
        "symbolSize": 22,
        "x": 500,
        "y": 1500,
        "label": {
            "show": true,
            "fontSize": 15,
            "fontWeight": "bold"
        },
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 5,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "4538",
        "category": "layer0",
        "categoryIndex": 0,
        "country": "CN",
        "org": "China Education and Research Network Center",
        "asName": "ERX-CERNET-BKB",
        "symbolSize": 22,
        "x": 500,
        "y": 1500,
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    },
    {
        "name": "138373",
        "category": "layer0",
        "categoryIndex": 0,
        "country": "CN",
        "org": "China Education and Research Network (CERNET)",
        "asName": "CNGI-FZH-IX-AS-AP",
        "symbolSize": 22,
        "x": 500,
        "y": 1500,
        "emphasis": {
            "label": {
                "color": "#000",
                "show": true,
                "fontSize": 15,
                "fontWeight": "bold"
            },
            "itemStyle": {
                "borderColor": "#000",
                "borderWidth": 2,
                "shadowColor": "rgba(0, 0, 0, 0.5)",
                "shadowBlur": 10
            }
        }
    }
]
export const chartlinks = [{
        "source": "4538",
        "target": "138373",
        "lineStyle": {
            "color": "#696969",
            "width": 5
        }
    },
    {
        "source": "4837",
        "target": "4538",
        "lineStyle": {
            "color": "#696969",
            "width": 5
        }
    },
    {
        "source": "9929",
        "target": "4837",
        "lineStyle": {
            "color": "#aaa"
        }
    },
    {
        "source": "10099",
        "target": "9929",
        "lineStyle": {
            "color": "#aaa"
        }
    },
    {
        "source": "3214",
        "target": "10099",
        "lineStyle": {
            "color": "#aaa"
        }
    },
    {
        "source": "8888",
        "target": "3214",
        "lineStyle": {
            "color": "#aaa"
        }
    },
    {
        "source": "4538",
        "target": "202.127.237.0/24",
        "lineStyle": {
            "color": "red",
            "width": 10
        }
    },
    {
        "source": "138373",
        "target": "202.127.237.0/24",
        "lineStyle": {
            "color": "#300000",
            "width": 10
        }
    }
]
export const asPathDict = {
    "3214": [
        "202.127.237.0/24",
        "4538",
        "4837",
        "9929",
        "10099",
        "3214"
    ],
    "4538": [
        "202.127.237.0/24",
        "4538"
    ],
    "4837": [
        "202.127.237.0/24",
        "4538",
        "4837"
    ],
    "8888": [
        "202.127.237.0/24",
        "4538",
        "4837",
        "9929",
        "10099",
        "3214",
        "8888"
    ],
    "9929": [
        "202.127.237.0/24",
        "4538",
        "4837",
        "9929"
    ],
    "10099": [
        "202.127.237.0/24",
        "4538",
        "4837",
        "9929",
        "10099"
    ],
    "138373": [
        "202.127.237.0/24",
        "138373"
    ]
}
export const root = '202.127.237.0/24'

export const seriesTemplate = {"type":"graph","layout":"force","roam":"move","label":{"show":true,"position":"top","distance":0},"force":{"repulsion":100,"friction":0.1,"edgeLength":[100,300],"layoutAnimation":false,"initLayout":"circular"},"edgeSymbolSize":6}
export const seriesData = [{"type":"graph","layout":"force","roam":"move","label":{"show":true,"position":"top","distance":0},"force":{"repulsion":100,"friction":0.1,"edgeLength":[100,300],"layoutAnimation":false,"initLayout":"circular"},"edgeSymbolSize":6,"data":[],"links":[]}]
export const seriesData2 =  [{"type":"graph","layout":"circular","roam":"move","label":{"show":true,"position":"top","distance":0},"force":{"repulsion":100,"friction":0.1,"edgeLength":[100,300],"layoutAnimation":false,"initLayout":"circular"},"edgeSymbolSize":6,"data":[{"category":"category1","value":1,"itemStyle":{},"label":{"show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}},{"category":"category2","value":2,"itemStyle":{},"label":{"show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}},{"category":"category3","value":3,"itemStyle":{},"label":{"show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}],"links":[{"source":"4538","target":"138373","lineStyle":{"color":"#aaa"}},{"source":"4837","target":"4538","lineStyle":{"color":"#aaa"}},{"source":"9929","target":"4837","lineStyle":{"color":"#aaa"}},{"source":"10099","target":"9929","lineStyle":{"color":"#aaa"}},{"source":"3214","target":"10099","lineStyle":{"color":"#aaa"}},{"source":"8888","target":"3214","lineStyle":{"color":"#aaa"}},{"source":"4538","target":"202.127.237.0/24","lineStyle":{"color":"#aaa"}},{"source":"138373","target":"202.127.237.0/24","lineStyle":{"color":"#aaa"}}]}]
export const dataExpect1 = [{
    name: 'Root',
    category: 'root',
    x: 500,
    y: 1500,
    label: {
        show: true,
        fontSize: 15,
        fontWeight: 'bold',
    },
    emphasis: {
        scale: false,
        itemStyle: {
            borderColor: '#000',
            borderWidth: 5,
        },
    },
}]
export const dataExpect2 = [{"name":"Root","category":"root","categoryIndex":0,"x":500,"y":1500,"emphasis":{"scale":false}}]
export const dataExpect3 = [{"name":"Root","category":"root","itemStyle":{"color":"#000"},"label":{"show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}]
export const dataExpect4 = [{"name":"Root","category":"root","x":500,"y":1500,"label":{"show":true,"fontSize":15,"fontWeight":"bold"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":5,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}]
export const dataExpect5 = [{"name":"Root","category":"root","categoryIndex":0,"x":500,"y":1500,"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}]
export const dataExpect6 = [{"name":"Root","category":"root","itemStyle":{"color":"#000"},"label":{"show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}]
export const dataExpect7 = [{"name":"Root","category":"root","itemStyle":{},"label":{"color":"#00000059","show":true,"fontSize":12,"fontWeight":"normal"},"emphasis":{"label":{"color":"#000","show":true,"fontSize":15,"fontWeight":"bold"},"itemStyle":{"borderColor":"#000","borderWidth":2,"shadowColor":"rgba(0, 0, 0, 0.5)","shadowBlur":10}}}]

export const linkExpect1 = [{
    source: 'source1',
    target: 'target1',
    lineStyle: {
        color: 'red',
        width: 5
    },
},
{
    source: 'target1',
    target: 'source1',
    lineStyle: {
        color: '#696969',
        width: 5
    },
},
{
    source: 'source2',
    target: 'target2',
    lineStyle: {
        color: '#aaa'
    },
},
{
    source: 'target2',
    target: 'source2',
    lineStyle: {
        color: '#aaa'
    },
},
]
export const linkExpect2 =     [{"source":"source1","target":"target1","lineStyle":{"color":"red","width":10}},{"source":"target1","target":"source1","lineStyle":{"color":"#696969","width":5}},{"source":"source2","target":"target2","lineStyle":{"color":"#aaa"}},{"source":"target2","target":"source2","lineStyle":{"color":"#aaa"}}]
export const linkExpect3 =     [{"source":"source1","target":"target1","lineStyle":{"color":"red","width":3}},{"source":"target1","target":"source1","lineStyle":{"color":"#aaa"}},{"source":"source2","target":"target2","lineStyle":{"color":"#aaa"}},{"source":"target2","target":"source2","lineStyle":{"color":"#aaa"}}]
export const linkExpect4 =     [{"source":"source1","target":"target1","lineStyle":{"color":"#aaa"}},{"source":"target1","target":"source1","lineStyle":{"color":"#aaa"}},{"source":"source2","target":"target2","lineStyle":{"color":"#300000","width":10}},{"source":"target2","target":"source2","lineStyle":{"color":"#696969","width":5}}]