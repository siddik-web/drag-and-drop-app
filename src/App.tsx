'use client'

import React, { createContext, useContext, useReducer, useState, useCallback, useRef, useEffect } from 'react'
import { DndContext, DragOverlay, useDroppable, useDraggable, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SelectionArea, useSelectionContainer } from '@air/react-drag-to-select'
import { X, GripVertical, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Type, ChevronDown, Layers, Group, Ungroup, Copy, ClipboardPasteIcon as Paste } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

// Types
type ItemType = 'item' | 'group'
interface DraggableElement {
  id: string
  type: ItemType
  content: string
  children?: DraggableElement[]
  gridArea: string
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
  layer: number
}

// Action types
type Action =
  | { type: 'ADD_ITEM'; payload: DraggableElement }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<DraggableElement> } }
  | { type: 'GROUP_ITEMS'; payload: { ids: string[]; groupId: string } }
  | { type: 'UNGROUP_ITEMS'; payload: string }
  | { type: 'CHANGE_LAYER'; payload: { id: string; newLayer: number } }
  | { type: 'REORDER_LAYERS'; payload: DraggableElement[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }

// State type
interface State {
  past: DraggableElement[][]
  present: DraggableElement[]
  future: DraggableElement[][]
}

// Context
const CanvasContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | undefined>(undefined)

// Constants
const GRID_SIZE = 8 // Size of each grid cell in pixels
const GRID_COLUMNS = 12
const GRID_ROWS = 12

// Helper function to snap a value to the grid
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

// Color options for the background color picker
const colorOptions = [
  { value: 'bg-white', label: 'White' },
  { value: 'bg-gray-100', label: 'Light Gray' },
  { value: 'bg-red-100', label: 'Light Red' },
  { value: 'bg-yellow-100', label: 'Light Yellow' },
  { value: 'bg-green-100', label: 'Light Green' },
  { value: 'bg-blue-100', label: 'Light Blue' },
  { value: 'bg-purple-100', label: 'Light Purple' },
  { value: 'bg-pink-100', label: 'Light Pink' },
]

// Reducer function
function canvasReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        past: [...state.past, state.present],
        present: [...state.present, action.payload],
        future: []
      }
    case 'REMOVE_ITEM':
      return {
        past: [...state.past, state.present],
        present: state.present.filter(item => item.id !== action.payload),
        future: []
      }
    case 'UPDATE_ITEM':
      return {
        past: [...state.past, state.present],
        present: state.present.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
        future: []
      }
    case 'GROUP_ITEMS':
      const itemsToGroup = state.present.filter(item => action.payload.ids.includes(item.id))
      const newGroup: DraggableElement = {
        id: action.payload.groupId,
        type: 'group',
        content: 'Group',
        children: itemsToGroup,
        gridArea: itemsToGroup[0].gridArea,
        backgroundColor: 'bg-gray-200',
        textAlign: 'left',
        fontSize: 14,
        layer: Math.max(...itemsToGroup.map(item => item.layer)) + 1
      }
      return {
        past: [...state.past, state.present],
        present: [
          ...state.present.filter(item => !action.payload.ids.includes(item.id)),
          newGroup
        ],
        future: []
      }
    case 'UNGROUP_ITEMS':
      const groupToUngroup = state.present.find(item => item.id === action.payload)
      if (!groupToUngroup || groupToUngroup.type !== 'group') return state
      return {
        past: [...state.past, state.present],
        present: [
          ...state.present.filter(item => item.id !== action.payload),
          ...(groupToUngroup.children || [])
        ],
        future: []
      }
    case 'CHANGE_LAYER':
      return {
        past: [...state.past, state.present],
        present: state.present.map(item =>
          item.id === action.payload.id ? { ...item, layer: action.payload.newLayer } : item
        ),
        future: []
      }
    case 'REORDER_LAYERS':
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: []
      }
    case 'UNDO':
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future]
      }
    case 'REDO':
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1)
      }
    default:
      return state
  }
}

// Grid Cell component
const GridCell: React.FC<{ element: DraggableElement }> = ({ element }) => {
  const { dispatch } = useContext(CanvasContext)!
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id })
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'absolute',
    left: parseInt(element.gridArea.split('/')[1]) * GRID_SIZE,
    top: parseInt(element.gridArea.split('/')[0]) * GRID_SIZE,
    width: parseInt(element.gridArea.split('/')[3]) * GRID_SIZE,
    height: parseInt(element.gridArea.split('/')[2]) * GRID_SIZE,
    textAlign: element.textAlign,
    fontSize: `${element.fontSize}px`,
    zIndex: element.layer,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const handleResize = (e: React.MouseEvent, direction: 'width' | 'height') => {
    e.stopPropagation()
    const startPos = direction === 'width' ? e.clientX : e.clientY
    const startSize = direction === 'width' ? parseInt(element.gridArea.split('/')[3]) : parseInt(element.gridArea.split('/')[2])

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === 'width' ? e.clientX : e.clientY
      const diff = snapToGrid(currentPos - startPos)
      const newSize = Math.max(GRID_SIZE, startSize * GRID_SIZE + diff)
      const newSpan = Math.round(newSize / GRID_SIZE)
      const newGridArea = direction === 'width'
        ? `${element.gridArea.split('/')[0]} / ${element.gridArea.split('/')[1]} / ${element.gridArea.split('/')[2]} / span ${newSpan}`
        : `${element.gridArea.split('/')[0]} / ${element.gridArea.split('/')[1]} / span ${newSpan} / ${element.gridArea.split('/')[3]}`
      dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { gridArea: newGridArea } } })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMove = useDraggable({
    id: `draggable-${element.id}`,
    data: { type: 'gridCell', id: element.id },
  })

  return (
    <Card ref={setNodeRef} style={style} className={`p-4 ${element.backgroundColor}`} {...attributes} {...listeners} {...handleMove.listeners} {...handleMove.attributes} data-id={element.id}>
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-2">
          <GripVertical size={16} className="cursor-move text-gray-400" />
          <div className="flex space-x-1">
            <Select
              value={element.backgroundColor}
              onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { backgroundColor: value } } })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { textAlign: 'left' } } })}>
                    <AlignLeft size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { textAlign: 'center' } } })}>
                    <AlignCenter size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align center</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { textAlign: 'right' } } })}>
                    <AlignRight size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Align right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { fontSize: element.fontSize + 1 } } })}>
                    <Type size={16} />+
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Increase font size</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UPDATE_ITEM', payload: { id: element.id, updates: { fontSize: Math.max(8, element.fontSize - 1) } } })}>
                    <Type size={16} />-
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Decrease font size</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: element.id })}>
                  <X size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex-1">
          {element.type === 'group' ? (
            <div>
              <div className="font-bold mb-2">Group</div>
              {element.children?.map((child) => (
                <GridCell key={child.id} element={child} />
              ))}
            </div>
          ) : (
            element.content
          )}
        </div>
        <div className="flex justify-end gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-4 h-4 p-0"
            onMouseDown={(e) => handleResize(e, 'width')}
            aria-label="Resize width"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-4 h-4 p-0"
            onMouseDown={(e) => handleResize(e, 'height')}
            aria-label="Resize height"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Sidebar component
const Sidebar: React.FC<{ items: DraggableElement[] }> = ({ items }) => {
  return (
    <div className="w-64 p-4 bg-gray-100 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
      {items.map((item) => (
        <SidebarItem key={item.id} item={item} />
      ))}
    </div>
  )
}

// SidebarItem component
const SidebarItem: React.FC<{ item: DraggableElement }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: item.id,
    data: { type: 'sidebarItem', item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-2 cursor-move" {...attributes} {...listeners}>
      <CardContent className="p-2">
        {item.content}
      </CardContent>
    </Card>
  )
}

// LayersPanel component
const LayersPanel: React.FC = () => {
  const { state, dispatch } = useContext(CanvasContext)!
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = state.present.findIndex((item) => item.id === active.id)
      const newIndex = state.present.findIndex((item) => item.id === over.id)

      const newItems = [...state.present]
      const [reorderedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, reorderedItem)

      dispatch({ type: 'REORDER_LAYERS', payload: newItems })
    }
  }

  return (
    <div className="w-64 p-4 bg-gray-100 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">Layers</h2>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={state.present.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {state.present.map((item) => (
            <LayerItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

// LayerItem component
const LayerItem: React.FC<{ item: DraggableElement }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center justify-between p-2 bg-white mb-2 rounded shadow">
      <span>{item.content}</span>
      <span>Layer {item.layer}</span>
    </div>
  )
}

// Canvas component
const Canvas: React.FC = () => {
  const { state, dispatch } = useContext(CanvasContext)!
  const { setNodeRef } = useDroppable({ id: 'canvas' })
  const { open: isSidebarOpen, toggleSidebar } = useSidebar()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [copiedItems, setCopiedItems] = useState<DraggableElement[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  const { DragSelection, SelectionRectangle } = useSelectionContainer({
    onSelectionChange: (selectedElements) => {
      const selectedIds = selectedElements.map(el => el.getAttribute('data-id') || '')
      setSelectedItems(selectedIds.filter(id => id !== ''))
    },
    selectionProps: {
      style: {
        border: '2px solid #4299e1',
        backgroundColor: 'rgba(66, 153, 225, 0.3)',
      },
    },
  })

  const handleItemClick = useCallback((id: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    } else {
      setSelectedItems([id])
    }
  }, [])

  const handleGroupItems = useCallback(() => {
    if (selectedItems.length > 1) {
      dispatch({ type: 'GROUP_ITEMS', payload: { ids: selectedItems, groupId: `group-${Date.now()}` } })
      setSelectedItems([])
    }
  }, [selectedItems, dispatch])

  const handleUngroupItems = useCallback(() => {
    if (selectedItems.length === 1) {
      const selectedItem = state.present.find(item => item.id === selectedItems[0])
      if (selectedItem && selectedItem.type === 'group') {
        dispatch({ type: 'UNGROUP_ITEMS', payload: selectedItem.id })
        setSelectedItems([])
      }
    }
  }, [selectedItems, state.present, dispatch])

  const handleCopyItems = useCallback(() => {
    const itemsToCopy = state.present.filter(item => selectedItems.includes(item.id))
    setCopiedItems(itemsToCopy)
  }, [selectedItems, state.present])

  const handlePasteItems = useCallback(() => {
    copiedItems.forEach(item => {
      const newItem = {
        ...item,
        id: `${item.id}-copy-${Date.now()}`,
        gridArea: `${parseInt(item.gridArea.split('/')[0]) + 1} / ${parseInt(item.gridArea.split('/')[1]) + 1} / ${item.gridArea.split('/')[2]} / ${item.gridArea.split('/')[3]}`,
      }
      dispatch({ type: 'ADD_ITEM', payload: newItem })
    })
  }, [copiedItems, dispatch])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          handleCopyItems()
        } else if (e.key === 'v') {
          handlePasteItems()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCopyItems, handlePasteItems])

  return (
    <div 
      ref={(node) => {
        setNodeRef(node)
        canvasRef.current = node
      }}
      className="flex-1 p-4 bg-white min-h-[400px] relative overflow-auto"
      style={{
        backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      }}
    >
      <DragSelection />
      <SelectionRectangle />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Canvas</h2>
        <div className="flex space-x-2">
          <Button onClick={handleGroupItems} disabled={selectedItems.length < 2}>
            <Group size={16} className="mr-2" />
            Group
          </Button>
          <Button onClick={handleUngroupItems} disabled={selectedItems.length !== 1}>
            <Ungroup size={16} className="mr-2" />
            Ungroup
          </Button>
          <Button onClick={handleCopyItems} disabled={selectedItems.length === 0}>
            <Copy size={16} className="mr-2" />
            Copy
          </Button>
          <Button onClick={handlePasteItems} disabled={copiedItems.length === 0}>
            <Paste size={16} className="mr-2" />
            Paste
          </Button>
        </div>
      </div>
      <SortableContext items={state.present.map(item => item.id)}>
        {state.present.map((item) => (
          <div
            key={item.id}
            onClick={(e) => handleItemClick(item.id, e)}
            className={`relative ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''}`}
            data-selectable
            data-id={item.id}
          >
            <GridCell element={item} />
          </div>
        ))}
      </SortableContext>
    </div>
  )
}

// Main App component
export default function App() {
  const [state, dispatch] = useReducer(canvasReducer, {
    past: [],
    present: [],
    future: []
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const { open: isSidebarOpen, toggleSidebar } = useSidebar()
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(true)

  const sidebarItems: DraggableElement[] = [
    { id: 'sidebar-1', type: 'item', content: 'Item 1', gridArea: '1 / 1 / 2 / 2', backgroundColor: 'bg-white', textAlign: 'left', fontSize: 14, layer: 0 },
    { id: 'sidebar-2', type: 'item', content: 'Item 2', gridArea: '1 / 1 / 2 / 2', backgroundColor: 'bg-white', textAlign: 'left', fontSize: 14, layer: 0 },
    { id: 'sidebar-3', type: 'item', content: 'Item 3', gridArea: '1 / 1 / 2 / 2', backgroundColor: 'bg-white', textAlign: 'left', fontSize: 14, layer: 0 },
  ]

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    if (active.id !== over.id) {
      const activeItem = sidebarItems.find(item => item.id === active.id) ||
                         state.present.find(item => item.id === active.id)
    
      if (!activeItem) {
        setActiveId(null)
        return
      }

      // If dropping onto the canvas
      if (over.id === 'canvas') {
        const rect = (event.activatorEvent.target as HTMLElement).getBoundingClientRect()
        const x = snapToGrid(event.activatorEvent.clientX - rect.left)
        const y = snapToGrid(event.activatorEvent.clientY - rect.top)
        const newItem = { 
          ...activeItem, 
          id: `canvas-${Date.now()}`,
          gridArea: `${y / GRID_SIZE + 1} / ${x / GRID_SIZE + 1} / span 2 / span 3`,
          layer: state.present.length // Set the layer to be on top
        }
        dispatch({ type: 'ADD_ITEM', payload: newItem })
      } else {
        // If moving an existing canvas item
        const updatedItems = state.present.map(item => {
          if (item.id === active.id) {
            const rect = (event.activatorEvent.target as HTMLElement).getBoundingClientRect()
            const x = snapToGrid(event.activatorEvent.clientX - rect.left)
            const y = snapToGrid(event.activatorEvent.clientY - rect.top)
            return {
              ...item,
              gridArea: `${y / GRID_SIZE + 1} / ${x / GRID_SIZE + 1} / ${item.gridArea.split('/')[2]} / ${item.gridArea.split('/')[3]}`
            }
          }
          return item
        })
        dispatch({ type: 'REORDER_LAYERS', payload: updatedItems })
      }
    }

    setActiveId(null)
  }

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      <SidebarProvider>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-col h-screen">
            <header className="flex justify-between items-center p-4 bg-gray-200">
              <h1 className="text-2xl font-bold">Canvas App</h1>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch({ type: 'UNDO' })}
                        disabled={state.past.length === 0}
                      >
                        <Undo size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Undo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch({ type: 'REDO' })}
                        disabled={state.future.length === 0}
                      >
                        <Redo size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Redo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
              <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
                {isSidebarOpen && <Sidebar items={sidebarItems} />}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? '<' : '>'}
              </Button>
              <Canvas />
              <div className={`transition-all duration-300 ease-in-out ${isLayersPanelOpen ? 'w-64' : 'w-0'}`}>
                {isLayersPanelOpen && <LayersPanel />}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
              >
                {isLayersPanelOpen ? '>' : '<'}
              </Button>
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <Card className="p-2 bg-white border border-gray-300">
                <CardContent className="p-0">
                  {sidebarItems.find((item) => item.id === activeId)?.content || 
                   state.present.find((item) => item.id === activeId)?.content}
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </SidebarProvider>
    </CanvasContext.Provider>
  )
}