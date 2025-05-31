import LarvalForm from ***REMOVED***@/PTT/Larval/LarvalForm***REMOVED***
import LeewayForm from ***REMOVED***@/PTT/Leeway/LeewayForm***REMOVED***
import OceanDriftForm from ***REMOVED***@/PTT/OceanDrift/OceanDriftForm***REMOVED***
import OilForm from ***REMOVED***@/PTT/Oil/OilForm***REMOVED***
import { Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***

const tabs = [
  {
    id: ***REMOVED***oil-model***REMOVED***,
    label: ***REMOVED***Oil Model***REMOVED***,
    content: <OilForm />
  },
  {
    id: ***REMOVED***larval-model***REMOVED***,
    label: ***REMOVED***Larval Fish Model***REMOVED***,
    content: <LarvalForm />
  },
  {
    id: ***REMOVED***ocean-drift-model***REMOVED***,
    label: ***REMOVED***Ocean Drift Model***REMOVED***,
    content: <OceanDriftForm />
  },
  {
    id: ***REMOVED***leeway-model***REMOVED***,
    label: ***REMOVED***Leeway Model***REMOVED***,
    content: <LeewayForm />
  }
]
const tabMap = Object.fromEntries(tabs.map(tab => [tab.id, tab]))

const AllPTT = (): ReactElement => {
  const defaultScenario = ***REMOVED***oil-model***REMOVED***
  const scenario = useParams().scenario ?? defaultScenario
  return (
        <Tabs
            className=***REMOVED***h-full flex flex-col***REMOVED***
            navClassName=***REMOVED***bg-slate-900 text-white***REMOVED***
            activeTabNavClassName=***REMOVED***bg-slate-600***REMOVED***
            selectedTab={tabMap[scenario] !== undefined ? scenario : defaultScenario}
            onChange={(id: string) => {
              const currentUrl = new URL(window.location.href)
              const parts = currentUrl.pathname.split(***REMOVED***/***REMOVED***).filter(d => d !== ***REMOVED******REMOVED***)
              parts[1] = id
              const newPath = `/${parts.join(***REMOVED***/***REMOVED***)}`
              if (newPath !== currentUrl.pathname) {
                window.history.replaceState(null, ***REMOVED******REMOVED***, newPath)
              }
            }}
            tabs={tabs}
            />
  )
}

export default AllPTT
