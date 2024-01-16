export const subdata = {
    "affacted_as_dict": {
        "174": {
            "announcingNumberAddresses": 1417679878,
            "cone": 36870,
            "country": "US",
            "name": "COGENT-174",
            "org": "Cogent Communications",
            "rank": 3
        },
        "3356": {
            "announcingNumberAddresses": 2133503614,
            "cone": 49212,
            "country": "US",
            "name": "LEVEL3",
            "org": "Level 3 Parent, LLC",
            "rank": 1
        },
        "6939": {
            "announcingNumberAddresses": 689317230,
            "cone": 23822,
            "country": "US",
            "name": "HURRICANE",
            "org": "Hurricane Electric LLC",
            "rank": 4
        },
        "12956": {
            "announcingNumberAddresses": 172362674,
            "cone": 5263,
            "country": "ES",
            "name": "TELXIUS",
            "org": "TELEFONICA GLOBAL SOLUTIONS SL",
            "rank": 15
        },
        "22927": {
            "announcingNumberAddresses": 9467248,
            "cone": 293,
            "country": "AR",
            "name": "",
            "org": "Telefonica de Argentina",
            "rank": 167
        },
        "28075": {
            "announcingNumberAddresses": 75776,
            "cone": 2,
            "country": "AR",
            "name": "",
            "org": "ARLINK S.A.",
            "rank": 7327
        },
        "34927": {
            "announcingNumberAddresses": 55305,
            "cone": 78,
            "country": "CH",
            "name": "iFog-GmbH",
            "org": "iFog GmbH",
            "rank": 521
        },
        "47787": {
            "announcingNumberAddresses": 946440,
            "cone": 37,
            "country": "US",
            "name": "EDGOO",
            "org": "EDGOO NETWORKS LLC",
            "rank": 921
        },
        "49134": {
            "announcingNumberAddresses": 0,
            "cone": 1,
            "country": "GB",
            "name": "AS_10VPN",
            "org": "10VPN Research Network LTD",
            "rank": 74684
        },
        "53356": {
            "announcingNumberAddresses": 57600,
            "cone": 20,
            "country": "CA",
            "name": "FREE RANGE CLOUD",
            "org": "Free Range Cloud Hosting Inc.",
            "rank": 1482
        },
        "56655": {
            "announcingNumberAddresses": 69379,
            "cone": 35,
            "country": "NO",
            "name": "TERRAHOST",
            "org": "TerraHost AS",
            "rank": 970
        }
    },
    "after_as": "174",
    "before_as": "174",
    "before_as_country": "US",
    "before_as_description": "COGENT-174",
    "confirm": [
        "64262090457da4468fb57da9"
    ],
    "duration": "0:1:29",
    "end_datetime": "2023-04-12 15:48:01",
    "end_time": "2023-04-12 15:48:01",
    "end_timestamp": 1681314481,
    "event_id": "38.52.64.0/24-hijack1681314392",
    "event_info": "UTC time 1681314392.0 AS174(COGENT-174,US)prefix 38.52.64.0/24 hijack by AS28075(,AR).The event ended at 1681314481.0,which last 0:1:29s.The event is at a low level as .",
    "event_type": "Possible Hijack",
    "hijack_as": "28075",
    "hijack_as_country": "AR",
    "hijack_as_description": "",
    "hijacker_as": "28075",
    "hijacker_as_country": "AR",
    "hijacker_as_description": "",
    "is_hijack": true,
    "level": "low",
    "level_reason": "",
    "logging": {
        "64262090457da4468fb57da9": {
            "accept/reject": "accept",
            "date": 1691043438973.2612,
            "description": "-",
            "user": "pzd"
        },
        "64262090457da4468fb17da9": {
            "accept/reject": "reject",
            "date": 16910434389732.2612,
            "description": "???",
            "user": "pz2d"
        },
    },
    "moas_set": [
        "28075",
        "174"
    ],
    "prefix": "38.52.64.0/24",
    "prefix_list": [
        "38.52.64.0/24"
    ],
    "reason": "possible hijack",
    "reject": {},
    "replay": {
        "1681314392": {
            "community": "",
            "path_list": [
                "34927 56655 3356 174",
                "49134 53356 6939 12956 22927 28075"
            ],
            "stat": {
                "174": 1,
                "28075": 1
            }
        },
        "1681314481": {
            "community": "174:21101 174:22005 47787:1020 47787:3090 47787:10000 47787:10010",
            "path_list": [
                "34927 56655 3356 174",
                "49134 53356 47787 174"
            ],
            "stat": {
                "174": 2
            }
        },
        "-1": {
            "path_list": [
                "34927 56655 3356 174"
            ],
            "stat": {
                "174": 1
            }
        }
    },
    "start_datetime": "2023-04-12 15:46:32",
    "start_time": "2023-04-12 15:46:32",
    "start_timestamp": 1681314392,
    "suspicious_as": "28075",
    "suspicious_as_country": "AR",
    "suspicious_as_description": "",
    "victim_as": "174",
    "victim_as_country": "US",
    "victim_as_description": "COGENT-174",
    "websites": [],
    "eventType": 0
}

export const sourceData = [{
    "name": "accept",
    "value": 1,
    "itemStyle": {
        "color": "#91cc75"
    }
}, {
    "name": "reject",
    "value": 1,
    "itemStyle": {
        "color": "#ee6666"
    }
}]
export const loggingTable = [{"accept/reject":"accept","date":1691043438973.2612,"description":"-","user":"pzd","user_id":"64262090457da4468fb57da9","rowId":"0"},{"accept/reject":"reject","date":16910434389732.262,"description":"???","user":"pz2d","user_id":"64262090457da4468fb17da9","rowId":"1"}]