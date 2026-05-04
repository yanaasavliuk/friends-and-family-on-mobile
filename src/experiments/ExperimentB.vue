<template>
  <div class="paywall" :class="{ 'paywall--android': platform === 'android' }">
      <!-- Header -->
      <header class="paywall-header">
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
          src="../assets/hero-image-new.svg"
          class="hero-image"
          alt="Chess piece illustration"
        />
      </header>

      <!-- Plan Buttons -->
      <section class="paywall-body">
        <div class="plan-list">
          <div
            v-for="plan in plans"
            :key="plan.key"
            class="plan-button"
            :class="{ 'plan-button--selected': selectedTier === plan.key }"
            @click="selectedTier = plan.key"
          >
            <CcIcon :name="plan.icon" variant="color" :size="40" />
            <div class="plan-info">
              <span class="plan-name">{{ plan.name }}</span>
              <span class="plan-description">{{ plan.description }}</span>
            </div>
            <span v-if="plan.mostPopular" class="most-popular-chip">{{ t.mostPopular }}</span>
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
import { CcButton, CcIcon, CcSegmentedControl } from '@chesscom/design-system'

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
const platform = ref<PlatformParam>(parsePlatformParam(params.get('platform')))

window.addEventListener('popstate', () => {
  const p = new URLSearchParams(window.location.search)
  lang.value = parseLangParam(p.get('lang'))
  isTrialEligible.value = parseEligibleParam(p.get('eligible'))
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

const plans = computed(() => [
  {
    key: 'diamond' as PlanKey,
    name: t.value.tiers.diamond,
    icon: 'commerce-diamond',
    description: t.value.planDescriptions.diamond,
    mostPopular: true,
  },
  {
    key: 'platinum' as PlanKey,
    name: t.value.tiers.platinum,
    icon: 'commerce-platinum',
    description: t.value.planDescriptions.platinum,
    mostPopular: false,
  },
  {
    key: 'gold' as PlanKey,
    name: t.value.tiers.gold,
    icon: 'commerce-gold',
    description: t.value.planDescriptions.gold,
    mostPopular: false,
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

/* Header */
.paywall-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-24);
  padding: 87px var(--space-12) var(--space-12);
  width: 100%;
  background: var(--color-gray-900) url('../assets/background-decoration-new.svg') center bottom / auto no-repeat;
  position: relative;
  overflow: hidden;
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

/* Body - Plan List */
.paywall-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: var(--space-24) var(--space-12) var(--space-12);
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 366px;
}

.plan-button {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-16) var(--space-12) var(--space-16) var(--space-24);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0px 2px 4px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.14),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
  cursor: pointer;
}

.plan-button--selected {
  outline: var(--border-3) solid var(--color-border-selected);
  outline-offset: var(--space-2);
}

.plan-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.plan-name {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.18;
  color: var(--color-text-boldest);
}

.plan-description {
  font-family: 'Inter', var(--font-family-system);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.33;
  color: var(--color-transparent-white-72);
}

.most-popular-chip {
  position: absolute;
  top: -13px;
  left: var(--space-24);
  padding: 2px 4px;
  background: var(--color-border-selected);
  border-radius: 3px;
  font-family: 'Inter', var(--font-family-system);
  font-size: 11.25px;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-boldest);
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
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
