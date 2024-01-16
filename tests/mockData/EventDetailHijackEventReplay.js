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
        "2386": {
            "announcingNumberAddresses": 437264,
            "cone": 6,
            "country": "US",
            "name": "INS-AS",
            "org": "AT&T Data Communications Services",
            "rank": 3427
        },
        "3257": {
            "announcingNumberAddresses": 852381572,
            "cone": 18336,
            "country": "NL",
            "name": "GTT-BACKBONE",
            "org": "GTT Communications Inc.",
            "rank": 7
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
        "7018": {
            "announcingNumberAddresses": 305891370,
            "cone": 2916,
            "country": "US",
            "name": "ATT-INTERNET4",
            "org": "AT&T Services, Inc.",
            "rank": 26
        },
        "7843": {
            "announcingNumberAddresses": 53651568,
            "cone": 960,
            "country": "US",
            "name": "TWC-7843-BB",
            "org": "Charter Communications Inc",
            "rank": 58
        },
        "11426": {
            "announcingNumberAddresses": 9224216,
            "cone": 93,
            "country": "US",
            "name": "TWC-11426-CAROLINAS",
            "org": "Charter Communications Inc",
            "rank": 456
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
        },
        "395350": {
            "announcingNumberAddresses": 0,
            "cone": 1,
            "country": "",
            "name": "",
            "org": "Unknown",
            "rank": 74823
        }
    },
    "after_as": "395350",
    "before_as": "395350",
    "before_as_country": "",
    "before_as_description": "",
    "duration": "0:0:3",
    "end_datetime": "2023-04-12 15:47:54",
    "end_time": "2023-04-12 15:47:54",
    "end_timestamp": 1681314474,
    "event_id": "23.141.0.0/24-hijack1681314471",
    "event_info": "UTC time 1681314471.0 AS395350(,)prefix 23.141.0.0/24 hijack by AS2386(INS-AS,US).The event ended at 1681314474.0,which last 0:0:3s.The event is at a low level as .",
    "event_type": "Possible Hijack",
    "hijack_as": "2386",
    "hijack_as_country": "US",
    "hijack_as_description": "INS-AS",
    "hijacker_as": "2386",
    "hijacker_as_country": "US",
    "hijacker_as_description": "INS-AS",
    "is_hijack": true,
    "level": "low",
    "level_reason": "",
    "moas_set": [
        "2386",
        "395350"
    ],
    "prefix": "23.141.0.0/24",
    "prefix_list": [
        "23.141.0.0/24"
    ],
    "reason": "possible hijack",
    "replay": {
        "1681314471": {
            "community": "",
            "path_list": [
                "34927 56655 3356 7843 11426 395350",
                "49134 53356 6939 7018 2386 2386 2386 2386 2386"
            ],
            "stat": {
                "2386": 1,
                "395350": 1
            }
        },
        "1681314474": {
            "community": "174:21000 174:22013 47787:1020 47787:3090 47787:10000 47787:10010",
            "path_list": [
                "34927 56655 3356 7843 11426 395350",
                "49134 53356 47787 174 3257 7843 11426 395350"
            ],
            "stat": {
                "395350": 2
            }
        },
        "-1": {
            "path_list": [
                "34927 56655 3356 7843 11426 395350"
            ],
            "stat": {
                "395350": 1
            }
        }
    },
    "start_datetime": "2023-04-12 15:47:51",
    "start_time": "2023-04-12 15:47:51",
    "start_timestamp": 1681314471,
    "suspicious_as": "2386",
    "suspicious_as_country": "US",
    "suspicious_as_description": "INS-AS",
    "victim_as": "395350",
    "victim_as_country": "",
    "victim_as_description": "",
    "websites": [],
    "eventType": 0
}

export const linkArray = [{
    "from": "34927",
    "to": "56655"
}, {
    "from": "56655",
    "to": "3356"
}, {
    "from": "3356",
    "to": "7843"
}, {
    "from": "7843",
    "to": "11426"
}, {
    "from": "11426",
    "to": "395350"
}]

export const nodes = ["34927", "56655", "3356", "7843", "11426", "395350"]

export const timeSelection = [{"value":"-1","label":"Before event"},{"value":"1681314471","label":"Wed, 12 Apr 2023 15:47:51 GMT"},{"value":"1681314474","label":"Wed, 12 Apr 2023 15:47:54 GMT"}]

export const hijackData = {"1681314471":[{"links":[{"from":"49134","to":"53356"},{"from":"53356","to":"6939"},{"from":"6939","to":"7018"},{"from":"7018","to":"2386"},{"from":"2386","to":"2386"},{"from":"2386","to":"2386"},{"from":"2386","to":"2386"},{"from":"2386","to":"2386"}],"nodes":["49134","53356","6939","7018","2386","2386","2386","2386","2386"]},{"links":[{"from":"34927","to":"56655"},{"from":"56655","to":"3356"},{"from":"3356","to":"7843"},{"from":"7843","to":"11426"},{"from":"11426","to":"395350"}],"nodes":["34927","56655","3356","7843","11426","395350"]}],"1681314474":[{"links":[{"from":"34927","to":"56655"},{"from":"56655","to":"3356"},{"from":"3356","to":"7843"},{"from":"7843","to":"11426"},{"from":"11426","to":"395350"},{"from":"49134","to":"53356"},{"from":"53356","to":"47787"},{"from":"47787","to":"174"},{"from":"174","to":"3257"},{"from":"3257","to":"7843"},{"from":"7843","to":"11426"},{"from":"11426","to":"395350"}],"nodes":["34927","56655","3356","7843","11426","395350","49134","53356","47787","174","3257","7843","11426","395350"]}],"-1":[{"links":[{"from":"34927","to":"56655"},{"from":"56655","to":"3356"},{"from":"3356","to":"7843"},{"from":"7843","to":"11426"},{"from":"11426","to":"395350"}],"nodes":["34927","56655","3356","7843","11426","395350"]}]}