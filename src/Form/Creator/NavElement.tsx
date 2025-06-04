import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement, type ReactNode } from ***REMOVED***react***REMOVED***
import { Link } from ***REMOVED***react-router-dom***REMOVED***

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
      ? <Link to={`${path !== ***REMOVED******REMOVED*** ? `${path}/` : ***REMOVED******REMOVED***}${id}`} className={utils.createButtonClass({
        className
      })}>{children}</Link>
      : <Button className={className} onClick={onClick}>{children}</Button>

  )
}

export default NavElement
