export const getRouteByIP = {
    "l2r": {
        "links": [{
                "source": "4635",
                "target": "4538"
            },
            {
                "source": "6939",
                "target": "4635"
            },
            {
                "source": "51531",
                "target": "6939"
            },
            {
                "source": "196610",
                "target": "51531"
            },
            {
                "source": "49697",
                "target": "196610"
            },
            {
                "source": "41047",
                "target": "49697"
            }
        ],
        "nodes": [
            [
                "4538"
            ],
            [
                "4635"
            ],
            [
                "6939"
            ],
            [
                "51531"
            ],
            [
                "196610"
            ],
            [
                "49697"
            ],
            [
                "41047"
            ]
        ]
    },
    "r2l": {
        "links": [{
                "source": "50629",
                "target": "41047"
            },
            {
                "source": "2914",
                "target": "50629"
            },
            {
                "source": "4538",
                "target": "2914"
            }
        ],
        "nodes": [
            [
                "4538"
            ],
            [
                "2914"
            ],
            [
                "50629"
            ],
            [
                "41047"
            ]
        ]
    }
}

export const getAsInfoByList = {
    "2914": {
        "announcingNumberAddresses": 1009605239,
        "cone": 19815,
        "country": "US",
        "name": "NTT-LTD-2914",
        "org": "NTT America, Inc.",
        "rank": 6
    },
    "4538": {
        "announcingNumberAddresses": 17187328,
        "cone": 28,
        "country": "CN",
        "name": "ERX-CERNET-BKB",
        "org": "China Education and Research Network Center",
        "rank": 1115
    },
    "4635": {
        "announcingNumberAddresses": 0,
        "cone": 1,
        "country": "HK",
        "name": "HKIX-RS1",
        "org": "The Hong Kong Internet Exchange Limited",
        "rank": 75328
    },
    "41047": {
        "announcingNumberAddresses": 512,
        "cone": 2,
        "country": "NL",
        "name": "NL-MLAB",
        "org": "Bart Vrancken trading as MLaB",
        "rank": 11385
    },
    "49697": {
        "announcingNumberAddresses": 10240,
        "cone": 22,
        "country": "DE",
        "name": "Joey-Network",
        "org": "Joey Julian Koenig",
        "rank": 1368
    },
    "50629": {
        "announcingNumberAddresses": 14520113,
        "cone": 129,
        "country": "DE",
        "name": "LWLCOM",
        "org": "LWLcom GmbH",
        "rank": 335
    },
    "51531": {
        "announcingNumberAddresses": 11008,
        "cone": 3,
        "country": "DE",
        "name": "DECIX-MGMT-AS",
        "org": "DE-CIX Management GmbH",
        "rank": 6044
    },
    "196610": {
        "announcingNumberAddresses": 11008,
        "cone": 22,
        "country": "DE",
        "name": "DECIX-Academy",
        "org": "DE-CIX Management GmbH",
        "rank": 1367
    }
}

export const l2rSeries = [{
    "type": "graph",
    "links": [{
        "source": "4635",
        "target": "4538"
    }, {
        "source": "6939",
        "target": "4635"
    }, {
        "source": "51531",
        "target": "6939"
    }, {
        "source": "196610",
        "target": "51531"
    }, {
        "source": "49697",
        "target": "196610"
    }, {
        "source": "41047",
        "target": "49697"
    }, {
        "target": "115.24.128.0/17",
        "source": "4538"
    }, {
        "source": "87.237.165.0/24",
        "target": "41047"
    }],
    "data": [{
        "name": "115.24.128.0/17",
        "y": -0,
        "x": -50,
        "symbol": "rect",
        "symbolSize": [120, 50],
        "symbolOffset": [-20, 0]
    }, {
        "name": "4538",
        "asName": "ERX-CERNET-BKB",
        "org": "China Education and Research Network Center",
        "country": "CN",
        "y": -0,
        "x": 0
    }, {
        "name": "4635",
        "asName": "HKIX-RS1",
        "org": "The Hong Kong Internet Exchange Limited",
        "country": "HK",
        "y": -0,
        "x": 50
    }, {
        "name": "6939",
        "asName": "Unknown",
        "org": "Unknown",
        "country": "Unknown",
        "y": -0,
        "x": 100
    }, {
        "name": "51531",
        "asName": "DECIX-MGMT-AS",
        "org": "DE-CIX Management GmbH",
        "country": "DE",
        "y": -0,
        "x": 150
    }, {
        "name": "196610",
        "asName": "DECIX-Academy",
        "org": "DE-CIX Management GmbH",
        "country": "DE",
        "y": -0,
        "x": 200
    }, {
        "name": "49697",
        "asName": "Joey-Network",
        "org": "Joey Julian Koenig",
        "country": "DE",
        "y": -0,
        "x": 250
    }, {
        "name": "41047",
        "asName": "NL-MLAB",
        "org": "Bart Vrancken trading as MLaB",
        "country": "NL",
        "y": -0,
        "x": 300
    }, {
        "name": "87.237.165.0/24",
        "y": 0,
        "x": 350,
        "symbol": "rect",
        "symbolSize": [120, 50],
        "symbolOffset": [20, 0]
    }],
    "width": -500
}]



export const r2lSeries = [{
    "type": "graph",
    "links": [{
        "source": "50629",
        "target": "41047"
    }, {
        "source": "2914",
        "target": "50629"
    }, {
        "source": "4538",
        "target": "2914"
    }, {
        "target": "4538",
        "source": "115.24.128.0/17"
    }, {
        "target": "87.237.165.0/24",
        "source": "41047"
    }],
    "data": [{
        "name": "115.24.128.0/17",
        "y": -0,
        "x": -50,
        "symbol": "rect",
        "symbolSize": [120, 50],
        "symbolOffset": [-20, 0]
    }, {
        "name": "4538",
        "asName": "ERX-CERNET-BKB",
        "org": "China Education and Research Network Center",
        "country": "CN",
        "y": -0,
        "x": 0
    }, {
        "name": "2914",
        "asName": "NTT-LTD-2914",
        "org": "NTT America, Inc.",
        "country": "US",
        "y": -0,
        "x": 50
    }, {
        "name": "50629",
        "asName": "LWLCOM",
        "org": "LWLcom GmbH",
        "country": "DE",
        "y": -0,
        "x": 100
    }, {
        "name": "41047",
        "asName": "NL-MLAB",
        "org": "Bart Vrancken trading as MLaB",
        "country": "NL",
        "y": -0,
        "x": 150
    }, {
        "name": "87.237.165.0/24",
        "y": 0,
        "x": 200,
        "symbol": "rect",
        "symbolSize": [120, 50],
        "symbolOffset": [20, 0]
    }],
    "width": -500
}]