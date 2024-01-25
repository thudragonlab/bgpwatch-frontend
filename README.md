# BGPWatch-frontend

BGPWatch frontend developed using Vue2.

The BGPWatch platform has been developed by researchers and engineers from 19 countries/economies and funded by APNIC Foundation and the Chinese Government. The platform is accessible to the public at https://bgpwatch.cgtf.net.

The platform supports BGP hijack detection, provides swift response times, sends event warnings via email, assesses the severity of events, and provides event replay capabilities, which are all designed to effectively assist network operators. 

Additionally, the platform has developed various tools useful for network operators to monitor the network, including a dashboard displaying the key AS information, showing forward, reverse and bi-directional routing path.

### Install
```
yarn install
```

### Run
```
yarn serve
```

### Deploy
```
yarn build
```



	
### Directory Tree
- ***src***
  - **api**｜ API Interfaces
  - **assets**｜ Static Assests
  - **components**｜ Vue Components
  - **libs**｜ ElementUI Tools
  - **router**｜ Vue Router
  - **styles**｜ Global CSS Styles
  - **templates**｜ Echart Templates
  - **views**｜ Vue Pages
  - **App.vue**｜ Vue Homepage
  - **main**｜ Entry File

- ***tests***｜ Unit Tests
  - **components**｜ Components Unit Test Cases
  - **mockData**｜ Mock Data
  - **views**｜ Page Unit Test Cases
  - **setup.js**｜ Unit Test Configuration
	

### View

- ##### Home
  Display Hijack Events in the Last 7 Days
- ##### Anomaly
	- ##### Overview
    Daily/Monthly/Yearly Hijack Events Count
	- ##### Anomaly
    Search for Detailed Info on Hijack Events 
- ##### Dashboard
  Search for ASN-related Data (Peer, WHOIS, Prefix)
- ##### RoutingPath 
	- ##### Routing Path
  Search for AS Path info
	- ##### Reverse Routing Path
  Search for Reverse Routing Path
	- ##### Reverse Routing Path (TOPO)
  Search for Reverse Routing Path in Topological Format
	- ##### Bi-Routing Path
  Search for Bi-Directional AS Path between two Prefixes
	- ##### JitterRoute
  Search for Jitter Route Info on Peers
- ##### Tools
	- ##### Country/Region
  Search for AS Relationships between Countries/Regions
	- ##### Anomaly-moas
  Search for MOAS Events
- ##### Subscribe
  Get daily updates on AS, AS Path, and Prefix changes by subscribing to AS and Prefix.
- ##### Docs
	- ##### Document
  BGPWatch Platform User Manual
	- ##### API Doc
  BGPWatch API User Manual
