<script setup lang="ts">
import * as d3 from 'd3'

type ChannelNodeDatum = {
  x: number
  y: number
  r: number
  color: string
  name: string
} & d3.SimulationNodeDatum

const canvasRef = useTemplateRef('d3-dest')
const context = computed(() => {
  return canvasRef.value?.getContext('2d')
})
const width = computed(() => {
  return canvasRef.value?.width ?? 0
})
const height = computed(() => {
  return canvasRef.value?.height ?? 0
})
const { data: maxMembersCount } = useFetch('/api/max-members', {
  default: () => 1000,
})
const { data, status } = useLazyFetch('/api/channels')
const membersCountToRadius = d3.scaleSqrt([0, maxMembersCount.value], [0, 200])
const color = d3.scaleSequential(d3.interpolateRainbow).domain([0, maxMembersCount.value])
const nodes = computed<ChannelNodeDatum[]>(() => {
  return data.value?.map<ChannelNodeDatum>(channel => ({
    // r: Math.log10(channel.members),
    x: 0,
    y: 0,
    r: membersCountToRadius(channel.members),
    color: color(channel.members),
    // color: 'black',
    name: channel.name ?? channel.channelUsername ?? channel.chatId,
  })) ?? []
})
const simulation = ref<d3.Simulation<ChannelNodeDatum, undefined>>()
watch(nodes, (newNodes) => {
  simulation.value?.stop()
  if (newNodes.length) {
    simulation.value = d3.forceSimulation(newNodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force('x', d3.forceX().strength(0.02))
      .force('y', d3.forceY().strength(0.02))
      .force('collide', d3.forceCollide().radius(d => (d as ChannelNodeDatum).r + 1).iterations(1))
      .force('charge', d3.forceManyBody().strength((d, i) => i ? 0 : -width.value * 2 / 3))
      .on('tick', ticked)
  }
}, {
  immediate: true,
})

function ticked() {
  if (context.value) {
    context.value.clearRect(0, 0, width.value, height.value)
    context.value.save()
    context.value.translate(width.value / 2, height.value / 2)
    for (let i = 1; i < nodes.value.length; ++i) {
      const d = nodes.value[i]
      if (d) {
        context.value.beginPath()
        context.value.moveTo(d.x + d.r, d.y)
        context.value.arc(d.x, d.y, d.r, 0, 2 * Math.PI)
        context.value.fillStyle = d.color
        context.value.fill()
      }
    }
    context.value.restore()
  }
}

onBeforeUnmount(() => {
  simulation.value?.stop()
})
</script>

<template>
  <div>
    <div v-if="status === 'pending'">
      <p>Loading</p>
    </div>
    <div v-else>
      <canvas id="canvas" ref="d3-dest" width="1440" height="600" />
    </div>
  </div>
</template>
