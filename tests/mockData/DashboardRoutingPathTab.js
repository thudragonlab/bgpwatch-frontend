export const getAsPathByPrefix = {
    "layer": [
        [
            "4538"
        ],
        [
            "23911"
        ],
        [
            "11537"
        ],
        [
            "29384",
            "22335"
        ],
        [
            "103"
        ]
    ],
    "links": [{
            "source": "4538",
            "target": "23911"
        },
        {
            "source": "23911",
            "target": "11537"
        },
        {
            "source": "11537",
            "target": "22335"
        },
        {
            "source": "22335",
            "target": "103"
        },
        {
            "source": "11537",
            "target": "29384"
        }
    ],
    "result": {
        "165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20": {
            "layer": [
                "4538",
                "23911",
                "11537",
                "22335",
                "103"
            ],
            "links": [{
                    "source": "4538",
                    "target": "23911"
                },
                {
                    "source": "23911",
                    "target": "11537"
                },
                {
                    "source": "11537",
                    "target": "22335"
                },
                {
                    "source": "22335",
                    "target": "103"
                }
            ]
        },
        "165.124.188.0/22_165.124.236.0/22": {
            "layer": [
                "4538",
                "23911",
                "11537",
                "29384"
            ],
            "links": [{
                    "source": "4538",
                    "target": "23911"
                },
                {
                    "source": "23911",
                    "target": "11537"
                },
                {
                    "source": "11537",
                    "target": "29384"
                }
            ]
        }
    }
}

export const getPrefixTotalByAsn = {
    "total": 1108891
}

export const getAsInfoByList = {
    "103": {
        "announcingNumberAddresses": 149760,
        "cone": 1,
        "country": "US",
        "name": "NWU-AS",
        "org": "Northwestern University",
        "rank": 11979
    },
    "4538": {
        "announcingNumberAddresses": 17187328,
        "cone": 28,
        "country": "CN",
        "name": "ERX-CERNET-BKB",
        "org": "China Education and Research Network Center",
        "rank": 1115
    },
    "11537": {
        "announcingNumberAddresses": 86920625,
        "cone": 963,
        "country": "US",
        "name": "INTERNET2-RESEARCH-EDU",
        "org": "Internet2",
        "rank": 57
    },
    "22335": {
        "announcingNumberAddresses": 1227521,
        "cone": 17,
        "country": "US",
        "name": "MREN",
        "org": "Metropolitan Research and Education Network",
        "rank": 1632
    },
    "23911": {
        "announcingNumberAddresses": 7936,
        "cone": 3,
        "country": "CN",
        "name": "CNGI-BJIX-AS-AP",
        "org": "China Next Generation Internet Beijing IX",
        "rank": 6174
    },
    "29384": {
        "announcingNumberAddresses": 135168,
        "cone": 1,
        "country": "QA",
        "name": "Qatar-Foundation",
        "org": "Qatar Foundation for Education, Science and Community Development",
        "rank": 12040
    }
}

export const handleLinksResult =[{"source":"4538","target":"23911","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"},{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"},{"offset":0.5,"color":"#ffffff30"}],"global":false},"width":10}},{"source":"23911","target":"11537","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"},{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"},{"offset":0.5,"color":"#ffffff30"}],"global":false},"width":10}},{"source":"11537","target":"22335","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":9}},{"source":"22335","target":"103","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":9}},{"source":"11537","target":"29384","prefixList":[{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":2}}]

export const seriesResult =  [{"name":"Test","data":[{"name":"4538","x":0,"y":0,"index":0,"itemStyle":{"color":"#5470c6"},"asName":"ERX-CERNET-BKB","org":"China Education and Research Network Center","country":"CN"},{"name":"23911","x":100,"y":0,"index":1,"itemStyle":{"color":"#5470c6"},"asName":"CNGI-BJIX-AS-AP","org":"China Next Generation Internet Beijing IX","country":"CN"},{"name":"11537","x":200,"y":0,"index":2,"itemStyle":{"color":"#5470c6"},"asName":"INTERNET2-RESEARCH-EDU","org":"Internet2","country":"US"},{"name":"29384","x":300,"y":33.333333333333336,"index":3,"itemStyle":{"color":"#5470c6"},"asName":"Qatar-Foundation","org":"Qatar Foundation for Education, Science and Community Development","country":"QA"},{"name":"22335","x":300,"y":-33.333333333333336,"index":4,"itemStyle":{"color":"#5470c6"},"asName":"MREN","org":"Metropolitan Research and Education Network","country":"US"},{"name":"103","x":400,"y":0,"index":5,"itemStyle":{"color":"#5470c6"},"asName":"NWU-AS","org":"Northwestern University","country":"US"}],"links":[{"source":"4538","target":"23911","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"},{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"},{"offset":0.5,"color":"#ffffff30"}],"global":false},"width":10}},{"source":"23911","target":"11537","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"},{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"},{"offset":0.5,"color":"#ffffff30"}],"global":false},"width":10}},{"source":"11537","target":"22335","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":9}},{"source":"22335","target":"103","prefixList":[{"prefixs":"165.124.0.0/17_165.124.128.0/19_165.124.160.0/20_165.124.176.0/21_165.124.184.0/22_165.124.192.0/19_165.124.224.0/21_165.124.232.0/22_165.124.240.0/20","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":9}},{"source":"11537","target":"29384","prefixList":[{"prefixs":"165.124.188.0/22_165.124.236.0/22","color":"#ffffff"}],"lineStyle":{"color":{"type":"linear","x":1,"y":0,"x2":0,"y2":0,"colorStops":[{"offset":0,"color":"#ffffff30"}],"global":false},"width":2}}],"center":[200,0],"width":-300}]