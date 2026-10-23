import { Button, utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement, type ReactNode } from 'react'
import { useFormSectionContext } from '@/Form/Creator/FormSectionContextProvider'

const NavElement = ({
  className,
  children,
  id,
  navigable = true,
  onClick
}: {
  className?: string
  overrideClassName?: string
  navigable?: boolean
  children: ReactNode
  id: string
  onClick?: () => void
}): ReactElement => {
  const { getSectionUrl } = useFormSectionContext()
  return (
    navigable
      ? <a
        href={getSectionUrl(id)}
        onClick={(event) => {
          if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return
          }
          event.preventDefault()
          onClick?.()
        }}
        className={utils.createButtonClass({ className })}
      >{children}</a>
      : <Button className={className} onClick={onClick}>{children}</Button>

  )
}

export default NavElement
