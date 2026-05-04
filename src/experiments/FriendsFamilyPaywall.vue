<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { CcButton, CcIconButton, CcSegmentedControl } from '@chesscom/design-system'
import { getTranslations, type LangCode } from './translations'

type TierId = 'gold' | 'platinum' | 'diamond' | 'friendsAndFamily'
type BillingType = 'monthly' | 'yearly'

const props = withDefaults(
  defineProps<{
    lang?: LangCode
    platform?: 'ios' | 'android'
    deviceId?: string
    orientation?: 'portrait' | 'landscape'
    trialEligible?: boolean
    billing?: BillingType
  }>(),
  {
    lang: 'en',
    platform: 'ios',
    deviceId: 'phone-md',
    orientation: 'portrait',
    trialEligible: true,
    billing: 'yearly',
  }
)

const emit = defineEmits<{
  selectPlan: [{ tier: TierId; billing: BillingType }]
  back: []
  changeBilling: [BillingType]
}>()

const t = computed(() => getTranslations(props.lang))

const isTablet = computed(() => props.deviceId?.includes('tablet') ?? false)
const isLandscape = computed(() => props.orientation === 'landscape')
const isMonthly = computed(() => props.billing === 'monthly')

// ───────── Pricing ─────────
const pricing: Record<TierId, { yearly?: { monthlyRate: number; annualTotal: number }; monthly?: { monthlyRate: number } }> = {
  gold: {
    yearly: { monthlyRate: 4.17, annualTotal: 49.99 },
    monthly: { monthlyRate: 6.99 },
  },
  platinum: {
    yearly: { monthlyRate: 6.67, annualTotal: 79.99 },
    monthly: { monthlyRate: 10.99 },
  },
  diamond: {
    yearly: { monthlyRate: 10.0, annualTotal: 119.99 },
    monthly: { monthlyRate: 16.99 },
  },
  friendsAndFamily: {
    yearly: { monthlyRate: 16.67, annualTotal: 199.99 },
    // F&F has no monthly option — yearly only
  },
}

const formatPrice = (n: number) => n.toFixed(2)

// Savings vs the F&F-comparison "monthly" rate (Figma shows SAVE 72%)
const fnfSavingsPercent = 72

// ───────── Icons (Figma glyph variant) ─────────
// Per Figma kaR1EjLjQVk0yP9dBbZaPT, feature icons use the GLYPH variant —
// single-path monochrome SVGs from chess.com's /glyphs/ CDN tinted with the
// Figma fill color via CSS mask-image. Names below match the Figma node names.
const glyph = (name: string) => `https://www.chess.com/bundles/web/images/glyphs/${name}.svg`

const figmaIcons = {
  gameReview: glyph('move-circle-best'),
  moveExplanations: glyph('move-circle-brilliant'),
  insights: glyph('device-bulb-glow'),
  puzzles: glyph('game-type-puzzle'),
  lessons: glyph('game-lesson'),
  coachGames: glyph('game-lesson-student'),
  bots: glyph('game-type-computer'),
  noAds: glyph('circle-block'),
  users: glyph('users'),
} as const

// ───────── Tier configuration ─────────
interface FeatureRow {
  id: string
  icon: string
  color: string
  label: string
}

const tiers = computed<{
  id: TierId
  name: string
  iconKind: 'gold' | 'platinum' | 'diamond' | 'fnf'
  badge?: 'mostPopular' | 'savePercent' | null
  features: FeatureRow[]
  membersChip?: boolean
  yearlyOnly?: boolean
}[]>(() => [
  {
    id: 'gold',
    name: t.value.tiers.gold,
    iconKind: 'gold',
    features: [
      { id: 'puzzles', icon: figmaIcons.puzzles, color: '#E8833A', label: t.value.fnfFeatures.puzzles },
      { id: 'lessons', icon: figmaIcons.lessons, color: '#48A8B5', label: t.value.fnfFeatures.lessons },
      { id: 'coachGames', icon: figmaIcons.coachGames, color: '#8BA84B', label: t.value.fnfFeatures.coachGames },
      { id: 'bots', icon: figmaIcons.bots, color: '#7B9AAE', label: t.value.fnfFeatures.bots },
      { id: 'noAds', icon: figmaIcons.noAds, color: '#D04040', label: t.value.fnfFeatures.noAds },
    ],
  },
  {
    id: 'platinum',
    name: t.value.tiers.platinum,
    iconKind: 'platinum',
    features: [
      { id: 'gameReview', icon: figmaIcons.gameReview, color: '#81B64C', label: t.value.fnfFeatures.gameReview },
      { id: 'puzzles', icon: figmaIcons.puzzles, color: '#E8833A', label: t.value.fnfFeatures.puzzles },
      { id: 'lessons', icon: figmaIcons.lessons, color: '#48A8B5', label: t.value.fnfFeatures.lessons },
      { id: 'coachGames', icon: figmaIcons.coachGames, color: '#8BA84B', label: t.value.fnfFeatures.coachGames },
      { id: 'bots', icon: figmaIcons.bots, color: '#7B9AAE', label: t.value.fnfFeatures.bots },
      { id: 'noAds', icon: figmaIcons.noAds, color: '#D04040', label: t.value.fnfFeatures.noAds },
    ],
  },
  {
    id: 'diamond',
    name: t.value.tiers.diamond,
    iconKind: 'diamond',
    badge: 'mostPopular',
    features: [
      { id: 'gameReview', icon: figmaIcons.gameReview, color: '#81B64C', label: t.value.fnfFeatures.gameReview },
      { id: 'moveExplanations', icon: figmaIcons.moveExplanations, color: '#48B088', label: t.value.fnfFeatures.moveExplanations },
      { id: 'insights', icon: figmaIcons.insights, color: '#F5C342', label: t.value.fnfFeatures.insights },
      { id: 'puzzles', icon: figmaIcons.puzzles, color: '#E8833A', label: t.value.fnfFeatures.puzzles },
      { id: 'lessons', icon: figmaIcons.lessons, color: '#48A8B5', label: t.value.fnfFeatures.lessons },
      { id: 'coachGames', icon: figmaIcons.coachGames, color: '#8BA84B', label: t.value.fnfFeatures.coachGames },
      { id: 'bots', icon: figmaIcons.bots, color: '#7B9AAE', label: t.value.fnfFeatures.bots },
      { id: 'noAds', icon: figmaIcons.noAds, color: '#D04040', label: t.value.fnfFeatures.noAds },
    ],
  },
  {
    id: 'friendsAndFamily',
    name: t.value.tiers.friendsAndFamily,
    iconKind: 'fnf',
    badge: 'savePercent',
    membersChip: true,
    yearlyOnly: true,
    features: [
      { id: 'gameReview', icon: figmaIcons.gameReview, color: '#81B64C', label: t.value.fnfFeatures.gameReview },
      { id: 'moveExplanations', icon: figmaIcons.moveExplanations, color: '#48B088', label: t.value.fnfFeatures.moveExplanations },
      { id: 'insights', icon: figmaIcons.insights, color: '#F5C342', label: t.value.fnfFeatures.insights },
      { id: 'puzzles', icon: figmaIcons.puzzles, color: '#E8833A', label: t.value.fnfFeatures.puzzles },
      { id: 'lessons', icon: figmaIcons.lessons, color: '#48A8B5', label: t.value.fnfFeatures.lessons },
      { id: 'coachGames', icon: figmaIcons.coachGames, color: '#8BA84B', label: t.value.fnfFeatures.coachGames },
      { id: 'bots', icon: figmaIcons.bots, color: '#7B9AAE', label: t.value.fnfFeatures.bots },
      { id: 'noAds', icon: figmaIcons.noAds, color: '#D04040', label: t.value.fnfFeatures.noAds },
    ],
  },
])

// ───────── Selected tier (default to F&F per Figma) ─────────
const selectedTier = ref<TierId>('friendsAndFamily')
const selectTier = (tierId: TierId) => {
  selectedTier.value = tierId
}

// Tablet: Gold, Platinum, Diamond, F&F. Mobile: Diamond, Platinum, Gold, F&F.
const orderedTiers = computed(() => {
  if (isTablet.value) return tiers.value
  // Mobile order: Diamond, Platinum, Gold, F&F
  const mobileOrder: TierId[] = ['diamond', 'platinum', 'gold', 'friendsAndFamily']
  return mobileOrder
    .map(id => tiers.value.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined)
})

// ───────── Headline ─────────
const headline = computed(() =>
  props.trialEligible
    ? t.value.trialEligible.headline
    : t.value.notTrialEligible.headline
)
const ctaLabel = computed(() =>
  props.trialEligible ? t.value.trialEligible.cta : t.value.notTrialEligible.cta
)

// ───────── Mobile carousel state ─────────
const carouselEl = ref<HTMLElement | null>(null)
const visibleCardIndex = ref(3) // F&F is the 4th (last) card on mobile
const cardEls = ref<(HTMLElement | null)[]>([])

const setCardRef = (idx: number) => (el: any) => {
  cardEls.value[idx] = el as HTMLElement | null
}

const scrollToCard = (idx: number) => {
  const card = cardEls.value[idx]
  if (card && carouselEl.value) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (observer) observer.disconnect()
  if (!carouselEl.value) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          const idx = Number((entry.target as HTMLElement).dataset.cardIdx)
          if (!Number.isNaN(idx)) {
            visibleCardIndex.value = idx
            const tier = orderedTiers.value[idx]
            if (tier) selectedTier.value = tier.id
          }
        }
      })
    },
    {
      root: carouselEl.value,
      threshold: [0.55, 0.75],
    }
  )
  cardEls.value.forEach((el) => {
    if (el) observer!.observe(el)
  })
}

onMounted(() => {
  nextTick(() => {
    if (!isTablet.value) {
      setupObserver()
      // Default scroll to F&F (last card)
      requestAnimationFrame(() => scrollToCard(3))
    }
  })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

watch(
  () => isTablet.value,
  (tablet) => {
    if (tablet) {
      if (observer) observer.disconnect()
    } else {
      nextTick(() => {
        setupObserver()
        scrollToCard(visibleCardIndex.value)
      })
    }
  }
)

// ───────── Handlers ─────────
const handleCta = () => {
  if (selectedTier.value === 'friendsAndFamily' && isMonthly.value) {
    emit('changeBilling', 'yearly')
    return
  }
  emit('selectPlan', { tier: selectedTier.value, billing: props.billing })
}

const handleCtaForTier = (tier: { id: TierId; yearlyOnly?: boolean }) => {
  selectedTier.value = tier.id
  if (tier.yearlyOnly && isMonthly.value) {
    emit('changeBilling', 'yearly')
    return
  }
  emit('selectPlan', { tier: tier.id, billing: props.billing })
}

const handleSwitchToYearly = () => {
  emit('changeBilling', 'yearly')
}

const onCardBillingChange = (idx: number) => {
  emit('changeBilling', idx === 0 ? 'yearly' : 'monthly')
}

// CTA disabled when F&F is selected on monthly billing
const ctaDisabled = computed(
  () => selectedTier.value === 'friendsAndFamily' && isMonthly.value
)
</script>

<template>
  <div
    class="paywall"
    :class="{
      'paywall--tablet': isTablet,
      'paywall--landscape': isLandscape,
    }"
    :data-lang="lang"
    :data-platform="platform"
    :data-orientation="orientation"
    :data-billing="billing"
    :data-device="deviceId"
  >
    <!-- Status Bar (both iOS and Android — Android skips the Dynamic Island) -->
    <div v-if="platform === 'ios' || platform === 'android'" class="ios-status-bar">
      <div class="ios-status-bar-inner">
        <span v-if="isTablet" class="ios-time">9:41 &nbsp;Mon Jun 6</span>
        <span v-else class="ios-time">9:41</span>
        <div v-if="!isTablet && platform === 'ios'" class="ios-dynamic-island" />
        <div class="ios-status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0" y="7" width="3" height="4" rx="0.5" fill="white"/><rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5" fill="white"/><rect x="9" y="2" width="3" height="9" rx="0.5" fill="white"/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="white"/></svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none"><path d="M7.5 10.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" fill="white" transform="translate(0,-2)"/><path d="M4.5 8.5a4.2 4.2 0 0 1 6 0" stroke="white" stroke-width="1.3" stroke-linecap="round"/><path d="M2 5.8a7.5 7.5 0 0 1 11 0" stroke="white" stroke-width="1.3" stroke-linecap="round"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" stroke-opacity="0.35"/><rect x="2" y="2" width="18" height="7" rx="1" fill="white"/><path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fill-opacity="0.4"/></svg>
        </div>
      </div>
    </div>

    <!-- Page header: title centered (back button is absolutely positioned, see below) -->
    <div class="page-header">
      <h1 class="paywall-title">{{ headline }}</h1>

      <!-- Billing segmented control (tablet shows it inline; mobile shows it via panel) -->
      <div v-if="isTablet" class="billing-toggle-row">
        <CcSegmentedControl
          :labels="[t.yearly, t.monthly]"
          :selected="billing === 'yearly' ? 0 : 1"
          size="medium"
          @segment-clicked="emit('changeBilling', $event === 0 ? 'yearly' : 'monthly')"
        />
      </div>
    </div>

    <!-- Back button — absolutely positioned per Figma (left:12, top:49, 48x48) -->
    <nav class="paywall-nav">
      <CcIconButton
        :icon="{ name: 'arrow-line-left', variant: 'glyph' }"
        variant="ghost"
        size="medium"
        @click="emit('back')"
      />
    </nav>

    <!-- Tier comparison area -->
    <div class="tier-area">
      <div
        ref="carouselEl"
        class="tier-grid"
        :class="{ 'tier-grid--carousel': !isTablet }"
      >
        <article
          v-for="(tier, idx) in orderedTiers"
          :key="tier.id"
          :ref="setCardRef(idx)"
          :data-card-idx="idx"
          class="tier-card"
          :class="{
            'tier-card--selected': selectedTier === tier.id && !(tier.yearlyOnly && isMonthly),
            'tier-card--muted': tier.yearlyOnly && isMonthly,
          }"
          role="button"
          tabindex="0"
          @click="selectTier(tier.id)"
          @keydown.enter="selectTier(tier.id)"
          @keydown.space.prevent="selectTier(tier.id)"
        >
          <!-- Tier icon overlap -->
          <div class="tier-icon" :class="`tier-icon--${tier.iconKind}`" aria-hidden="true">
            <img
              v-if="tier.iconKind === 'fnf'"
              src="https://www.chess.com/bundles/web/images/color-icons/heart-green.svg"
              alt="Friends & Family"
              width="56"
              height="56"
            />
            <img
              v-else-if="tier.iconKind === 'gold'"
              src="https://www.chess.com/bundles/web/images/color-icons/commerce-gold.svg"
              alt="Gold"
              width="56"
              height="56"
            />
            <img
              v-else-if="tier.iconKind === 'platinum'"
              src="https://www.chess.com/bundles/web/images/color-icons/commerce-platinum.svg"
              alt="Platinum"
              width="56"
              height="56"
            />
            <img
              v-else-if="tier.iconKind === 'diamond'"
              src="https://www.chess.com/bundles/web/images/color-icons/commerce-diamond.svg"
              alt="Diamond"
              width="56"
              height="56"
            />
          </div>

          <!-- Card body — inner wrapper sits inside .tier-card shell -->
          <div class="tier-card-inner">
            <!-- Header: title + save chip (tight stacking, matches Figma) -->
            <header class="tier-header">
              <h2 class="tier-name">{{ tier.name }}</h2>
              <span
                v-if="tier.badge === 'mostPopular'"
                class="tier-badge tier-badge--popular"
              >{{ t.mostPopular.toUpperCase() }}</span>
              <span
                v-else-if="tier.badge === 'savePercent'"
                class="tier-badge tier-badge--save"
              >{{ t.saveLabel(fnfSavingsPercent) }}</span>
            </header>

            <!-- Members row (separate element below header — F&F only) -->
            <div v-if="tier.membersChip" class="tier-members">
              <span
                class="tier-members-icon glyph-icon"
                :style="{ '--glyph-url': `url(${figmaIcons.users})`, '--glyph-color': '#FFFFFF' }"
                aria-hidden="true"
              />
              <span>{{ t.membersRange }}</span>
            </div>

            <!-- Features list (flex grows, vertically centered) -->
            <div class="tier-features-wrapper">
              <ul class="tier-features">
                <li v-for="f in tier.features" :key="f.id" class="tier-feature">
                  <span
                    class="tier-feature-icon glyph-icon"
                    :style="{ '--glyph-url': `url(${f.icon})`, '--glyph-color': f.color }"
                    :aria-label="f.label"
                  />
                  <span class="tier-feature-label">{{ f.label }}</span>
                </li>
              </ul>
            </div>

            <!-- Bottom group: pricing + CTA section (gap 16) -->
            <div class="tier-bottom">
              <!-- Pricing block: price + sub + pill (F&F only) -->
              <div class="tier-pricing">
                <!-- F&F yearly-only tier: render price/sub on yearly. On monthly we still render
                     them as invisible placeholders so the pricing block keeps the same layout
                     and the YEARLY PLAN ONLY pill stays in the exact same vertical position. -->
                <template v-if="tier.yearlyOnly && pricing[tier.id].yearly">
                  <div
                    class="tier-price"
                    :class="{ 'tier-price--placeholder': isMonthly, 'tier-price--android': platform === 'android' }"
                  >
                    ${{ formatPrice(pricing[tier.id].yearly!.monthlyRate) }} / month
                  </div>
                  <div
                    v-if="platform === 'android'"
                    class="tier-price-billing"
                    :class="{ 'tier-price--placeholder': isMonthly }"
                  >
                    {{ t.androidAnnualSummary(`$${formatPrice(pricing[tier.id].yearly!.annualTotal)}`) }}
                  </div>
                  <div
                    v-else
                    class="tier-price-sub"
                    :class="{ 'tier-price--placeholder': isMonthly }"
                  >
                    {{ t.billedAnnually(`$${formatPrice(pricing[tier.id].yearly!.annualTotal)}`) }}
                  </div>
                </template>

                <!-- Standard tiers (Gold / Platinum / Diamond) -->
                <template v-else>
                  <template v-if="!isMonthly && pricing[tier.id].yearly">
                    <div v-if="pricing[tier.id].monthly && platform !== 'android'" class="tier-price-old">
                      ${{ formatPrice(pricing[tier.id].monthly!.monthlyRate) }} / month
                    </div>
                    <div class="tier-price" :class="{ 'tier-price--android': platform === 'android' }">
                      ${{ formatPrice(pricing[tier.id].yearly!.monthlyRate) }} / month
                    </div>
                    <div v-if="platform === 'android'" class="tier-price-billing">
                      {{ t.androidAnnualSummary(`$${formatPrice(pricing[tier.id].yearly!.annualTotal)}`) }}
                    </div>
                    <div v-else class="tier-price-sub">
                      {{ t.billedAnnually(`$${formatPrice(pricing[tier.id].yearly!.annualTotal)}`) }}
                    </div>
                  </template>
                  <template v-else-if="pricing[tier.id].monthly">
                    <div class="tier-price" :class="{ 'tier-price--android': platform === 'android' }">
                      ${{ formatPrice(pricing[tier.id].monthly!.monthlyRate) }} / month
                    </div>
                  </template>
                </template>

                <!-- "YEARLY PLAN ONLY" pill — yearly state: ABOVE pricing (inside pricing block).
                     Mobile always uses this. Tablet monthly moves the pill below (see sibling div). -->
                <div
                  v-if="tier.yearlyOnly && (!isTablet || !isMonthly)"
                  class="tier-yearly-pill"
                >{{ t.yearlyPlanOnly }}</div>

                <!-- Android Google Play disclaimer (below pricing inside the card) -->
                <p
                  v-if="platform === 'android' && !isTablet && !isMonthly && pricing[tier.id].yearly"
                  class="tier-android-disclaimer"
                >
                  {{ t.androidGooglePlayDisclaimerYearly(
                    `$${formatPrice(pricing[tier.id].yearly!.annualTotal)}`,
                    `$${formatPrice(pricing[tier.id].yearly!.monthlyRate)}/mo`
                  ) }}
                </p>
              </div>

              <!-- Tablet F&F monthly: pill + switch link as siblings of pricing.
                   Pill 8px above switch link, switch link 16px from card bottom. -->
              <template v-if="tier.yearlyOnly && isMonthly && isTablet">
                <div class="tier-yearly-pill tier-yearly-pill--monthly">{{ t.yearlyPlanOnly }}</div>
                <button
                  class="tier-switch-link tier-switch-link--inline"
                  type="button"
                  @click.stop="handleSwitchToYearly"
                >
                  {{ t.switchToYearly }}
                </button>
              </template>

              <!-- CTA section: in-card billing toggle (Gold/Platinum/Diamond) + button.
                   Hidden on Android since the CTA lives outside the card in a bottom tab bar. -->
              <div v-if="!isTablet && platform !== 'android'" class="tier-cta-section">
                <!-- Per-card Yearly/Monthly toggle — not shown on F&F (yearly-only) -->
                <div v-if="!tier.yearlyOnly" class="tier-billing-toggle">
                  <CcSegmentedControl
                    :labels="[t.yearly, t.monthly]"
                    :selected="billing === 'yearly' ? 0 : 1"
                    size="small"
                    @segment-clicked="onCardBillingChange"
                  />
                </div>

                <button
                  v-if="tier.yearlyOnly && isMonthly"
                  class="tier-switch-link"
                  type="button"
                  @click.stop="handleSwitchToYearly"
                >
                  {{ t.switchToYearly }}
                </button>
                <template v-else>
                  <CcButton
                    :label="ctaLabel"
                    variant="monetization"
                    size="x-large"
                    :icon-end="!trialEligible ? { name: 'utility-link-external', variant: 'glyph' } : undefined"
                    :disabled="tier.yearlyOnly && isMonthly"
                    fullWidth
                    @click.stop="handleCtaForTier(tier)"
                  />
                </template>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Carousel dots (mobile only) — hidden on Android since dots live in the bottom tab bar instead. -->
      <div v-if="!isTablet && platform !== 'android'" class="carousel-dots" aria-hidden="true">
        <button
          v-for="(_, idx) in orderedTiers"
          :key="idx"
          class="dot"
          :class="{ 'dot--active': visibleCardIndex === idx }"
          type="button"
          @click="scrollToCard(idx)"
        />
      </div>
    </div>

    <!-- Android: V6 Tab Bar Phone — sits at the bottom of the screen, contains
         the carousel dots + the Go Premium CTA button + home indicator -->
    <div v-if="!isTablet && platform === 'android'" class="android-tab-bar">
      <div class="android-tab-bar-bg" aria-hidden="true" />
      <div class="carousel-dots android-tab-bar-dots" aria-hidden="true">
        <button
          v-for="(_, idx) in orderedTiers"
          :key="idx"
          class="dot"
          :class="{ 'dot--active': visibleCardIndex === idx }"
          type="button"
          @click="scrollToCard(idx)"
        />
      </div>
      <div class="android-cta-wrap">
        <CcButton
          :label="ctaLabel"
          variant="monetization"
          size="x-large"
          fullWidth
          @click="handleCta"
        />
      </div>
    </div>

    <!-- Tablet-only disclaimer + CTA — flows naturally after the cards (NOT a sticky footer) -->
    <div v-if="isTablet" class="paywall-section-end">
      <p class="all-plans-include">
        <strong>{{ t.allPlansInclude.split(':')[0] }}:</strong>
        {{ t.allPlansInclude.split(':').slice(1).join(':').trim() }}
      </p>

      <div class="cta-wrap">
        <CcButton
          :label="ctaLabel"
          variant="monetization"
          size="x-large"
          :disabled="ctaDisabled"
          fullWidth
          @click="handleCta"
        />
      </div>
    </div>

    <!-- Tablet home indicator — pinned to the bottom of the paywall (separate from CTA) -->
    <div v-if="isTablet && platform === 'ios'" class="home-indicator home-indicator--tablet">
      <div class="home-indicator-pill" />
    </div>

  </div>
</template>

<style scoped>
/* ════════════════════════════════════════════════════════════
   BASE LAYOUT
   ════════════════════════════════════════════════════════════ */
.paywall {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--color-bg-primary, #312e2b);
  color: var(--color-text-boldest, #fff);
  font-family: 'Inter', var(--font-family-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  position: relative;
  overflow: hidden;
}
/* Landscape mobile: let content overflow naturally so the parent device-content scrolls */
.paywall--landscape:not(.paywall--tablet) {
  height: auto;
  min-height: 100%;
  overflow: visible;
}

/* ════════════════════════════════════════════════════════════
   iOS STATUS BAR
   ════════════════════════════════════════════════════════════ */
.ios-status-bar {
  position: relative;
  z-index: 100;
  height: 47px;
  flex-shrink: 0;
}
.ios-status-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  position: relative;
}
.paywall--tablet .ios-status-bar-inner {
  padding: 0 28px;
}
.ios-time {
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
}
.paywall:not(.paywall--tablet) .ios-time {
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

/* ════════════════════════════════════════════════════════════
   PAGE HEADER
   ════════════════════════════════════════════════════════════ */
.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px 4px;
  flex-shrink: 0;
  gap: 4px;
  width: 100%;
  position: relative;
}
/* Android mobile header per Figma 7066:52571: pt-8, pb-16, px-12, gap-4 */
.paywall[data-platform="android"]:not(.paywall--tablet) .page-header {
  padding: 8px 12px 16px;
  gap: 4px;
}
/* Tablet header per spec: H1 ↔ toggle = 24px (gap), toggle ↔ cards = 24px (no pb here, cards have 24 above) */
.paywall--tablet .page-header {
  padding: 0 8px 0;
  gap: 24px;
  margin-top: auto;
  max-width: 960px;
  width: 100%;
  align-self: center;
}
/* On tablet medium and large in portrait, the viewport is much taller — top-align content
   below the back arrow with comfortable spacing instead of vertically centering. */
.paywall--tablet[data-orientation="portrait"][data-device="tablet-md"] .page-header,
.paywall--tablet[data-orientation="portrait"][data-device="tablet-lg"] .page-header {
  /* Back arrow sits at top: 56px (height 48px) → ends at 104px. Add 24px gap below it. */
  margin-top: 80px;
}
.paywall--tablet[data-orientation="portrait"][data-device="tablet-md"] .paywall-section-end,
.paywall--tablet[data-orientation="portrait"][data-device="tablet-lg"] .paywall-section-end {
  margin-bottom: 0;
}

/* Back button absolutely positioned (Figma: top: 49px, left: 12px, size 48x48) */
.paywall-nav {
  position: absolute;
  top: 49px;
  left: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.paywall--tablet .paywall-nav {
  top: 56px;
  left: 24px;
}

.paywall-title {
  margin: 0;
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 22px;
  font-weight: 800;
  line-height: 28px;
  text-align: center;
  color: var(--color-text-boldest, #fff);
  max-width: 250px;
  width: 100%;
}
/* Tablet headline: Heading/large-bold per Figma — 36px Chess Sans Bold (700, not ExtraBold) */
.paywall--tablet .paywall-title {
  font-size: 36px;
  line-height: 40px;
  font-weight: 700;
  max-width: none;
}
.billing-toggle-row {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
  width: 100%;
}

/* ════════════════════════════════════════════════════════════
   TIER AREA
   ════════════════════════════════════════════════════════════ */
.tier-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}
/* Landscape mobile: tier area sizes to content so the page can scroll */
.paywall--landscape:not(.paywall--tablet) .tier-area {
  flex: 0 0 auto;
  min-height: 0;
}
/* Tablet portrait: cards row has Figma's fixed h-506. Landscape overrides to h-447. */
.paywall--tablet .tier-area {
  flex: 0 0 506px;
  height: 506px;
  max-height: 506px;
  min-height: 0;
  justify-content: flex-start;
  margin-top: 24px;
  margin-bottom: 16px;
  width: 100%;
  align-self: center;
}
.paywall--tablet:not(.paywall--landscape) .tier-grid {
  height: 100%;
  padding-top: 24px;
  max-width: 100%;
  gap: 0;
}
.paywall--tablet:not(.paywall--landscape) .tier-card {
  height: 100%;
}
.paywall--tablet:not(.paywall--landscape) .tier-card-inner {
  height: 100%;
}
/* Figma portrait List has w-[150px] — constrain feature label area */
.paywall--tablet:not(.paywall--landscape) .tier-features {
  max-width: 150px;
}

/* Tablet grid: 4 cards in a row */
.tier-grid {
  display: flex;
  gap: 8px;
  align-items: stretch;
  padding: 24px 16px 8px;
  width: 100%;
}
.paywall--tablet .tier-grid {
  /* 24px top reserves room for the icons overhanging the card edge */
  padding: 24px 8px 0;
  justify-content: center;
  flex-wrap: nowrap;
  flex: 0 0 auto;
  gap: 8px;
}

/* Mobile carousel: horizontal scroll-snap. Portrait fills height; landscape sizes to content. */
.tier-grid--carousel {
  flex: 1;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 36px 12px 0;
  gap: 12px;
  align-items: stretch;
}
.paywall--landscape:not(.paywall--tablet) .tier-grid--carousel {
  flex: 0 0 auto;
  min-height: 0;
  /* Stretch so all cards match the tallest sibling's height */
  align-items: stretch;
  /* Use "safe center" so when content overflows, scroll start remains reachable */
  justify-content: safe center;
  /* Add side padding so first and last cards can snap to center horizontally */
  padding-left: max(12px, calc((100% - 366px) / 2));
  padding-right: max(12px, calc((100% - 366px) / 2));
}
.tier-grid--carousel::-webkit-scrollbar {
  display: none;
}

/* ─── Tier card outer SHELL (matches Figma "V6S" wrapper) ─── */
.tier-card {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* Selected/unselected: 3px border, transparent when not selected so layout doesn't shift */
  border: 3px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.paywall--tablet .tier-card {
  /* Figma V6S p-8: 8px padding inside each card. With grid gap-0, this gives 16px
     between adjacent inner cards (8+8) — landscape spec. */
  padding: 8px;
  border: none;
}
/* Tablet portrait keeps Figma's 8px padding → 16px between adjacent inner cards (Figma 7055:31431 V6S p-8) */
/* Mobile portrait: card fills carousel height. Landscape: card sizes to content. */
.tier-grid--carousel .tier-card {
  flex: 0 0 calc(100% - 6px);
  height: 100%;
  scroll-snap-align: center;
  padding: 5px; /* visible gap between green border and inner card */
}
.paywall--landscape:not(.paywall--tablet) .tier-grid--carousel .tier-card {
  /* Landscape: keep card the same width as portrait (~ phone width minus gutters) */
  flex: 0 0 366px;
  max-width: 366px;
  /* Override the mobile portrait `height: 100%` to auto so flex stretch can work.
     With align-items: stretch on parent, all items get stretched to the tallest's height. */
  height: auto;
}

/* Selected (green border like Figma) */
.tier-card--selected {
  border-color: var(--color-border-selected, #81b64c);
}
.paywall--tablet .tier-card--selected {
  /* Use inset box-shadow as the border so it sits INSIDE the .tier-card box —
     doesn't extend outward into adjacent cards (the way outline did) and doesn't
     eat from inner width (the way border would). 3px inset = exactly Figma's border-3. */
  border-color: transparent;
  outline: none;
  box-shadow: inset 0 0 0 3px var(--color-border-selected, #81b64c);
}

/* Muted (F&F when monthly billing is active) — per Figma:
   - 2px dashed border at rgba(255,255,255,0.10)
   - backdrop blur stays
   - drop-shadows stay
   - no gradient background image */
.tier-card--muted {
  border-color: transparent;
}
.tier-card--muted .tier-card-inner {
  background: transparent;
  /* Use outline instead of border so the dashed line doesn't eat into the inner card width
     (which would cause feature labels like "Unlimited Move Explanations" to wrap differently
     between yearly and monthly states). */
  border: none;
  outline: 2px dashed rgba(255, 255, 255, 0.10);
  outline-offset: -2px;
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.10),
    0 1px 2px 0 rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}
.tier-card--muted .tier-card-inner > *:not(.tier-bottom) {
  opacity: 0.55;
  filter: grayscale(0.4);
}
/* Heart icon stays full color/opacity even on the disabled card (per Figma) */

/* ─── Tier icon (overlap card top) ─── */
.tier-icon {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.30));
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tier-icon img {
  display: block;
  width: 56px !important;
  height: 56px !important;
}
.tier-grid--carousel .tier-icon {
  top: -34px;
}
/* Tablet: Figma's top -34px is relative to the inner Wrapper. With .tier-card padding 8px,
   the icon needs to be -26px from .tier-card edge to land at -34px from the inner wrapper. */
.paywall--tablet .tier-icon {
  top: -26px;
}

/* ─── Card inner ─── */
.tier-card-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: var(--radius-xl, 10px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.10),
    0 1px 2px 0 rgba(0, 0, 0, 0.14),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  position: relative;
  width: 100%;
  height: 100%;
}
/* Landscape: card-inner fills the stretched .tier-card so equal heights are visible */
.paywall--landscape:not(.paywall--tablet) .tier-card-inner {
  height: 100%;
}
/* Figma 7060:42006 V6S Wrapper: py-24 px-16, gap-12 */
.paywall--tablet .tier-card-inner {
  padding: 24px 16px;
  gap: 12px;
}
.tier-grid--carousel .tier-card-inner {
  padding: 24px 16px;
  gap: 12px;
}

/* Features wrapper grows to fill space and centers the list vertically (portrait + tablet).
   On small portrait phones where features overflow, the list becomes scrollable.
   "safe center" makes overflowing content fall back to top-aligned so the top items remain reachable. */
.tier-features-wrapper {
  flex: 1;
  display: flex;
  align-items: safe center;
  justify-content: center;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}
.tier-features-wrapper::-webkit-scrollbar {
  width: 4px;
}
.tier-features-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 2px;
}
.tier-features-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
/* Figma 7060:42006 List: flex-1, items-start (left-align), justify-center (vertical center), gap-8.
   Use "safe center" so when content overflows the wrapper the alignment falls back to top —
   prevents the top feature (e.g. Game Review on F&F's 8-item list) from being clipped. */
.paywall--tablet .tier-features-wrapper {
  align-items: safe center;
  justify-content: safe center;
  padding-top: 0;
  overflow: visible;
}
/* Landscape mobile: features grow to push pricing/CTA to the bottom of the (now-stretched) card.
   Tallest card defines row height; shorter ones fill their extra space via this flex grow. */
.paywall--landscape:not(.paywall--tablet) .tier-features-wrapper {
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
  align-items: flex-start;
}
.tier-features-wrapper > .tier-features {
  width: auto;
}

/* Per-card CTA wrapper (mobile only) */
.tier-card-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
}
.tier-card-cta .cc-button,
.tier-card-cta button {
  width: 100%;
}
.tier-pay-in-app {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 16px;
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
  text-transform: uppercase;
}

/* Spacer that pushes CTA to bottom of card */
.tier-spacer {
  flex: 1;
  min-height: 8px;
}
.tier-grid--carousel .tier-spacer {
  flex: 1;
  min-height: 16px;
}

/* Mobile-only home indicator */
.home-indicator--mobile {
  flex-shrink: 0;
  margin-top: 0;
}

/* ─── Header (title + chip stacked tight) ─── */
.tier-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  width: 100%;
}
/* Tablet header sub-block: Figma h-50, but use min-height so 2-line wrapped titles
   (e.g., "Friends & Family" on the narrow portrait card) don't overlap the chip below. */
.paywall--tablet .tier-header {
  min-height: 50px;
  justify-content: flex-start;
}
.tier-grid--carousel .tier-header {
  gap: 2px;
}
.tier-name {
  margin: 0;
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 18px;
  font-weight: 800;
  line-height: 22px;
  color: var(--color-text-boldest, #fff);
}
.paywall--tablet .tier-name {
  font-size: 20px;
  line-height: 24px;
}
/* Tablet portrait: cards are narrower — use Heading/xx-small-bold so titles like
   "Friends & Family" fit on one line instead of wrapping. */
.paywall--tablet:not(.paywall--landscape) .tier-name {
  font-size: 17px;
  line-height: 22px;
  font-weight: 800;
}
.tier-grid--carousel .tier-name {
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 0;
}

.tier-badge {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  line-height: 16px;
  text-transform: uppercase;
  padding: 2px 4px;
  border-radius: var(--radius-m, 3px);
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}
.tier-badge--popular {
  background: var(--color-component-chip-blue-translucent-bg, rgba(0, 159, 217, 0.10));
  color: var(--color-component-chip-blue-translucent-fg, #4dc3ea);
}
.tier-badge--save {
  background: var(--color-component-chip-green-translucent-bg, rgba(48, 87, 48, 0.3));
  color: var(--color-component-chip-green-translucent-fg, #81b64c);
}

.tier-members {
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0;
  width: 100%;
  /* Text/small-bold: 12px / 16px Inter SemiBold */
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--color-text-boldest, #fff);
}
.tier-members-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
}
.tier-grid--carousel .tier-members {
  font-size: 14px;
}

/* ─── Features ─── */
.tier-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: auto;
}
/* Feature spacing — 8px on mobile, 4px on tablet per Figma (denser layout). */
.paywall--tablet .tier-features {
  gap: 4px;
}
.tier-grid--carousel .tier-features {
  gap: 8px;
  padding-left: 0;
}
.tier-feature {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tier-feature-icon {
  flex-shrink: 0;
  display: block;
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.paywall--tablet .tier-feature-icon {
  width: 16px;
  height: 16px;
}

/* ─── Glyph icon: monochrome SVG tinted with Figma color via CSS mask-image ─── */
.glyph-icon {
  flex-shrink: 0;
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: var(--glyph-color, currentColor);
  -webkit-mask-image: var(--glyph-url);
  mask-image: var(--glyph-url);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}
.tier-feature-label {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: var(--color-text-boldest, #fff);
}
/* Tablet (portrait + landscape) uses Text/small-bold (12px / 16px) for features per Figma */
.paywall--tablet .tier-feature-label {
  font-size: 12px;
  line-height: 16px;
}
.tier-grid--carousel .tier-feature-label {
  font-size: 14px;
  line-height: 18px;
}

/* ─── Bottom group (pricing + CTA section) ─── */
.tier-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
/* On F&F (where pricing block ends with the pill), use 24px to CTA */
.tier-bottom:has(.tier-yearly-pill) {
  gap: 24px;
}

/* ─── Pricing (price + sub + optional F&F pill) ─── */
.tier-pricing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  width: 100%;
}
.tier-grid--carousel .tier-pricing {
  gap: 4px;
}
/* Tablet: pricing block has a fixed min-height so features don't shift up when the toggle
   switches Yearly→Monthly (where the strikethrough/sub disappear). 80px fits both the largest
   yearly pricing (strike + price + sub ≈ 68px) and F&F's pill + price + sub ≈ 80px. */
.paywall--tablet .tier-pricing {
  gap: 4px;
  justify-content: flex-end;
  min-height: 80px;
}
/* Mobile only: shift F&F's pricing block DOWN by the pill+gap height (~32px) so
   the price text ($16.67 / month) sits at the same Y as the other cards' price text.
   The pill stays grouped inside the pricing block, just visually below the aligned price. */
.tier-grid--carousel .tier-pricing:has(.tier-yearly-pill) {
  margin-top: 32px;
}

/* CTA section (toggle + button, gap 16) */
.tier-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.tier-cta-section .cc-button,
.tier-cta-section > .tier-cta-section > button,
.tier-cta-section > button.tier-switch-link {
  width: 100%;
}

/* Per-card Yearly/Monthly toggle */
.tier-billing-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tier-price-old {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  color: var(--color-text-subtle, rgba(255, 255, 255, 0.50));
  text-decoration: line-through;
}
.tier-price {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 800;
  line-height: 22px;
  color: var(--color-text-boldest, #fff);
}
.paywall--tablet .tier-price {
  font-size: 18px;
  line-height: 24px;
}
.tier-grid--carousel .tier-price {
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
  margin-top: 0;
}
.tier-price-sub {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
}
.tier-grid--carousel .tier-price-sub {
  font-size: 12px;
  line-height: 16px;
}

/* ─── Android-specific pricing styles ─── */
/* Price text in blue (Material accent) on Android */
.tier-price--android {
  color: var(--color-blue-100, #4dc3ea) !important;
  font-size: 17px !important;
  line-height: 20px !important;
}
/* "12 months • $X" billing summary — Chess Sans ExtraBold 17px white on Android */
.tier-price-billing {
  font-family: var(--font-family-heading, 'Chess Sans', sans-serif);
  font-size: 17px;
  font-weight: 800;
  line-height: 20px;
  color: var(--color-text-boldest, #fff);
  text-align: center;
}
/* Google Play disclaimer text below pricing on Android */
.tier-android-disclaimer {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
  text-align: center;
  margin: 8px 0 0;
  padding: 0;
}

/* ─── Android bottom tab bar (CTA + dots, outside the card) ─── */
.android-tab-bar {
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  width: 100%;
}
.android-tab-bar-bg {
  position: absolute;
  inset: 0;
  background: rgba(38, 36, 33, 0.55);
  backdrop-filter: blur(15.5px);
  -webkit-backdrop-filter: blur(15.5px);
  pointer-events: none;
}
.android-tab-bar-dots {
  position: relative;
  z-index: 1;
  padding: 0;
  margin-bottom: 16px;
}
.android-cta-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  padding: 0 12px 8px;
  display: flex;
  justify-content: center;
}
.android-cta-wrap :deep(.cc-button),
.android-cta-wrap > button {
  width: 100%;
}
/* When F&F is in monthly state, the price/sub still render but are invisible — they hold the
   layout space so the YEARLY PLAN ONLY pill above them stays anchored at the same Y position. */
.tier-price--placeholder {
  visibility: hidden;
}
.tier-yearly-pill {
  align-self: center;
  padding: 2px 4px;
  border-radius: var(--radius-m, 3px);
  background: var(--color-component-chip-gray-translucent-bg, rgba(255, 255, 255, 0.10));
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 16px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  /* Pill sits inside the pricing block now — 12px gap above the pill */
  margin-top: 12px;
}
/* Tablet yearly: pill goes ABOVE the price (top of pricing block) */
.paywall--tablet .tier-yearly-pill {
  order: -1;
  margin-top: 0;
  margin-bottom: 4px;
}
/* Tablet monthly: pill renders as sibling of switch link, 8px above it.
   Switch link sits 16px from inner card bottom (via -8px margin-bottom on tier-bottom). */
.tier-yearly-pill--monthly {
  margin: 0;
  align-self: center;
}
/* Pill is shifted down by 4px so it sits visually closer to the switch link.
   Scoped to .paywall--tablet to win specificity over `.paywall--tablet .tier-yearly-pill`. */
.paywall--tablet .tier-yearly-pill--monthly {
  margin-top: 4px;
}
.paywall--tablet .tier-bottom:has(.tier-switch-link--inline) {
  gap: 4px;
  margin-bottom: -8px;
}
/* On tablet F&F monthly, hide the pricing block entirely (its placeholders aren't needed
   anymore since the pill is now a separate sibling). This frees up vertical space so the
   features list fits without overflowing into the pricing area. */
.paywall--tablet .tier-bottom:has(.tier-switch-link--inline) .tier-pricing {
  display: none;
}
.tier-switch-link {
  background: none;
  border: 0;
  padding: 6px 0;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--color-blue-200, #009fd9);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}
.tier-switch-link:hover {
  color: var(--color-blue-300, #008cd1);
  text-decoration: underline;
}
/* When the switch link is rendered inline inside the pricing block (tablet F&F monthly) */
.tier-switch-link--inline {
  margin-top: 8px;
  align-self: center;
  font-size: 13px;
}

/* ─── Carousel dots (active 10x10, inactive 6x6 per Figma) ───
   Figma: 24px gap above the dots (carousel's gap-y), ~32px below to home indicator. */
.carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 0 16px;
  flex-shrink: 0;
}
.dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 0;
  cursor: pointer;
  transition: width 0.15s ease, height 0.15s ease, background 0.15s ease;
}
.dot--active {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.85);
}

/* ════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════ */
.paywall-footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px 0;
  gap: 8px;
}
/* Disclaimer + CTA on tablet flow naturally as part of the section (not a sticky footer).
   They sit directly under the cards, with margin-bottom: auto pushing them up to vertically center
   the whole section content between the status bar and the home indicator. */
.paywall-section-end {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px 0;
  gap: 16px;
  max-width: 960px;
  width: 100%;
  align-self: center;
  /* The Figma section has pb: 40 — apply as bottom margin so 40px sits between CTA and home indicator */
  margin-bottom: auto;
}
.paywall--tablet .all-plans-include {
  margin: 0;
  padding: 0;
}
.paywall--tablet .cta-wrap {
  padding-top: 8px;
}
/* Home indicator is pinned to the bottom of the paywall (Figma container is 20px tall) */
.paywall--tablet .home-indicator--tablet {
  flex-shrink: 0;
  height: 20px;
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 40px; /* Figma Section pb-40 — gap from CTA section to home indicator */
}
.all-plans-include {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
  text-align: center;
  margin: 0;
  max-width: 640px;
}
.all-plans-include strong {
  font-weight: 700;
  color: var(--color-text-bolder, rgba(255, 255, 255, 0.85));
}
.cta-wrap {
  width: 100%;
  max-width: 360px;
  display: flex;
  justify-content: center;
}
.paywall--tablet .cta-wrap {
  max-width: 320px;
}
.pay-in-app {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 16px;
  color: var(--color-text-default, rgba(255, 255, 255, 0.72));
  text-transform: uppercase;
  padding-top: 4px;
}

/* ════════════════════════════════════════════════════════════
   HOME INDICATOR (iOS)
   ════════════════════════════════════════════════════════════ */
.home-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  padding-top: 4px;
}
.home-indicator-pill {
  width: 134px;
  height: 5px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.25);
}

/* ════════════════════════════════════════════════════════════
   TABLET LANDSCAPE — Figma 7060:42006 specifics
   Cards row has fixed height 447px (Figma `h-[447px]`).
   ════════════════════════════════════════════════════════════ */
.paywall--tablet.paywall--landscape .tier-area {
  flex: 0 0 447px;
  height: 447px;
  max-height: 447px;
}
.paywall--tablet.paywall--landscape .tier-grid {
  height: 100%;
  /* Figma 7060:42006: Body row is w-[1016px] centered in a 1080px viewport,
     leaving 32px on each side. Cards have gap 0 between them. */
  padding: 24px 0 0;
  max-width: 1016px;
  margin-left: auto;
  margin-right: auto;
  gap: 0;
}
.paywall--tablet.paywall--landscape .tier-card {
  height: 100%;
}
.paywall--tablet.paywall--landscape .tier-card-inner {
  height: 100%;
}

/* ════════════════════════════════════════════════════════════
   REDUCED MOTION
   ════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .tier-card, .dot { transition: none; }
}
</style>
