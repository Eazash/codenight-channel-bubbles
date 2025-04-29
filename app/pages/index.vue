<script setup lang="ts">
import * as d3 from 'd3'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

type ChannelNodeDatum = {
  x: number
  y: number
  r: number
  id: number
  members: number
  color: string
  name: string | null
} & d3.SimulationNodeDatum

const canvasRef = useTemplateRef('d3-dest')
const { width, height } = useElementSize(canvasRef)
const { width: windowWidth, height: windowHeight } = useWindowSize()
const { data: maxMembersCount } = useFetch('/api/max-members', {
  default: () => 1000,
})
const { data, status } = useLazyFetch('/api/channels')
function toRadius(value: number) {
  return d3.scaleSqrt([0, maxMembersCount.value], [15, 100])(value)
}
function toColor(value: number) {
  return d3.scaleSequential(d3.interpolateTurbo).domain([0, maxMembersCount.value])(value)
}
const nodes = computed<ChannelNodeDatum[]>(() => {
  return data.value?.map<ChannelNodeDatum>(channel => ({
    id: channel.id,
    x: 0,
    y: 0,
    r: toRadius(channel.members),
    color: toColor(channel.members),
    members: (channel.members),
    name: channel.name ?? channel.channelUsername ?? channel.chatId,
  })) ?? []
})
const simulation = ref<d3.Simulation<ChannelNodeDatum, undefined>>()
const d3Nodes = shallowRef<d3.Selection<SVGCircleElement, ChannelNodeDatum, SVGSVGElement, ChannelNodeDatum>>()
const tooltip = useTemplateRef('tooltip')
const hoveredChannelName = ref<string>()
onMounted(() => {
  if (canvasRef.value) {
    const svgSelection = d3.select<SVGSVGElement, ChannelNodeDatum>(canvasRef.value)
      .attr('width', windowWidth.value)
      .attr('height', windowHeight.value)
    d3Nodes.value = svgSelection.selectAll<SVGCircleElement, ChannelNodeDatum>('circle')
      .data(nodes.value)
      .join('circle')
      .attr('r', d => d.r)
      .attr('cx', d => d.x + d.r)
      .attr('cy', d => d.y)
      .attr('data-tippy-content', d => `<div class="space-y-2"><p class="text-medium">${d.name}</p><p>${d.members}</p></div>`)
      .style('fill', d => d.color)

    tippy.setDefaultProps({
      allowHTML: true,
    })
    tippy(d3Nodes.value?.nodes() ?? [])

    simulation.value = d3.forceSimulation(nodes.value)
      .alphaTarget(0.2) // Stay hot
      .velocityDecay(0.1) // low friction
      .force('x', d3.forceX().strength(0.01))
      .force('y', d3.forceY().strength(0.01))
      .force('collide', d3.forceCollide<ChannelNodeDatum>().radius(d => toRadius(d.members) + 1).iterations(3))
      .force('center', d3.forceCenter())
      .on('tick', ticked)
  }
})
watch(nodes, (newNodes) => {
  simulation.value?.stop()
  if (newNodes.length && d3Nodes.value) {
    simulation.value?.nodes(newNodes)
    d3Nodes.value.data(newNodes).join('circle')
    tippy(d3Nodes.value.nodes())
  }
})

watchEffect(() => {
  if (canvasRef.value) {
    canvasRef.value.style.width = `${windowWidth.value}px`
    canvasRef.value.style.height = `${windowHeight.value}px`
  }
})

function ticked() {
  if (d3Nodes.value) {
    d3Nodes.value.attr('cx', d => width.value / 2 + d.x)
    d3Nodes.value.attr('cy', d => height.value / 2 + d.y)
    d3Nodes.value.attr('data-channel-name', d => d.name)
  }
}

onBeforeUnmount(() => {
  simulation.value?.stop()
  d3Nodes.value?.exit()
})
</script>

<template>
  <div>
    <div v-if="status === 'pending'">
      <p>Loading</p>
    </div>
    <div v-else class="relative">
      <p ref="tooltip" class="absolute z-10">
        {{ hoveredChannelName }}
      </p>
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <svg id="canvas" ref="d3-dest">
      </svg>
    </div>
  </div>
</template>
