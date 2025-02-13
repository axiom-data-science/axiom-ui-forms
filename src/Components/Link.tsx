import { utils } from '@axdspub/axiom-ui-utilities'
import React from 'react'
import { type ReactElement } from 'react'
import { type LinkProps, Link as RouterLink } from 'react-router-dom'

const Link = (props: LinkProps): ReactElement => {
  return <RouterLink {...props} className={utils.makeClassName({
    className: props.className,
    defaultClassName: 'text-blue-700 font-bold hover:underline'
  })} />
}

export default Link
