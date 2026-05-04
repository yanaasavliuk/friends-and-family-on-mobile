<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'
import riveFile from '../assets/membership_icons.riv?url'

const props = withDefaults(
  defineProps<{
    artboard: string
    size?: number
    playing?: boolean
  }>(),
  {
    size: 40,
    playing: false,
  }
)

const canvas = ref<HTMLCanvasElement | null>(null)
let riveInstance: Rive | null = null

onMounted(() => {
  if (!canvas.value) return

  riveInstance = new Rive({
    src: riveFile,
    canvas: canvas.value,
    artboard: props.artboard,
    autoplay: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      // Start with static state
      riveInstance?.pause()
      if (props.playing) {
        riveInstance?.play('membership_loop')
      }
    },
  })
})

watch(() => props.playing, (isPlaying) => {
  if (!riveInstance) return
  if (isPlaying) {
    riveInstance.play('membership_loop')
  } else {
    riveInstance.pause()
    riveInstance.reset({ artboard: props.artboard, autoplay: false })
  }
})

onBeforeUnmount(() => {
  riveInstance?.cleanup()
  riveInstance = null
})
</script>

<template>
  <canvas
    ref="canvas"
    :width="props.size * 2"
    :height="props.size * 2"
    :style="{ width: `${props.size}px`, height: `${props.size}px`, pointerEvents: 'none' }"
  />
</template>
