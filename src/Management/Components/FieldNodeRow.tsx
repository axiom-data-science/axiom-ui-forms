import React, { type DragEvent, type KeyboardEvent, type ReactElement } from ***REMOVED***react***REMOVED***
import { Button, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { DragHandleDots2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IManagementFieldNode } from ***REMOVED***@/Management/types***REMOVED***
import { Pencil, X, ListStart, ListEnd } from ***REMOVED***lucide-react***REMOVED***

type FieldNodeRowProps = {
  field: IManagementFieldNode
  displayLabel: string
  fieldTypeOptions: string[]
  allowInlineEdit?: boolean
  mapped: boolean
  focused: boolean
  droppedHighlight: boolean
  isInlineEditing: boolean
  inlineLabelDraft: string
  onInlineLabelDraftChange: (value: string) => void
  onInlineEditStart: () => void
  onInlineEditCommit: () => void
  onInlineEditCancel: () => void
  onTypeChange: (nextType: string | undefined) => void
  onFocus: () => void
  onDragStart: (event: DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
  onAddBefore: () => void
  onAddAfter: () => void
  onEdit: () => void
  onDelete: () => void
}

const FieldNodeRow = ({
  field,
  displayLabel,
  fieldTypeOptions,
  allowInlineEdit = true,
  mapped,
  focused,
  droppedHighlight,
  isInlineEditing,
  inlineLabelDraft,
  onInlineLabelDraftChange,
  onInlineEditStart,
  onInlineEditCommit,
  onInlineEditCancel,
  onTypeChange,
  onFocus,
  onDragStart,
  onDragEnd,
  onAddBefore,
  onAddAfter,
  onEdit,
  onDelete,
}: FieldNodeRowProps): ReactElement => {
  const fieldColor = mapped
    ? ***REMOVED***border-emerald-300 bg-emerald-50***REMOVED***
    : ***REMOVED***border-amber-300 bg-amber-50***REMOVED***

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return

    if (allowInlineEdit && !isInlineEditing && event.key.toLowerCase() === ***REMOVED***e***REMOVED***) {
      event.preventDefault()
      event.stopPropagation()
      onInlineEditStart()
      return
    }

    if (allowInlineEdit && !isInlineEditing && event.key === ***REMOVED***Enter***REMOVED***) {
      event.preventDefault()
      event.stopPropagation()
      onInlineEditStart()
    }
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div
        id={`editor-field-${field.id}`}
        data-drag-node-kind="field"
        className={`flex items-center gap-2 border rounded px-2 py-2 text-sm cursor-grab active:cursor-grabbing select-none transition-all ${fieldColor} ${focused ? ***REMOVED***ring-2 ring-amber-300***REMOVED*** : ***REMOVED******REMOVED***} ${droppedHighlight ? ***REMOVED***ring-2 ring-sky-500 border-sky-400 bg-sky-100 shadow-sm shadow-sky-300/70***REMOVED*** : ***REMOVED******REMOVED***} w-full min-w-0`}
        draggable={!isInlineEditing}
        tabIndex={0}
        onClick={onFocus}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <span className="inline-flex items-center text-slate-500 hover:text-slate-700 pointer-events-none">
          <DragHandleDots2Icon />
        </span>
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {allowInlineEdit && isInlineEditing ? (
              <input
                className="border rounded px-1.5 py-0.5 text-sm min-w-0 flex-1"
                value={inlineLabelDraft}
                autoFocus={true}
                onChange={(event) => {
                  onInlineLabelDraftChange(event.target.value)
                }}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                onKeyDown={(event) => {
                  event.stopPropagation()
                  if (event.key === ***REMOVED***Enter***REMOVED***) {
                    event.preventDefault()
                    onInlineEditCommit()
                  }
                  if (event.key === ***REMOVED***Escape***REMOVED***) {
                    event.preventDefault()
                    onInlineEditCancel()
                  }
                }}
                onBlur={onInlineEditCommit}
              />
            ) : (
              <span
                className="font-semibold break-all min-w-0"
                onDoubleClick={(event) => {
                  if (!allowInlineEdit) return
                  event.preventDefault()
                  event.stopPropagation()
                  onInlineEditStart()
                }}
              >
                {displayLabel.trim() !== ***REMOVED******REMOVED*** ? displayLabel : ***REMOVED***(unnamed field)***REMOVED***}
              </span>
            )}
            <span className="text-xs text-slate-500 truncate min-w-0">{field.prop.trim() !== ***REMOVED******REMOVED*** ? field.prop : ***REMOVED***(unmapped field)***REMOVED***}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <select
              className="h-5 text-[10px] rounded border border-slate-300 bg-white px-1 py-0 leading-none max-w-[92px]"
              value={field.overrideType ?? ***REMOVED******REMOVED***}
              aria-label="Field type"
              onClick={(event) => {
                event.stopPropagation()
              }}
              onChange={(event) => {
                const value = event.target.value
                onTypeChange(value === ***REMOVED******REMOVED*** ? undefined : value)
              }}
            >
              <option value="">auto</option>
              {fieldTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded ${mapped ? ***REMOVED***bg-emerald-200 text-emerald-800***REMOVED*** : ***REMOVED***bg-amber-200 text-amber-900***REMOVED***}`}>
          {mapped ? ***REMOVED***mapped***REMOVED*** : ***REMOVED***unmapped***REMOVED***}
        </span>
      </div>
      <div className="inline-flex items-center gap-0.5 shrink-0">
        <Tooltip dark={true} content="Add field before" side="top" useSpan={true}>
          <Button variant="ghost" size="xs" className="px-1 min-w-0 relative" onClick={onAddBefore}>
                <ListStart className="w-3 h-3" />
          </Button>
        </Tooltip>
        <Tooltip dark={true} content="Add field after" side="top" useSpan={true}>
          <Button variant="ghost" size="xs" className="px-1 min-w-0 relative" onClick={onAddAfter}>
                <ListEnd className="w-3 h-3" />
          </Button>
        </Tooltip>
        <Tooltip dark={true} content="Edit field" side="top" useSpan={true}>
          <Button variant="ghost" size="xs" className="px-1 min-w-0" onClick={onEdit}>
            <Pencil className="w-3 h-3" />
          </Button>
        </Tooltip>
        <Tooltip dark={true} content="Delete field" side="top" useSpan={true}>
          <Button variant="ghost" size="xs" className="px-1 min-w-0" onClick={onDelete}>
            <X className="w-3 h-3" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default FieldNodeRow
