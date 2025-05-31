import LarvalForm from '@/PTT/Larval/LarvalForm'
import LeewayForm from '@/PTT/Leeway/LeewayForm'
import OceanDriftForm from '@/PTT/OceanDrift/OceanDriftForm'
import OilForm from '@/PTT/Oil/OilForm'
import { Tabs } from '@axdspub/axiom-ui-utilities'

import React, { type ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const tabs = [
  {
    id: 'oil-model',
    label: 'Oil Model',
    content: <OilForm />
  },
  {
    id: 'larval-model',
    label: 'Larval Fish Model',
    content: <LarvalForm />
  },
  {
    id: 'ocean-drift-model',
    label: 'Ocean Drift Model',
    content: <OceanDriftForm />
  },
  {
    id: 'leeway-model',
    label: 'Leeway Model',
    content: <LeewayForm />
  }
]
const tabMap = Object.fromEntries(tabs.map(tab => [tab.id, tab]))

const AllPTT = (): ReactElement => {
  const defaultScenario = 'oil-model'
  const scenario = useParams().scenario ?? defaultScenario
  return (
        <Tabs
            className='h-full flex flex-col'
            navClassName='bg-slate-900 text-white'
            activeTabNavClassName='bg-slate-600'
            selectedTab={tabMap[scenario] !== undefined ? scenario : defaultScenario}
            onChange={(id: string) => {
              const currentUrl = new URL(window.location.href)
              const parts = currentUrl.pathname.split('/').filter(d => d !== '')
              parts[1] = id
              const newPath = `/${parts.join('/')}`
              if (newPath !== currentUrl.pathname) {
                window.history.replaceState(null, '', newPath)
              }
            }}
            tabs={tabs}
            />
  )
}

export default AllPTT
