<template>
  <div class="preview-page">
    <div
      class="device-shell"
      :style="deviceShellStyle"
    >
      <div class="device-screen">
        <div class="device-content">
          <FriendsFamilyPaywall
            :lang="selectedLang"
            :platform="selectedPlatform"
            :device-id="selectedDevice"
            :orientation="selectedOrientation"
            :trial-eligible="trialEligible"
            :billing="selectedBilling"
            @select-plan="onSelectPlan"
            @change-billing="selectedBilling = $event"
          />
        </div>
      </div>
    </div>

    <!-- Floating toggle button (always in same position) -->
    <button
      class="fab-toggle"
      @click="panelOpen = !panelOpen"
    >
      <CcIcon
        :name="panelOpen ? 'mark-cross' : 'utility-cogwheel'"
        :size="20"
      />
    </button>

    <!-- Floating control panel (opens below the button) -->
    <Transition name="panel">
      <div v-if="panelOpen" class="control-panel">
        <div class="control-section">
          <div class="control-label">Billing</div>
          <CcSegmentedControl
            :labels="['Yearly', 'Monthly']"
            :selected="selectedBilling === 'yearly' ? 0 : 1"
            size="small"
            fullWidth
            @segment-clicked="selectedBilling = $event === 0 ? 'yearly' : 'monthly'"
          />
        </div>

        <div class="control-section control-section--row">
          <div class="control-label">Trial Eligible</div>
          <CcSwitch v-model="trialEligible" />
        </div>

        <div class="control-section">
          <div class="control-label">IOS/ANDROID</div>
          <CcSegmentedControl
            :labels="['iOS', 'Android']"
            :selected="selectedPlatform === 'ios' ? 0 : 1"
            size="small"
            fullWidth
            @segment-clicked="selectedPlatform = $event === 0 ? 'ios' : 'android'"
          />
        </div>

        <!-- Orientation toggle is only available for tablet devices (phones are portrait-only) -->
        <div v-if="isTabletDevice" class="control-section">
          <div class="control-label">Orientation</div>
          <CcSegmentedControl
            :labels="['Portrait', 'Landscape']"
            :selected="selectedOrientation === 'portrait' ? 0 : 1"
            size="small"
            fullWidth
            @segment-clicked="selectedOrientation = $event === 0 ? 'portrait' : 'landscape'"
          />
        </div>

        <div class="control-section">
          <div class="control-label">Device</div>
          <CcSelect
            v-model="selectedDevice"
            :options="deviceSelectOptions"
          />
        </div>

        <div class="control-section">
          <div class="control-label">Language</div>
          <CcSelect
            v-model="selectedLang"
            :options="languageOptions"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CcIcon, CcSegmentedControl, CcSelect, CcSwitch } from '@chesscom/design-system'
import type { LangCode, PlatformParam } from './translations'
import FriendsFamilyPaywall from './FriendsFamilyPaywall.vue'

interface DeviceSpec {
  id: string
  label: string
  w: number
  h: number
}

const devices: DeviceSpec[] = [
  { id: 'phone-sm', label: 'Phone Small', w: 360, h: 640 },
  { id: 'phone-md', label: 'Phone Medium', w: 390, h: 844 },
  { id: 'phone-lg', label: 'Phone Large', w: 430, h: 932 },
  { id: 'tablet-sm', label: 'Tablet Small', w: 810, h: 1080 },
  { id: 'tablet-md', label: 'Tablet Medium', w: 800, h: 1280 },
  { id: 'tablet-lg', label: 'Tablet Large', w: 1024, h: 1366 },
]

const selectedBilling = ref<'yearly' | 'monthly'>('yearly')
const selectedDevice = ref('phone-md')
const selectedOrientation = ref<'portrait' | 'landscape'>('portrait')
const panelOpen = ref(true)
const trialEligible = ref(true)
const selectedPlatform = ref<PlatformParam>('ios')
const selectedLang = ref<LangCode>('en')

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'uk', label: 'Ukrainian' },
]

const deviceSelectOptions = devices.map(d => ({
  value: d.id,
  label: `${d.label} (${d.w}×${d.h})`,
}))

const activeDevice = computed(() =>
  devices.find(d => d.id === selectedDevice.value)!
)

const isTabletDevice = computed(() => selectedDevice.value.startsWith('tablet'))

// When the user picks a phone device, force orientation back to portrait
// (phones don't support landscape in this prototype)
watch(selectedDevice, (newDevice) => {
  if (!newDevice.startsWith('tablet') && selectedOrientation.value === 'landscape') {
    selectedOrientation.value = 'portrait'
  }
})

const deviceWidth = computed(() =>
  selectedOrientation.value === 'portrait'
    ? activeDevice.value.w
    : activeDevice.value.h
)

const deviceHeight = computed(() =>
  selectedOrientation.value === 'portrait'
    ? activeDevice.value.h
    : activeDevice.value.w
)

const deviceShellStyle = computed(() => ({
  width: `${deviceWidth.value}px`,
  height: `${deviceHeight.value}px`,
}))

const onSelectPlan = (payload: { tier: string; billing: string }) => {
  // Prototype: log to console for design QA
  console.log('[Friends & Family paywall] selectPlan:', payload)
}
</script>

<style scoped>
.preview-page {
  width: 100%;
  min-height: 100vh;
  background-color: #312E2B;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  position: relative;
  overflow: auto;
}

/* --- Device shell --- */
.device-shell {
  border-radius: 40px;
  border: 3px solid var(--color-border-default);
  background: #312E2B;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transition: width 0.35s ease, height 0.35s ease;
  flex-shrink: 0;
}

.device-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  overflow: hidden;
}

.device-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* --- Floating toggle button --- */
.fab-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(40, 38, 36, 0.92);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: background 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.fab-toggle:hover {
  background: rgba(60, 56, 52, 0.95);
}

/* --- Floating control panel --- */
.control-panel {
  position: fixed;
  top: 88px;
  right: 24px;
  width: 260px;
  max-height: none;
  background: rgba(40, 38, 36, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-family: var(--font-family-system);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
}

.control-section--row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* --- Panel transition --- */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}
</style>
