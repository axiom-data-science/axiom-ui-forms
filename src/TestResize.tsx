import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { ThickArrowLeftIcon, ThickArrowRightIcon } from '@radix-ui/react-icons'
import React, { useState, type ReactElement } from 'react'

const ResizableSidebar = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(500)
  return (
    <>
    {
        !open
          ? <Tooltip content='Open Sidebar' className='fixed top-4 right-4'><ThickArrowLeftIcon className='cursor-pointer w-12 h-12' onClick={() => { setOpen(true) }} /></Tooltip>
          : ''
    }
    {
        open
          ? <div className='bg-blue-500 h-full fixed top-0 right-0 z-50 p-4 shadow-lg' style={{ width: `${sidebarWidth}px` }}>
            <div
                className='absolute top-0 left-0 h-full bg-blue-600 cursor-ew-resize'
                style={{ width: '5px' }}
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startWidth = sidebarWidth

                  const onMouseMove = (event: MouseEvent): void => {
                    const newWidth = Math.max(200, startWidth - (event.clientX - startX))
                    setSidebarWidth(newWidth)
                    document.body.classList.add('cursor-ew-resize')
                  }

                  const onMouseUp = (): void => {
                    document.removeEventListener('mousemove', onMouseMove)
                    document.removeEventListener('mouseup', onMouseUp)
                    document.body.classList.remove('cursor-ew-resize')
                  }

                  document.addEventListener('mousemove', onMouseMove)
                  document.addEventListener('mouseup', onMouseUp)
                }}
            />
            <ThickArrowRightIcon
                className='cursor-pointer w-12 h-12 absolute top-4 left-4'
                onClick={() => {
                  setOpen(false)
                }}
            />
        </div>
          : ''
    }
        <div className='h-full bg-rose-500 w-full'>

        </div>
    </>
  )
}

export default ResizableSidebar
