<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Rive, Fit, Alignment, Layout } from '@rive-app/canvas'

const props = withDefaults(
  defineProps<{
    tier: 'gold' | 'platinum' | 'diamond'
    width?: number
    height?: number
  }>(),
  {
    width: 192,
    height: 338,
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let riveInstance: Rive | null = null
let currentTier = ''

function getRiveFile(tier: string): string {
  if (tier === 'diamond') return 'membership_icons_clean3.riv'
  return 'membership_icons_diamond.riv'
}

function getAnimations(tier: string): string[] {
  return ['membership_loop', `membership-${tier}`]
}

function switchTier(tier: string) {
  if (!riveInstance || tier === currentTier) return
  currentTier = tier
  riveInstance.stop()
  riveInstance.play(getAnimations(tier))
}

onMounted(async () => {
  if (!canvasRef.value) return

  const base = import.meta.env.BASE_URL
  const response = await fetch(`${base}${getRiveFile(props.tier)}`)
  const buffer = await response.arrayBuffer()

  riveInstance = new Rive({
    buffer,
    canvas: canvasRef.value,
    autoplay: true,
    animations: getAnimations(props.tier),
    enableRiveAssetCDN: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      currentTier = props.tier
      riveInstance?.resizeDrawingSurfaceToCanvas()
    },
  })
})

watch(
  () => props.tier,
  (newTier) => {
    switchTier(newTier)
  }
)

onBeforeUnmount(() => {
  if (riveInstance) {
    riveInstance.cleanup()
    riveInstance = null
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width * 2"
    :height="height * 2"
    :style="{ width: width + 'px', height: height + 'px', background: 'transparent' }"
  />
</template>
