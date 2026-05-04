<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { getTranslations, type LangCode } from './translations'
import { CcButton, CcIcon, CcIconButton } from '@chesscom/design-system'
// Rive file served from /public
const riveFileUrl = import.meta.env.BASE_URL + 'membership_icons.riv'

type TierType = 'gold' | 'platinum' | 'diamond'
type BillingType = 'monthly' | 'yearly'

const props = withDefaults(
  defineProps<{
    lang?: LangCode
    platform?: 'ios' | 'android'
    showImage?: boolean
    deviceId?: string
    orientation?: 'portrait' | 'landscape'
    trialEligible?: boolean
    variant?: 'a' | 'b'
  }>(),
  {
    lang: 'en',
    platform: 'ios',
    showImage: true,
    deviceId: 'iphone-15-pro',
    orientation: 'portrait',
    trialEligible: false,
    variant: 'a',
  }
)

const emit = defineEmits<{
  selectPlan: [{ tier: TierType; billing: BillingType }]
  back: []
}>()

// State
const currentStep = ref<1 | 2>(1)
const selectedTier = ref<TierType>('diamond')
const selectedBilling = ref<BillingType>('yearly')

// Translations
const t = computed(() => getTranslations(props.lang))

// Device detection
const isTablet = computed(() => {
  return props.deviceId?.includes('tablet') ?? false
})

// Pricing data
const pricing = {
  diamond: {
    yearly: { monthlyRate: 10.0, annualTotal: 119.99 },
    monthly: { monthlyRate: 16.99 },
  },
  platinum: {
    yearly: { monthlyRate: 6.67, annualTotal: 79.99 },
    monthly: { monthlyRate: 10.99 },
  },
  gold: {
    yearly: { monthlyRate: 4.17, annualTotal: 49.99 },
    monthly: { monthlyRate: 6.99 },
  },
}

// Plan configuration
const plansConfig = computed(() => [
  {
    id: 'diamond' as TierType,
    icon: 'commerce-diamond',
    name: t.value.tiers.diamond,
    description: t.value.planDescriptions.diamond,
  },
  {
    id: 'platinum' as TierType,
    icon: 'commerce-platinum',
    name: t.value.tiers.platinum,
    description: t.value.planDescriptions.platinum,
  },
  {
    id: 'gold' as TierType,
    icon: 'commerce-gold',
    name: t.value.tiers.gold,
    description: t.value.planDescriptions.gold,
  },
])

// Features list for phone view — order depends on selected tier
const baseFeatures = [
  { id: 'puzzles', icon: 'game-type-puzzle', color: '#E8833A' },
  { id: 'lessons', icon: 'game-lesson', color: '#48A8B5' },
  { id: 'bots', icon: 'game-type-computer', color: '#7B9AAE' },
  { id: 'playCoach', icon: 'game-lesson-student', color: '#8BA84B' },
  { id: 'noAds', icon: 'circle-block', color: '#D04040' },
  { id: 'gameReview', icon: 'move-circle-best', color: '#81B64C' },
  { id: 'moveExplanations', icon: 'move-circle-brilliant', color: '#48B088' },
  { id: 'insights', icon: 'device-bulb-glow', color: '#F5C342' },
] as const

const diamondFeatures = [
  { id: 'gameReview', icon: 'move-circle-best', color: '#81B64C' },
  { id: 'moveExplanations', icon: 'move-circle-brilliant', color: '#48B088' },
  { id: 'insights', icon: 'device-bulb-glow', color: '#F5C342' },
  { id: 'puzzles', icon: 'game-type-puzzle', color: '#E8833A' },
  { id: 'lessons', icon: 'game-lesson', color: '#48A8B5' },
  { id: 'bots', icon: 'game-type-computer', color: '#7B9AAE' },
  { id: 'playCoach', icon: 'game-lesson-student', color: '#8BA84B' },
  { id: 'noAds', icon: 'circle-block', color: '#D04040' },
] as const

const allFeatures = computed(() => selectedTier.value === 'diamond' ? diamondFeatures : baseFeatures)

// Feature inclusion matrix
const featureMatrix: Record<TierType, Record<string, boolean>> = {
  diamond: {
    puzzles: true, lessons: true, bots: true, playCoach: true,
    noAds: true, gameReview: true, moveExplanations: true, insights: true, coursesPerks: true,
  },
  platinum: {
    puzzles: true, lessons: true, bots: true, playCoach: true,
    noAds: true, gameReview: true, moveExplanations: false, insights: false, coursesPerks: false,
  },
  gold: {
    puzzles: true, lessons: true, bots: true, playCoach: true,
    noAds: true, gameReview: false, moveExplanations: false, insights: false, coursesPerks: false,
  },
}

// Computed properties
const step1Title = computed(() => {
  return props.trialEligible ? 'Get 1 Week of Premium for Free' : 'Get the Very Best of Chess'
})

const currentHeadline = computed(() => {
  if (currentStep.value === 2) {
    return props.trialEligible ? 'Choose a Plan for After Your Free Trial' : step1Title.value
  }
  return step1Title.value
})

const currentCtaText = computed(() => {
  if (props.trialEligible) return 'Try for $0.00'
  if (currentStep.value === 2) return 'Go Premium'
  const strings = t.value.notTrialEligible
  return strings.cta
})

const hasFeature = (featureName: string, tier?: TierType): boolean => {
  const t = tier ?? selectedTier.value
  return featureMatrix[t]?.[featureName] ?? false
}

const featureLabel = (featureName: string) => {
  return t.value.features[featureName as keyof typeof t.value.features]
}

// Methods
const goToStep2 = () => { currentStep.value = 2 }
const goToStep1 = () => { currentStep.value = 1; emit('back') }
const selectTier = (tier: TierType) => { selectedTier.value = tier }
const selectBilling = (billing: BillingType) => { selectedBilling.value = billing }
const handleCta = () => { emit('selectPlan', { tier: selectedTier.value, billing: selectedBilling.value }) }
const formatPrice = (price: number) => price.toFixed(2)

// Calculate yearly savings percentage vs monthly
const yearlySavingsPercent = computed(() => {
  const monthly = pricing[selectedTier.value].monthly.monthlyRate
  const yearlyMonthly = pricing[selectedTier.value].yearly.monthlyRate
  return Math.round(((monthly - yearlyMonthly) / monthly) * 100)
})

// Rive animation icons — uses global `rive` from CDN (v2.27.0)
// The .riv has artboard "Artboard" with named animations:
//   membership-diamond, membership-platinum, membership-gold,
//   membership_static, membership_loop
declare const rive: any
const tierToAnimation: Record<string, string> = {
  diamond: 'membership-diamond',
  platinum: 'membership-platinum',
  gold: 'membership-gold',
}

const riveCanvasRefs = ref<Record<string, HTMLCanvasElement | null>>({
  diamond: null,
  platinum: null,
  gold: null,
})
const riveInstances: Record<string, any> = {}
const riveReady: Record<string, boolean> = {}

const setRiveCanvas = (tier: string) => (el: any) => {
  riveCanvasRefs.value[tier] = el as HTMLCanvasElement | null
}

let riveRetryTimer: ReturnType<typeof setTimeout> | null = null

function initRive(retryCount = 0) {
  try {
    if (typeof rive === 'undefined' || !rive.Rive) {
      if (retryCount < 10) {
        console.warn(`[Rive] CDN not loaded yet, retry ${retryCount + 1}/10`)
        riveRetryTimer = setTimeout(() => initRive(retryCount + 1), 200)
      } else {
        console.warn('[Rive] CDN failed to load after 10 retries')
      }
      return
    }

    const tiers: TierType[] = ['diamond', 'platinum', 'gold']
    for (const tier of tiers) {
      const canvas = riveCanvasRefs.value[tier]
      if (!canvas || riveInstances[tier]) continue

      const animName = tierToAnimation[tier]
      console.log(`[Rive] Creating ${tier} with animation "${animName}"`)

      const isSelected = selectedTier.value === tier
      const anims = isSelected ? [animName, 'membership_loop'] : [animName, 'membership_static']

      riveInstances[tier] = new rive.Rive({
        src: riveFileUrl,
        canvas,
        animations: anims,
        autoplay: true,
        onLoad: () => {
          try {
            console.log(`[Rive] ✅ Loaded: ${tier} (selected=${isSelected})`)
            riveInstances[tier]?.resizeDrawingSurfaceToCanvas()
            riveReady[tier] = true
          } catch (e) {
            console.warn(`[Rive] onLoad error for ${tier}:`, e)
          }
        },
        onLoadError: (e: any) => {
          console.warn(`[Rive] Load error for ${tier}:`, e)
        },
      })
    }
  } catch (e) {
    console.warn('[Rive] Init failed:', e)
  }
}

function cleanupRive() {
  if (riveRetryTimer) {
    clearTimeout(riveRetryTimer)
    riveRetryTimer = null
  }
  for (const tier of Object.keys(riveInstances)) {
    try { riveInstances[tier]?.cleanup() } catch (_e) { /* noop */ }
    delete riveInstances[tier]
    riveReady[tier] = false
  }
}

onMounted(() => {
  nextTick().then(() => initRive())
})

watch(currentStep, (step) => {
  if (step === 1) {
    cleanupRive()
    nextTick().then(() => initRive())
  }
})

watch(selectedTier, (newTier, oldTier) => {
  try {
    // Destroy and recreate the old tier showing static icon
    if (oldTier && riveInstances[oldTier]) {
      const canvas = riveCanvasRefs.value[oldTier]
      try { riveInstances[oldTier].cleanup() } catch(_e) { /* noop */ }
      delete riveInstances[oldTier]
      riveReady[oldTier] = false
      if (canvas) {
        const oldAnim = tierToAnimation[oldTier]
        riveInstances[oldTier] = new rive.Rive({
          src: riveFileUrl,
          canvas,
          animations: [oldAnim, 'membership_static'],
          autoplay: true,
          onLoad: () => {
            try {
              riveInstances[oldTier]?.resizeDrawingSurfaceToCanvas()
              riveReady[oldTier] = true
            } catch(_e) { /* noop */ }
          },
        })
      }
    }
    // Destroy and recreate the new tier with loop animation
    if (newTier && riveInstances[newTier]) {
      const canvas = riveCanvasRefs.value[newTier]
      try { riveInstances[newTier].cleanup() } catch(_e) { /* noop */ }
      delete riveInstances[newTier]
      riveReady[newTier] = false
      if (canvas) {
        const newAnim = tierToAnimation[newTier]
        riveInstances[newTier] = new rive.Rive({
          src: riveFileUrl,
          canvas,
          animations: [newAnim, 'membership_loop'],
          autoplay: true,
          onLoad: () => {
            try {
              riveInstances[newTier]?.resizeDrawingSurfaceToCanvas()
              riveReady[newTier] = true
            } catch(_e) { /* noop */ }
          },
        })
      }
    }
  } catch (e) {
    console.warn('[Rive] Selection animation error:', e)
  }
})

onBeforeUnmount(() => {
  cleanupRive()
})
</script>

<template>
  <div class="paywall" :class="{ 'paywall--tablet': isTablet }" :data-step="currentStep" :data-lang="lang" :data-platform="platform" :data-orientation="orientation">

    <!-- iOS Status Bar + Nav (overlaid at top) -->
    <div v-if="platform === 'ios'" class="ios-status-bar">
      <div class="ios-status-bar-inner">
        <span class="ios-time">9:41</span>
        <div class="ios-dynamic-island" />
        <div class="ios-status-icons">
          <!-- Signal bars -->
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0" y="7" width="3" height="4" rx="0.5" fill="white"/><rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5" fill="white"/><rect x="9" y="2" width="3" height="9" rx="0.5" fill="white"/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="white"/></svg>
          <!-- WiFi -->
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none"><path d="M7.5 10.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" fill="white" transform="translate(0,-2)"/><path d="M4.5 8.5a4.2 4.2 0 0 1 6 0" stroke="white" stroke-width="1.3" stroke-linecap="round"/><path d="M2 5.8a7.5 7.5 0 0 1 11 0" stroke="white" stroke-width="1.3" stroke-linecap="round"/></svg>
          <!-- Battery -->
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" stroke-opacity="0.35"/><rect x="2" y="2" width="18" height="7" rx="1" fill="white"/><path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fill-opacity="0.4"/></svg>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════ -->
    <!-- STEP 1: Plan Selection — B1 Design              -->
    <!-- ════════════════════════════════════════════════ -->
    <div v-if="currentStep === 1" class="step-content step-1">

      <!-- Step 1 Header: dark panel with title + green pawn hero -->
      <div class="step-1-header">
        <!-- Back Button -->
        <nav class="paywall-nav step-1-nav">
          <CcIconButton
            :icon="{ name: 'arrow-line-left', variant: 'glyph' }"
            variant="ghost"
            size="medium"
            @click="emit('back')"
          />
        </nav>

        <!-- Title -->
        <h1 class="paywall-title step-1-title">{{ step1Title }}</h1>

        <!-- A1 Image: Green Pawn illustration (rebuilt from Figma) -->
        <div v-if="showImage" class="a1-image" />
      </div>

      <!-- Plan Cards -->
      <div class="step-1-body">
        <div class="plan-cards-container">
          <div
            v-for="plan in plansConfig"
            :key="plan.id"
            class="plan-card"
            :class="{ 'plan-card--selected': selectedTier === plan.id }"
            @click="selectTier(plan.id)"
            role="button"
            tabindex="0"
            @keydown.enter="selectTier(plan.id)"
            @keydown.space="selectTier(plan.id)"
          >
            <span v-if="plan.id === 'diamond'" class="plan-card-chip">Most popular</span>
            <canvas
              :ref="setRiveCanvas(plan.id)"
              width="320"
              height="320"
              class="rive-icon-canvas"
            />
            <div class="plan-card-content">
              <span class="plan-card-title">{{ plan.name }}</span>
              <span class="plan-card-description">{{ plan.description }}</span>
            </div>
          </div>
        </div>

        <div class="step-spacer" />
      </div>
    </div>

    <!-- ════════════════════════════════════════════════ -->
    <!-- STEP 2: Billing + Features (phone & tablet)    -->
    <!-- ════════════════════════════════════════════════ -->
    <div v-else-if="currentStep === 2" class="step-content step-2" :class="{ 'step-2--variant-b': variant === 'b' }">
      <!-- Back Button -->
      <nav class="paywall-nav">
        <CcIconButton
          :icon="{ name: 'arrow-line-left', variant: 'glyph' }"
          variant="ghost"
          size="medium"
          @click="goToStep1"
        />
      </nav>

      <!-- Title Group -->
      <div class="step-2-title-group">
        <h1 class="paywall-title">{{ currentHeadline }}</h1>
      </div>

      <!-- Section: Billing + Benefits -->
      <div class="step-2-section">
        <!-- Billing Cards — Variant A (compact, side-by-side layout) -->
        <div v-if="variant === 'a'" class="billing-cards-container">
          <!-- Yearly -->
          <div
            class="billing-card"
            :class="{ 'billing-card--selected': selectedBilling === 'yearly' }"
            @click="selectBilling('yearly')"
            role="button" tabindex="0"
          >
            <span class="billing-card-chip">Save {{ yearlySavingsPercent }}%</span>
            <div class="billing-card-inner">
              <div class="billing-card-left">
                <span class="billing-card-label">{{ t.yearly }}</span>
                <span v-if="platform === 'android'" class="billing-card-subtext-row">
                  12 months &bull; ${{ formatPrice(pricing[selectedTier].yearly.annualTotal) }}
                </span>
                <span v-else class="billing-card-subtext">
                  billed annually, ${{ formatPrice(pricing[selectedTier].yearly.annualTotal) }}/year
                </span>
              </div>
              <div class="billing-card-right">
                <span class="billing-card-price-old">
                  ${{ formatPrice(pricing[selectedTier].monthly.monthlyRate) }} / month
                </span>
                <span class="billing-card-price" :class="{ 'billing-card-price--blue': platform === 'android' }">
                  <template v-if="platform === 'android'">${{ formatPrice(pricing[selectedTier].yearly.monthlyRate) }} / month</template>
                  <template v-else>${{ formatPrice(pricing[selectedTier].yearly.monthlyRate) }} / month</template>
                </span>
              </div>
            </div>
          </div>
          <!-- Monthly -->
          <div
            class="billing-card"
            :class="{ 'billing-card--selected': selectedBilling === 'monthly' }"
            @click="selectBilling('monthly')"
            role="button" tabindex="0"
          >
            <div class="billing-card-inner">
              <div class="billing-card-left">
                <span class="billing-card-label">{{ t.monthly }}</span>
              </div>
              <div class="billing-card-right">
                <span class="billing-card-price" :class="{ 'billing-card-price--blue': platform === 'android' }">
                  ${{ formatPrice(pricing[selectedTier].monthly.monthlyRate) }} / month
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Cards — Variant B (yearly first, monthly second) -->
        <div v-else class="billing-cards-container billing-cards-container--b">
          <!-- Yearly (with details) -->
          <div
            class="billing-card"
            :class="{ 'billing-card--selected': selectedBilling === 'yearly' }"
            @click="selectBilling('yearly')"
            role="button" tabindex="0"
          >
            <span class="billing-card-chip">Save {{ yearlySavingsPercent }}%</span>
            <div class="billing-card-inner">
              <div class="billing-card-left">
                <span class="billing-card-label">{{ t.yearly }}</span>
                <span v-if="platform === 'android'" class="billing-card-subtext-row">
                  12 months &bull; ${{ formatPrice(pricing[selectedTier].yearly.annualTotal) }}
                </span>
                <span v-else class="billing-card-subtext">
                  billed annually, ${{ formatPrice(pricing[selectedTier].yearly.annualTotal) }}/year
                </span>
              </div>
              <div class="billing-card-right">
                <span class="billing-card-price-old">
                  ${{ formatPrice(pricing[selectedTier].monthly.monthlyRate) }} / month
                </span>
                <span class="billing-card-price" :class="{ 'billing-card-price--blue': platform === 'android' }">
                  <template v-if="platform === 'android'">${{ formatPrice(pricing[selectedTier].yearly.monthlyRate) }} / month</template>
                  <template v-else>${{ formatPrice(pricing[selectedTier].yearly.monthlyRate) }} / month</template>
                </span>
              </div>
            </div>
          </div>
          <!-- Monthly (compact) -->
          <div
            class="billing-card"
            :class="{ 'billing-card--selected': selectedBilling === 'monthly' }"
            @click="selectBilling('monthly')"
            role="button" tabindex="0"
          >
            <div class="billing-card-inner">
              <div class="billing-card-left">
                <span class="billing-card-label">{{ t.monthly }}</span>
              </div>
              <div class="billing-card-right">
                <span class="billing-card-price" :class="{ 'billing-card-price--blue': platform === 'android' }">
                  ${{ formatPrice(pricing[selectedTier].monthly.monthlyRate) }} / month
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits Card (Variant A only) -->
        <div v-if="variant === 'a'" class="benefits-card-wrapper">
          <!-- Pill Header -->
          <div class="benefits-pill">
            <CcIcon :name="`commerce-${selectedTier}`" variant="color" :size="12" />
            <span class="benefits-pill-text">
              Unlimited with <span class="benefits-pill-tier" :class="`benefits-pill-tier--${selectedTier}`">{{ t.tiers[selectedTier] }} Plan:</span>
            </span>
          </div>

          <!-- Card -->
          <div class="benefits-card">
            <div
              v-for="(feature, idx) in allFeatures"
              :key="feature.id"
              class="benefit-item"
              :class="{ 'benefit-item--disabled': !hasFeature(feature.id), 'benefit-item--last': idx === allFeatures.length - 1 }"
            >
              <div class="benefit-item-icon" :style="{ color: hasFeature(feature.id) ? feature.color : undefined }">
                <CcIcon :name="feature.icon" variant="glyph" :size="16" />
              </div>
              <span class="benefit-item-name">{{ featureLabel(feature.id) }}</span>
              <div class="benefit-item-check" :class="{ 'benefit-item-check--diamond': hasFeature(feature.id) && selectedTier === 'diamond' }">
                <CcIcon v-if="hasFeature(feature.id)" name="mark-check" variant="glyph" :size="16" />
                <CcIcon v-else name="mark-cross" variant="glyph" :size="16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-spacer" />
    </div>

    <!-- ════════════════════════════════════════════════ -->
    <!-- FOOTER                                          -->
    <!-- ════════════════════════════════════════════════ -->

    <!-- Footer CTA -->
    <div class="cta-footer" :class="{ 'cta-footer--tablet': isTablet }">
      <div class="cta-buttons">
        <CcButton
          :label="currentCtaText"
          variant="monetization"
          size="x-large"
          fullWidth
          @click="currentStep === 1 ? goToStep2() : handleCta()"
        />
      </div>
      <p v-if="currentStep === 2 && platform === 'android'" class="cta-disclaimer">
        <template v-if="selectedBilling === 'yearly'">
          You will be charged ${{ formatPrice(pricing[selectedTier].yearly.annualTotal) }} per year (${{ formatPrice(pricing[selectedTier].yearly.monthlyRate) }}/mo). You may cancel anytime in Google Play.
        </template>
        <template v-else>
          You will be charged ${{ formatPrice(pricing[selectedTier].monthly.monthlyRate) }} per month. You may cancel anytime in Google Play.
        </template>
      </p>
      <div class="cta-home-indicator">
        <div class="cta-home-indicator-pill" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   BASE LAYOUT
   ═══════════════════════════════════════ */
.paywall {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--color-bg-primary, #312e2b);
  color: var(--color-text-boldest, #fff);
  font-family: 'Inter', var(--font-family-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  overflow-x: hidden;
  position: relative;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 12px 0 12px;
  animation: fadeSlide 0.1s cubic-bezier(0, 0, 0.4, 1);
  min-height: 0;
  overflow-y: auto;
}

.step-1 { animation-name: slideFromLeft; }
.step-2 { animation-name: slideFromRight; background: var(--color-bg-opaque, #262421); padding-top: 47px; }

@keyframes slideFromLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideFromRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.step-spacer { flex: 1; min-height: 20px; }

/* ═══════════════════════════════════════
   NAV BAR (back button)
   ═══════════════════════════════════════ */
.paywall-nav {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0;
  margin-bottom: 16px;
}

/* ═══════════════════════════════════════
   TITLE
   ═══════════════════════════════════════ */
.paywall-title {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 22px;
  font-weight: 800;
  line-height: 28px;
  text-align: center;
  margin: 0 0 24px 0;
  max-width: 270px;
  margin-left: auto;
  margin-right: auto;
  color: var(--color-text-boldest, #fff);
}

/* ═══════════════════════════════════════
   STEP 1: B1 DESIGN — PLAN SELECTION
   ═══════════════════════════════════════ */

/* Step 1 uses full-bleed layout — no side padding on the outer container */
.step-1 {
  padding: 0;
}

/* ═══════════════════════════════════════
   iOS STATUS BAR
   ═══════════════════════════════════════ */
.ios-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 47px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  background: rgba(38, 36, 33, 0.75);
  overflow: hidden;
}

.ios-status-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  position: relative;
}

.ios-time {
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
  width: 54px;
}

.ios-dynamic-island {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 125px;
  height: 32px;
  border-radius: 18.5px;
  background: rgba(0, 0, 0, 0.9);
}

.ios-status-icons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ios-status-icons svg {
  display: block;
}

/* Dark header panel */
.step-1-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: var(--color-bg-opaque, #262421) url('../assets/background-decoration-new.svg') center bottom / auto no-repeat;
  padding: 47px 12px 12px 12px;
  overflow: hidden;
  flex-shrink: 0;
}

/* Landscape: stretch clouds to full width */
.paywall[data-orientation="landscape"] .step-1-header {
  background-size: 100% auto;
}

/* Back button sits at the top of the header panel */
.step-1-nav {
  align-self: flex-start;
  height: 44px;
  padding: 0;
  margin-bottom: 0;
  z-index: 2;
  position: relative;
}

/* ═══════════════════════════════════════
   STEP 1: TITLE
   ═══════════════════════════════════════ */
.step-1-title {
  position: relative;
  z-index: 1;
  max-width: 284px;
  margin: -8px auto 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 28px;
  text-align: center;
  color: #fff;
}

/* ═══════════════════════════════════════
   A1 IMAGE — Green pawn illustration
   Background-image approach: pawn SVG centered,
   inline SVG stars via the template.
   Container: 160 × 120 matching Figma.
   ═══════════════════════════════════════ */
.a1-image {
  position: relative;
  z-index: 1;
  width: 160px;
  height: 120px;
  flex-shrink: 0;
  margin-top: 8px;
  background: url('../assets/hero-image-new.svg') no-repeat center center;
  background-size: contain;
}

/* Plan cards body area — standard padding */
.step-1-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 12px 0 12px;
  flex: 1;
  width: 100%;
}

/* Plan Cards */
.plan-cards-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 476px;
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-16, 16px);
  padding: var(--space-16, 16px) var(--space-12, 12px) var(--space-16, 16px) var(--space-24, 24px);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0px 2px 4px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.14),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
  cursor: pointer;
  transition: background 0.05s cubic-bezier(0, 0, 0.2, 1);
}

.plan-card:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.07) 100%);
}

.plan-card-chip {
  position: absolute;
  top: -13px;
  left: 24px;
  padding: 2px 4px;
  background: var(--color-border-selected, #81b64c);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 3px;
  line-height: 15px;
  min-height: 19px;
  display: flex;
  align-items: center;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
}

.plan-card--selected {
  outline: var(--border-3, 3px) solid var(--color-border-selected, #81b64c);
  outline-offset: var(--space-2, 2px);
}

.rive-icon-canvas {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  margin: -12px;
  pointer-events: none;
}

.plan-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.plan-card-title {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.18;
  color: var(--color-text-boldest, #fff);
}

.plan-card-description {
  font-family: 'Inter', var(--font-family-system, sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.33;
  color: rgba(255, 255, 255, 0.72);
  margin-top: 2px;
}

/* ═══════════════════════════════════════
   STEP 2: BILLING + BENEFITS CARD
   ═══════════════════════════════════════ */

.step-2-title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.step-2-subtitle {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  margin-top: -8px;
}

.step-2-title-group .paywall-title {
  margin: 0;
}

.step-2-subtitle {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
}

.step-2-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0;
  width: 100%;
  margin-top: 24px;
}
.step-2--variant-b .step-2-section {
  margin-top: 32px;
}

/* Billing Cards */
.billing-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 476px;
}

.billing-card {
  position: relative;
  width: 100%;
  height: 80px;
  cursor: pointer;
}

.billing-card-inner {
  display: flex;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0px 2px 4px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.14),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
  transition: background 0.05s cubic-bezier(0, 0, 0.2, 1);
}

.billing-card:hover .billing-card-inner {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.07) 100%);
}

.billing-card--selected::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 3px solid var(--color-border-selected, #81b64c);
  border-radius: 14px;
  pointer-events: none;
}

.billing-card-chip {
  position: absolute;
  top: -13px;
  left: 24px;
  padding: 2px 4px;
  background: var(--color-border-selected, #81b64c);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 3px;
  line-height: 15px;
  min-height: 19px;
  display: flex;
  align-items: center;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.billing-card-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-height: 48px;
}

.billing-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  justify-content: center;
  min-height: 48px;
  text-align: center;
  white-space: nowrap;
}

.paywall[data-platform="android"] .billing-card-inner:has(.billing-card-subtext-row) {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px;
  align-items: baseline;
}

.paywall[data-platform="android"] .billing-card-inner:has(.billing-card-subtext-row) .billing-card-left {
  display: contents;
}

.paywall[data-platform="android"] .billing-card-inner:has(.billing-card-subtext-row) .billing-card-right {
  display: contents;
}

.paywall[data-platform="android"] .billing-card-label {
  grid-column: 1;
  grid-row: 1;
}

.paywall[data-platform="android"] .billing-card-subtext-row {
  grid-column: 1;
  grid-row: 2;
}

.paywall[data-platform="android"] .billing-card-price-old {
  grid-column: 2;
  grid-row: 1;
  text-align: right;
}

.paywall[data-platform="android"] .billing-card-price {
  grid-column: 2;
  grid-row: 2;
  text-align: right;
}

.billing-card-label {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  color: var(--color-text-boldest, #fff);
}

.billing-card-subtext {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 10px;
  font-weight: 400;
  line-height: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.billing-card-price {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  color: var(--color-text-boldest, #fff);
}

.billing-card-price-old {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.billing-card-price--blue {
  color: var(--color-blue-200, #009FD9);
}

.billing-card-subtext-row {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  color: var(--color-text-bolder, rgba(255, 255, 255, 0.85));
}

/* ─── Variant B billing card overrides ─── */
.billing-cards-container--b {
  gap: 12px;
}

.billing-card--b-yearly {
  height: auto;
}

.billing-card--b-monthly {
  height: auto;
}

.billing-card-inner--b {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  height: auto;
  padding: 16px;
  position: relative;
}

.billing-card--b-yearly .billing-card-inner--b {
  gap: 7px;
}

.billing-card--b-monthly .billing-card-inner--b {
  gap: 8px;
}

.billing-card-inner--b .billing-card-left,
.billing-card-inner--b .billing-card-right {
  min-height: 0;
}

.billing-card-label-b {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
  color: rgba(255, 255, 255, 0.85);
}

.billing-card-pricing-b {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.billing-card-pricing-b .billing-card-price-old {
  margin-bottom: 8px;
}

.billing-card-pricing-b .billing-card-price-b {
  margin-bottom: 4px;
}

.billing-card-price-b {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.85);
}

.billing-card-chip-value {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 2px 4px;
  background: rgba(48, 87, 48, 0.3);
  color: #81b64c;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 3px;
  line-height: 15px;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
}

/* Benefits Card */
.benefits-card-wrapper {
  position: relative;
  width: 100%;
  max-width: 476px;
  padding-top: 15px;
}

.benefits-pill {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  padding: 0 12px;
  border-radius: 20px;
  background: var(--color-bg-primary, #312e2b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.benefits-pill-text {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.72);
}

.benefits-pill-tier--diamond {
  color: #4dc3ea;
}

.benefits-pill-tier--platinum {
  color: #d0e6fb;
}

.benefits-pill-tier--gold {
  color: #fad541;
}

.benefits-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 35px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-item:first-child {
  margin-top: 13px;
}

.benefit-item--last {
  height: 48px;
  border-bottom: none;
}

.benefit-item--disabled .benefit-item-name {
  color: rgba(255, 255, 255, 0.5);
}

.benefit-item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.benefit-item--disabled .benefit-item-icon {
  color: rgba(255, 255, 255, 0.35) !important;
  opacity: 0.5;
}

.benefit-item-name {
  flex: 1;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--color-text-boldest, #fff);
}

.benefit-item-check {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.72);
  margin-right: 4px;
}

.benefit-item-check--diamond {
  color: var(--color-blue-100, #4DC3EA);
}

.benefit-item--disabled .benefit-item-check {
  color: rgba(255, 255, 255, 0.35);
}

/* ═══════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════ */

.cta-footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 12px 16px 12px;
  background: rgba(38, 36, 33, 0.55);
  z-index: 100;
  margin-top: auto;
  position: relative;
}


.cta-footer .cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

.cta-disclaimer {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 8px 12px 0;
  margin: 0;
  max-width: 500px;
}

.cta-footer .cta-home-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  padding-top: 0;
}

.cta-footer .cta-home-indicator-pill {
  width: 134px;
  height: 5px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.25);
}

.cta-footer--tablet .cta-buttons {
  max-width: 500px;
}

/* ═══════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .step-content { animation: none; }
  .plan-card, .billing-card { transition: none; }
}
</style>
