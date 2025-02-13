import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React from ***REMOVED***react***REMOVED***
import { type ReactElement } from ***REMOVED***react***REMOVED***
import { type LinkProps, Link as RouterLink } from ***REMOVED***react-router-dom***REMOVED***

const Link = (props: LinkProps): ReactElement => {
  return <RouterLink {...props} className={utils.makeClassName({
    className: props.className,
    defaultClassName: ***REMOVED***text-blue-700 font-bold hover:underline***REMOVED***
  })} />
}

export default Link
