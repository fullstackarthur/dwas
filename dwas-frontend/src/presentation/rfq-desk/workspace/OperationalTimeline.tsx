import { memo, useMemo } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { formatDistanceToNow } from '../../../core/utils'
import { FiUser, FiCpu, FiSettings, FiArrowRight } from 'react-icons/fi'

interface OperationalTimelineProps {
  rfq: RFQ
}

export const OperationalTimeline = memo(function OperationalTimeline({
  rfq,
}: OperationalTimelineProps) {
  const sortedTimeline = [...rfq.timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = sortedTimeline.map((event, index) => ({
      id: event.id,
      position: { x: index * 200, y: 0 },
      data: {
        label: (
          <TimelineNodeContent event={event} />
        ),
      },
      type: 'timelineNode',
      draggable: false,
    }))

    const edges: Edge[] = sortedTimeline.slice(0, -1).map((event, index) => ({
      id: `e${event.id}-${sortedTimeline[index + 1].id}`,
      source: event.id,
      target: sortedTimeline[index + 1].id,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: '#DFE1E6',
      },
      style: { stroke: '#DFE1E6', strokeWidth: 2 },
    }))

    return { initialNodes: nodes, initialEdges: edges }
  }, [sortedTimeline])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Activity Flow</h3>
        <span className="text-[11px] text-text-muted ml-auto">{rfq.timeline.length} events</span>
      </div>
      <div className="h-48">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          panOnDrag={false}
          zoomOnScroll={false}
          elementsSelectable={false}
        />
      </div>
    </div>
  )
})

import type { RFQTimelineEvent } from '../../../core/types/rfq'

const TimelineNodeContent = memo(function TimelineNodeContent({
  event,
}: {
  event: RFQTimelineEvent
}) {
  const Icon =
    event.type === 'human' ? FiUser : event.type === 'ai' ? FiCpu : event.type === 'system' ? FiSettings : FiArrowRight

  const colorClass =
    event.type === 'human'
      ? { bg: 'bg-active-blue/10', border: 'border-active-blue', icon: 'text-active-blue' }
      : event.type === 'ai'
        ? { bg: 'bg-info-cyan/10', border: 'border-info-cyan', icon: 'text-info-cyan' }
        : event.type === 'system'
          ? { bg: 'bg-text-muted/10', border: 'border-text-muted', icon: 'text-text-muted' }
          : { bg: 'bg-success-green/10', border: 'border-success-green', icon: 'text-success-green' }

  return (
    <div className="flex flex-col items-center w-44">
      <div
        className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center border-2',
          colorClass.bg,
          colorClass.border
        )}
      >
        <Icon className={clsx('w-5 h-5', colorClass.icon)} />
      </div>
      <div className="mt-2 text-center">
        <div className="text-[11px] font-medium text-text-primary leading-tight max-w-36 truncate">
          {event.title}
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">
          {formatDistanceToNow(new Date(event.timestamp))}
        </div>
        {event.type === 'workflow_transition' && event.previousStage && event.newStage && (
          <div className="mt-1 text-[9px] flex items-center justify-center gap-0.5">
            <span className="text-text-muted">{formatStage(event.previousStage)}</span>
            <FiArrowRight className="w-2.5 h-2.5 text-text-muted" />
            <span className="text-active-blue">{formatStage(event.newStage)}</span>
          </div>
        )}
        {event.actor && (
          <div className="text-[9px] text-text-muted mt-0.5 truncate max-w-36">
            {event.actor.name}
          </div>
        )}
      </div>
    </div>
  )
})

function formatStage(stage: string): string {
  return stage
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .split(' ')
    .slice(0, 2)
    .join(' ')
}

const TimelineNode = memo(function TimelineNode({ data }: { data: { label: React.ReactNode } }) {
  return (
    <div className="flex items-center justify-center">
      {data.label}
    </div>
  )
})

const nodeTypes: NodeTypes = {
  timelineNode: TimelineNode,
}