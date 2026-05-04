<template>
  <div class="paywall" :class="{ 'paywall--android': platform === 'android' }">
      <!-- Nav bar back button -->
      <nav class="paywall-nav">
        <CcIconButton
          :icon="{ name: 'arrow-line-left', variant: 'glyph' }"
          variant="ghost"
          size="medium"
        />
      </nav>

      <!-- Header -->
      <header class="paywall-header" :class="{ 'paywall-header--no-image': !showImage }">
        <h1 class="paywall-title">
          {{ currentState.headline }}
        </h1>
        <CcSegmentedControl
          :labels="periodLabels"
          :selected="selectedPeriod"
          size="small"
          @segment-clicked="selectedPeriod = $event"
        />
        <img
          v-if="showImage"
          src="../assets/hero-image-new.svg"
          class="hero-image"
          alt="Chess piece illustration"
        />
      </header>

      <!-- Feature Comparison Grid -->
      <section class="paywall-body">
        <div class="feature-grid">
          <!-- Features Column -->
          <div class="grid-col grid-col--features">
            <div class="grid-header grid-header--features">
              <div class="unlimited-badge">
                <span class="unlimited-text">{{ t.unlimited }}</span>
              </div>
            </div>
            <div
              v-for="feature in features"
              :key="feature"
              class="grid-cell grid-cell--feature"
            >
              <span class="feature-name">{{ feature }}</span>
            </div>
            <div class="grid-spacer" />
          </div>

          <!-- Tier Columns -->
          <div
            v-for="tier in tiers"
            :key="tier.name"
            class="grid-col"
            :class="{ 'grid-col--highlighted': selectedTier === tier.key }"
            @click="selectedTier = tier.key"
          >
            <div class="grid-header grid-header--tier">
              <CcIcon :name="tier.icon" variant="color" :size="24" />
              <span class="tier-name">{{ tier.name }}</span>
            </div>
            <div
              v-for="(has, idx) in tier.features"
              :key="idx"
              class="grid-cell grid-cell--indicator"
            >
              <template v-if="has && tier.key === 'diamond'">
                <svg class="blue-check" width="16" height="16" viewBox="29 8 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="37" cy="16.53" r="7.47" fill="#0B548C"/>
                  <circle cx="37" cy="16" r="7.47" fill="#009FD9"/>
                  <path opacity="0.2" d="M33.557 22.627C34.587 23.163 35.758 23.466 37 23.466C41.124 23.466 44.467 20.124 44.467 16C44.467 14.879 44.22 13.816 43.777 12.862C42.234 17.602 38.393 21.293 33.557 22.627Z" fill="#4DC3EA"/>
                  <path d="M41.361 14.673L35.99 20.044C35.644 20.39 35.388 20.376 35.042 20.044L32.624 17.612C32.089 17.076 32.089 16.854 32.624 16.318L32.672 16.27C33.207 15.735 33.43 15.735 33.966 16.27L35.53 17.835L40.02 13.331C40.555 12.796 40.778 12.796 41.314 13.331L41.361 13.379C41.897 13.914 41.897 14.137 41.361 14.673Z" fill="white"/>
                </svg>
              </template>
              <template v-else-if="has">
                <CcIcon name="mark-check" :size="16" class="check-icon" />
              </template>
              <template v-else>
                <CcIcon name="mark-minus" :size="16" class="minus-icon" />
              </template>
            </div>
            <div class="grid-spacer" />
          </div>
        </div>
      </section>

  </div>

  <!-- Footer (outside .paywall so no ancestor overflow interferes with backdrop-filter) -->
  <footer
    class="paywall-footer cc-bg-blur"
    :class="{ 'paywall-footer--android': platform === 'android' }"
  >
    <template v-if="platform === 'ios'">
      <div class="price-info">
        <span class="price">{{ currentPrice }}</span>
        <div v-if="billingText" class="price-detail">
          <span class="billing-text">{{ billingText }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="price-info price-info--android">
        <span class="price price--android-primary">{{ androidPricePrimary }}</span>
        <div v-if="androidAnnualLine" class="price-detail">
          <span class="price price--android-secondary">{{ androidAnnualLine }}</span>
        </div>
      </div>
    </template>
    <div class="cta-container">
      <CcButton
        variant="monetization"
        size="x-large"
        fullWidth
        :label="currentState.cta"
      />
    </div>
    <template v-if="platform === 'android'">
      <p v-if="androidDisclaimer" class="android-disclaimer">{{ androidDisclaimer }}</p>
    </template>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CcButton, CcIcon, CcIconButton, CcSegmentedControl } from '@chesscom/design-system'

import {
  getTranslations,
  parseLangParam,
  parseEligibleParam,
  parsePlatformParam,
  type LangCode,
  type PlatformParam,
} from './translations'

const params = new URLSearchParams(window.location.search)
const lang = ref<LangCode>(parseLangParam(params.get('lang')))
const isTrialEligible = ref(parseEligibleParam(params.get('eligible')))
const showImage = ref(params.get('image') !== 'false')
const platform = ref<PlatformParam>(parsePlatformParam(params.get('platform')))

window.addEventListener('popstate', () => {
  const p = new URLSearchParams(window.location.search)
  lang.value = parseLangParam(p.get('lang'))
  isTrialEligible.value = parseEligibleParam(p.get('eligible'))
  showImage.value = p.get('image') !== 'false'
  platform.value = parsePlatformParam(p.get('platform'))
})

const t = computed(() => getTranslations(lang.value))

const pricing = {
  plans: {
    diamond: {
      tier: 1,
      yearly: { monthlyRate: 10.00, annualTotal: 119.99 },
      monthly: { monthlyRate: 16.99 },
    },
    platinum: {
      tier: 2,
      yearly: { monthlyRate: 6.67, annualTotal: 79.99 },
      monthly: { monthlyRate: 10.99 },
    },
    gold: {
      tier: 3,
      yearly: { monthlyRate: 4.17, annualTotal: 49.99 },
      monthly: { monthlyRate: 6.99 },
    },
    friendsAndFamily: {
      tier: 4,
      yearly: { monthlyRate: 16.67, annualTotal: 199.99 },
      monthly: null as { monthlyRate: number } | null,
    },
  },
}

type PlanKey = keyof typeof pricing.plans
type BillingPeriod = 'yearly' | 'monthly'

const currentState = computed(() =>
  isTrialEligible.value ? t.value.trialEligible : t.value.notTrialEligible
)

const selectedPeriod = ref(0)
const selectedTier = ref<PlanKey>('diamond')

const billingPeriod = computed<BillingPeriod>(() =>
  selectedPeriod.value === 0 ? 'yearly' : 'monthly'
)

const selectedPlanPricing = computed(() => {
  const plan = pricing.plans[selectedTier.value]
  return plan[billingPeriod.value]
})

const currentPrice = computed(() => {
  const rate = selectedPlanPricing.value?.monthlyRate
  if (rate == null) return ''
  return t.value.perMonth(`$${rate.toFixed(2)}`)
})

const billingText = computed(() => {
  if (billingPeriod.value !== 'yearly') return null
  const plan = pricing.plans[selectedTier.value]
  const yearly = plan.yearly
  if (!yearly) return null
  return t.value.billedAnnually(`$${yearly.annualTotal.toFixed(2)}`)
})

const androidPricePrimary = computed(() => {
  const rate = selectedPlanPricing.value?.monthlyRate
  if (rate == null) return ''
  return t.value.androidPerMonthDisplay(`$${rate.toFixed(2)}`)
})

const androidAnnualLine = computed(() => {
  if (billingPeriod.value !== 'yearly') return null
  const plan = pricing.plans[selectedTier.value]
  const yearly = plan.yearly
  if (!yearly) return null
  return t.value.androidAnnualSummary(`$${yearly.annualTotal.toFixed(2)}`)
})

const androidDisclaimer = computed(() => {
  if (billingPeriod.value === 'yearly') {
    const plan = pricing.plans[selectedTier.value]
    const yearly = plan.yearly
    if (!yearly) return null
    const annualStr = `$${yearly.annualTotal.toFixed(2)}`
    const equivMo = `$${(yearly.annualTotal / 12).toFixed(2)}/mo`
    return t.value.androidGooglePlayDisclaimerYearly(annualStr, equivMo)
  }
  const rate = selectedPlanPricing.value?.monthlyRate
  if (rate == null) return null
  return t.value.androidGooglePlayDisclaimerMonthly(`$${rate.toFixed(2)}`)
})

const periodLabels = computed(() => [t.value.yearly, t.value.monthly])

const features = computed(() => [
  t.value.features.puzzles,
  t.value.features.lessons,
  t.value.features.bots,
  t.value.features.playCoach,
  t.value.features.noAds,
  t.value.features.gameReview,
  t.value.features.moveExplanations,
  t.value.features.insights,
  t.value.features.coursesPerks,
])

const tiers = computed(() => [
  {
    key: 'gold' as PlanKey,
    name: t.value.tiers.gold,
    icon: 'commerce-gold',
    features: [true, true, true, true, true, false, false, false, false],
  },
  {
    key: 'platinum' as PlanKey,
    name: t.value.tiers.platinum,
    icon: 'commerce-platinum',
    features: [true, true, true, true, true, true, false, false, false],
  },
  {
    key: 'diamond' as PlanKey,
    name: t.value.tiers.diamond,
    icon: 'commerce-diamond',
    features: [true, true, true, true, true, true, true, true, true],
  },
])
</script>

<style scoped>
.paywall {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-gray-800);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 146px;
}

.paywall--android {
  padding-bottom: 240px;
}

/* Nav bar */
.paywall-nav {
  position: absolute;
  top: 54px;
  left: var(--space-4);
  z-index: 5;
}

/* Header */
.paywall-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-24);
  padding: 94px var(--space-12) var(--space-12);
  width: 100%;
  background: var(--color-gray-900) url('../assets/background-decoration-new.svg') center bottom / auto no-repeat;
  position: relative;
  overflow: hidden;
}

.paywall-header--no-image {
  background: var(--color-gray-800);
}

.paywall-title {
  text-align: center;
  color: var(--color-text-boldest);
  width: 100%;
  font-family: var(--font-family-heading);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.27;
}

.hero-image {
  width: 160px;
  height: 120px;
  object-fit: contain;
}

/* Body - Feature Grid */
.paywall-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.feature-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 500px;
  height: fit-content;
}

.grid-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  max-width: 80px;
  padding-bottom: var(--space-12);
  cursor: pointer;
}

.grid-col--features {
  flex: 1;
  width: 100%;
  min-width: 144px;
  max-width: none;
  cursor: default;
}

.grid-col--highlighted {
  box-shadow: inset 0 0 0 2px var(--color-border-selected);
  background-color: rgba(0, 0, 0, 0.16);
}

/* Grid Headers */
.grid-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.grid-header--features {
  height: 66px;
  justify-content: flex-end;
  border-radius: 10px 10px 0 0;
}

.grid-header--tier {
  gap: var(--space-8);
  padding: var(--space-12) var(--space-4);
  justify-content: center;
  border-radius: 10px 10px 0 0;
}

.unlimited-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: var(--space-12) 0;
  background: var(--color-transparent-white-5);
  border-radius: 5px 5px 0 0;
}

.unlimited-text {
  font-family: 'Inter', var(--font-family-system);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  color: var(--color-transparent-white-72);
}

.tier-name {
  font-family: 'Inter', var(--font-family-system);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  color: var(--color-text-boldest);
}

/* Grid Cells */
.grid-cell {
  display: flex;
  align-items: center;
  width: 100%;
  border-right: 1px solid var(--color-transparent-white-5);
  border-image: none;
}

.grid-col:last-child .grid-cell {
  border-right: none;
}

.grid-cell:nth-child(even) {
  background: var(--color-transparent-black-14);
}


.grid-cell--feature {
  padding: var(--space-8) var(--space-12);
  gap: var(--space-8);
  min-height: var(--space-32);
  border-top-left-radius: var(--radius-sm, 4px);
  border-bottom-left-radius: var(--radius-sm, 4px);
}

.grid-header--features + .grid-cell--feature {
  border-top-left-radius: 0;
}

.grid-cell--indicator {
  padding: var(--space-8);
  justify-content: center;
  gap: var(--space-4);
  min-height: var(--space-32);
}

.feature-name {
  font-family: 'Inter', var(--font-family-system);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  color: var(--color-text-boldest);
}

.grid-spacer {
  flex: 0;
  width: 100%;
  height: var(--space-4);
}

.check-icon {
  color: var(--color-transparent-white-85);
}

.minus-icon {
  color: var(--color-transparent-white-40);
}

.blue-check {
  width: 16px;
  height: 16px;
}

/* Footer */
.paywall-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  padding-bottom: var(--space-24);
  position: fixed;
  bottom: 0;
  z-index: 10;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: var(--space-4);
  padding: var(--space-12) 0 0;
}

.price {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: var(--font-size-lg, 17px);
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  color: var(--color-text-boldest);
}

.price-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
}

.billing-text {
  font-family: 'Inter', var(--font-family-system);
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  color: var(--color-transparent-white-50);
}

.cta-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.cta-container .cc-button-component {
  max-width: 500px;
}

.price-info--android {
  gap: var(--space-4);
}

.price--android-primary {
  color: var(--color-blue-100);
}

.price--android-secondary {
  color: var(--color-text-boldest);
  max-width: 286px;
}

.android-disclaimer {
  font-family: 'Inter', var(--font-family-system);
  font-size: 10px;
  font-weight: 400;
  line-height: 13px;
  text-align: center;
  color: var(--color-transparent-white-50);
  max-width: 500px;
  padding: 0 var(--space-12);
  padding-top: var(--space-4);
  margin: 0;
}

.paywall-footer--android .cta-container {
  padding-bottom: var(--space-8);
}
</style>
