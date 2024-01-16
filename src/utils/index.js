const twoPowerMaybeNum = generateTwoPowerMaybeNum()
export function aggregateIp(ipv4) {
    const prefix_ip = {}
    ipv4.forEach(ip => {
        const prefix = ip.split('/')[1]
        if (!prefix_ip[prefix]) {
            prefix_ip[prefix] = {}
        }
        prefix_ip[prefix][ip] = {}
    })
    return handlePrefixObj(prefix_ip)
}

function handlePrefixObj(prefixObj) {
    let mergeNum = 0
    const prefixRelateToIp = {
        0: 1,
        1: 128,
        2: 64,
        3: 32,
        4: 16,
        5: 8,
        6: 4,
        7: 2,
    }
    const prefixes = Object.keys(prefixObj)
    prefixes.sort((a, b) => b - a)
    prefixes.forEach((prefix, index) => {
        const ipPartIndex = Math.ceil(prefix / 8) - 1
        const IpMod = prefix % 8
        Object.keys(prefixObj[prefix]).forEach((ip, idx) => {
            const ipAndPrefix = ip.split('/')
            const ipArray = ipAndPrefix[0].split('.')
            const targetIpArray = [...ipArray]
            let targetIp = ''
            // if (IpMod === 0) {
            if ((IpMod === 0 && ipArray[ipPartIndex] % 2 === 0) || (IpMod !== 0 && twoPowerMaybeNum[prefixRelateToIp[IpMod]].indexOf(
                    ipArray[ipPartIndex]
                ) !== -1)) {
                targetIpArray[ipPartIndex] = String(
                    Number(ipArray[ipPartIndex]) + prefixRelateToIp[IpMod]
                )
            } else {
                targetIpArray[ipPartIndex] = String(
                    Number(ipArray[ipPartIndex]) - prefixRelateToIp[IpMod]
                )
            }
            targetIp = targetIpArray.join('.') + `/${prefix}`

            const targetIpObj = prefixObj[prefix][targetIp]
            if (targetIpObj) {
                mergeNum++
                const nextLevel = targetIpArray[ipPartIndex] > ipArray[ipPartIndex] ? ip : targetIp
                const nextLevelIp = nextLevel.split('/')[0]
                const nextLevelIpPrefix = nextLevelIp + `/${prefix - 1}`

                if (!prefixObj[prefix - 1]) {
                    prefixObj[prefix - 1] = {}
                }

                const targetObj = {}
                // targetObj[nextLevelIpPrefix] = {}
                targetObj[ip] = {
                    ...prefixObj[prefix][ip]
                }
                targetObj[targetIp] = {
                    ...targetIpObj
                }
                prefixObj[prefix - 1][nextLevelIpPrefix] = targetObj
                delete prefixObj[prefix][ip]
                delete prefixObj[prefix][targetIp]
            }
        })
    })
    return {
        prefixObj,
        mergeNum
    }
}

function generateTwoPowerMaybeNum() {
    const twoPower = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536]
    const twoPowerMaybeNum = {}
    twoPower.forEach((num, index) => {
        if (index <= 1) {
            return
        }
        twoPowerMaybeNum[twoPower[index - 1]] = []
        const array = [0]
        for (let i = index; i < twoPower.length; i++) {
            array.push(twoPower[i])
            for (let j = index + 1; j < twoPower.length; j++) {
                const maybeNum = twoPower[i] + twoPower[j]
                if (maybeNum < 255) {
                    array.push(twoPower[i] + twoPower[j])
                }
            }
        }
        array.sort((a, b) => a - b)
        twoPowerMaybeNum[twoPower[index - 1]] = [...new Set(array)]
    })
    return twoPowerMaybeNum
}

export function aggregateIpV6(ipv6) {
    const prefix_ip = {}
    ipv6.forEach(ip => {
        const prefix = ip.split('/')[1]
        if (!prefix_ip[prefix]) {
            prefix_ip[prefix] = {}
        }
        prefix_ip[prefix][ip] = {}
    })
    return handlePrefixObjV6(prefix_ip)
}


function handlePrefixObjV6(prefixObj) {
    let mergeNum = 0
    const prefixRelateToIp = {
        0: 1,
        1: 32768,
        2: 16384,
        3: 8192,
        4: 4096,
        5: 2048,
        6: 1024,
        7: 512,
        8: 256,
        9: 128,
        10: 64,
        11: 32,
        12: 16,
        13: 8,
        14: 4,
        15: 2,
    }
    const prefixes = Object.keys(prefixObj)
    prefixes.sort((a, b) => b - a)
    prefixes.forEach((prefix, index) => {
        const ipPartIndex = Math.ceil(prefix / 16) - 1
        const IpMod = prefix % 16
        Object.keys(prefixObj[prefix]).forEach((ip, idx) => {
            const ipAndPrefix = ip.split('::/')
            const ipArray = ipAndPrefix[0].split(':')
            const targetIpArray = [...ipArray]
            let targetIp = ''
            if ((IpMod === 0 && parseInt(ipArray[ipPartIndex], 16) % 2 === 0) || (IpMod !== 0 && twoPowerMaybeNum[prefixRelateToIp[IpMod]].indexOf(
                    parseInt(ipArray[ipPartIndex], 16)
                ) !== -1)) {
                targetIpArray[ipPartIndex] = Number(parseInt(ipArray[ipPartIndex], 16) + prefixRelateToIp[IpMod]).toString(16)
            } else {
                targetIpArray[ipPartIndex] = Number(parseInt(ipArray[ipPartIndex], 16) - prefixRelateToIp[IpMod]).toString(16)
            }
            targetIp = targetIpArray.join(':') + `::/${prefix}`
            const targetIpObj = prefixObj[prefix][targetIp]
            if (targetIpObj) {
                mergeNum++
                const nextLevel = parseInt(targetIpArray[ipPartIndex], 16) > parseInt(ipArray[ipPartIndex], 16) ? ip : targetIp
                const nextLevelIp = nextLevel.split('::/')[0]
                const nextLevelIpPrefix = nextLevelIp + `::/${prefix - 1}`

                if (!prefixObj[prefix - 1]) {
                    prefixObj[prefix - 1] = {}
                }

                const targetObj = {}
                targetObj[ip] = {
                    ...prefixObj[prefix][ip]
                }
                targetObj[targetIp] = {
                    ...targetIpObj
                }
                prefixObj[prefix - 1][nextLevelIpPrefix] = targetObj
                delete prefixObj[prefix][ip]
                delete prefixObj[prefix][targetIp]
            }
        })
    })
    return {
        prefixObj,
        mergeNum
    }
}