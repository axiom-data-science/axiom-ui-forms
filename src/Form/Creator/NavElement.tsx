import { Button, utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

const NavElement = ({
  className,
  children,
  path,
  id,
  navigable = true,
  onClick
}: {
  className?: string
  overrideClassName?: string
  navigable?: boolean
  children: ReactNode
  path: string
  id: string
  onClick?: () => void
}): ReactElement => {
  return (
    navigable
      ? <Link to={`${path !== '' ? `${path}/` : ''}${id}`} className={utils.createButtonClass({
        className
      })}>{children}</Link>
      : <Button className={className} onClick={onClick}>{children}</Button>

  )
}

export default NavElement
