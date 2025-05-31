import React, { useState, useEffect, useRef, type ReactElement, type ReactNode } from ***REMOVED***react***REMOVED***

const [minWidth, maxWidth, defaultWidth] = [200, 500, 350]

const Sidebar = ({ children }: { children: ReactNode }): ReactElement => {
  const [width, setWidth] = useState(defaultWidth)
  const isResized = useRef(false)

  useEffect(() => {
    window.addEventListener(***REMOVED***mousemove***REMOVED***, (e) => {
      if (!isResized.current) {
        return
      }

      setWidth((previousWidth) => {
        const newWidth = previousWidth + e.movementX / 2

        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth

        return isWidthInRange ? newWidth : previousWidth
      })
    })

    window.addEventListener(***REMOVED***mouseup***REMOVED***, () => {
      isResized.current = false
    })
  }, [])

  return (
<div className="flex">
<div style={{ width: `${width / 16}rem` }} className="bg-neutral-700">
{children}
</div>

{/* Handle */}
<div
className="w-2 cursor-col-resize"
onMouseDown={() => {
  isResized.current = true
}}
/>
</div>
  )
}

export default Sidebar
