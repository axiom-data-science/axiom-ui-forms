import React, { type DragEvent, type ReactElement, type ReactNode } from ***REMOVED***react***REMOVED***
import { Button, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { DragHandleDots2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IManagementGroupNode } from ***REMOVED***@/Management/types***REMOVED***
import { ChevronDown, ChevronRight, Pencil } from ***REMOVED***lucide-react***REMOVED***
import { X } from ***REMOVED***lucide-react***REMOVED***

type GroupNodeCardProps = {
  group: IManagementGroupNode
  focused: boolean
  droppedHighlight: boolean
  canDropInGroup: boolean
  onGroupDragStart: (event: DragEvent<HTMLDivElement>) => void
  onGroupDragEnd: () => void
  onGroupDragOver: (event: DragEvent<HTMLDivElement>) => void
  onGroupDrop: (event: DragEvent<HTMLDivElement>) => void
  onEdit: () => void
  onDelete: () => void
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
  depth: number
  children: ReactNode
}

const GroupNodeCard = ({
  group,
  focused,
  droppedHighlight,
  canDropInGroup,
  onGroupDragStart,
  onGroupDragEnd,
  onGroupDragOver,
  onGroupDrop,
  onEdit,
  onDelete,
  isCollapsed = false,
  onToggleCollapsed,
  depth,
  children,
}: GroupNodeCardProps): ReactElement => {
  return (
    <div
      id={`editor-group-${group.id}`}
      data-drag-node-kind="group"
      className={`flex flex-col border rounded p-2 bg-white transition-all ${focused ? ***REMOVED***ring-2 ring-amber-300***REMOVED*** : ***REMOVED******REMOVED***} ${canDropInGroup ? ***REMOVED***ring-2 ring-emerald-300 bg-emerald-50/40***REMOVED*** : ***REMOVED******REMOVED***} ${droppedHighlight ? ***REMOVED***ring-2 ring-sky-500 border-sky-400 bg-sky-50 shadow-sm shadow-sky-300/70***REMOVED*** : ***REMOVED******REMOVED***} w-full`}
      draggable={false}
      onDragOver={onGroupDragOver}
      onDrop={onGroupDrop}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">
          <div
            className="inline-flex items-center justify-center w-6 h-6 mr-1 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-700 shrink-0 select-none"
            draggable={true}
            onDragStart={onGroupDragStart}
            onDragEnd={onGroupDragEnd}
          >
            <DragHandleDots2Icon />
          </div>
          <span className="font-semibold break-all">{group.label}</span>
          <span className="text-xs text-slate-600 ml-2">{group.id}</span>
        </div>
        <div className="inline-flex items-center gap-1">
          {onToggleCollapsed !== undefined ? (
            <Button size="xs" variant="ghost" onClick={onToggleCollapsed}>
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          ) : null}

            <Tooltip dark={true} content="Edit group" side="top" useSpan={true}>
               <Button size="xs" variant="ghost" className="px-1 min-w-0" onClick={onEdit}>
                <Pencil className="w-3 h-3"  />
                </Button>
              </Tooltip>

          <Tooltip dark={true} content="Delete group" side="top" useSpan={true}>
            <Button size="xs" variant="ghost" className="px-1 min-w-0" onClick={onDelete}>
              <X className="w-3 h-3" />
            </Button>
          </Tooltip>
        </div>
      </div>
      {!isCollapsed ? (
        <div
          className="mt-2 border-l border-slate-200 pl-2"
          style={{ marginLeft: `${Math.min(depth + 1, 6) * 8}px` }}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default GroupNodeCard
