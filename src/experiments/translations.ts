export type LangCode = 'en' | 'de' | 'uk'

export interface PricingStateStrings {
  headline: string
  cta: string
}

export interface TranslationStrings {
  trialEligible: PricingStateStrings
  notTrialEligible: PricingStateStrings
  yearly: string
  monthly: string
  billedAnnually: (total: string) => string
  perMonth: (rate: string) => string
  unlimited: string
  mostPopular: string
  saveLabel: (percent: number) => string
  membersRange: string
  yearlyPlanOnly: string
  switchToYearly: string
  allPlansInclude: string
  payInApp: string
  features: {
    puzzles: string
    lessons: string
    bots: string
    playCoach: string
    noAds: string
    gameReview: string
    moveExplanations: string
    insights: string
    coursesPerks: string
  }
  fnfFeatures: {
    gameReview: string
    moveExplanations: string
    insights: string
    puzzles: string
    lessons: string
    coachGames: string
    bots: string
    noAds: string
  }
  tiers: {
    gold: string
    platinum: string
    diamond: string
    friendsAndFamily: string
  }
  planDescriptions: {
    diamond: string
    platinum: string
    gold: string
    friendsAndFamily: string
  }
  androidPerMonthDisplay: (rate: string) => string
  androidAnnualSummary: (total: string) => string
  androidGooglePlayDisclaimerYearly: (annualTotal: string, monthlyEquivPerMo: string) => string
  androidGooglePlayDisclaimerMonthly: (monthlyRate: string) => string
}

export const translations: Record<LangCode, TranslationStrings> = {
  en: {
    trialEligible: {
      headline: 'Get 1 Week of Premium for Free',
      cta: 'Try for $0.00',
    },
    notTrialEligible: {
      headline: 'Get the Very Best of Chess',
      cta: 'Go Premium',
    },
    yearly: 'Yearly',
    monthly: 'Monthly',
    billedAnnually: (total) => `billed annually, ${total} / year`,
    perMonth: (rate) => `${rate} / month`,
    unlimited: 'UNLIMITED',
    mostPopular: 'Most Popular',
    saveLabel: (percent) => `SAVE ${percent}%`,
    membersRange: '2-6 members',
    yearlyPlanOnly: 'YEARLY PLAN ONLY',
    switchToYearly: 'Switch to Yearly to Subscribe',
    allPlansInclude: 'All Premium Plans Include: Puzzle Battle, Custom Flair, Opening Explorer, Drills, Club Management, and Time-out Protection for Daily Games',
    payInApp: 'PAY IN APP',
    features: {
      puzzles: 'Puzzles',
      lessons: 'Lessons',
      bots: 'Bots',
      playCoach: 'Play Coach',
      noAds: 'No Ads',
      gameReview: 'Game Review',
      moveExplanations: 'Move Explanations',
      insights: 'Insights',
      coursesPerks: 'Courses Perks',
    },
    fnfFeatures: {
      gameReview: 'Unlimited Game Review',
      moveExplanations: 'Unlimited Move Explanations',
      insights: 'Unlimited Insights',
      puzzles: 'Unlimited Puzzles',
      lessons: 'Unlimited Lessons',
      coachGames: 'Unlimited Coach Games',
      bots: 'Unlock All Bots',
      noAds: 'No Ads',
    },
    tiers: {
      gold: 'Gold',
      platinum: 'Platinum',
      diamond: 'Diamond',
      friendsAndFamily: 'Friends & Family',
    },
    planDescriptions: {
      diamond: 'Unlimited Game Review, Move Explanations, Insights, Puzzles, Lessons, Coach Games, Bots, No Ads',
      platinum: 'Unlimited Puzzles, Lessons, Coach Games, Bots, Game Review, No Ads',
      gold: 'Unlimited Puzzles, Lessons, Coach Games, Bots, No Ads',
      friendsAndFamily: 'Premium for the whole household. Up to 6 members.',
    },
    androidPerMonthDisplay: (rate) => `${rate} / month`,
    androidAnnualSummary: (total) => `12 months • ${total}`,
    androidGooglePlayDisclaimerYearly: (annualTotal, monthlyEquivPerMo) =>
      `You will be charged ${annualTotal} per year (${monthlyEquivPerMo}). You may cancel anytime in Google Play.`,
    androidGooglePlayDisclaimerMonthly: (monthlyRate) =>
      `You will be charged ${monthlyRate} per month. You may cancel anytime in Google Play.`,
  },

  de: {
    trialEligible: {
      headline: '1 Woche Premium kostenlos testen',
      cta: 'Für 0,00 $ testen',
    },
    notTrialEligible: {
      headline: 'Hol dir das Beste vom Schach',
      cta: 'Premium holen',
    },
    yearly: 'Jährlich',
    monthly: 'Monatlich',
    billedAnnually: (total) => `jährlich abgerechnet, ${total} / Jahr`,
    perMonth: (rate) => `${rate} / Mo.`,
    unlimited: 'UNBEGRENZT',
    mostPopular: 'Beliebteste',
    saveLabel: (percent) => `SPARE ${percent}%`,
    membersRange: '2-6 Mitglieder',
    yearlyPlanOnly: 'NUR JAHRESPLAN',
    switchToYearly: 'Zum Jahresplan wechseln',
    allPlansInclude: 'Alle Premium-Pläne enthalten: Puzzle-Battle, Custom Flair, Eröffnungs-Explorer, Drills, Club-Management und Zeitschutz für tägliche Partien',
    payInApp: 'IN APP BEZAHLEN',
    features: {
      puzzles: 'Aufgaben',
      lessons: 'Lektionen',
      bots: 'Bots',
      playCoach: 'Spielcoach',
      noAds: 'Keine Werbung',
      gameReview: 'Partieanalyse',
      moveExplanations: 'Zugerklärungen',
      insights: 'Erkenntnisse',
      coursesPerks: 'Kursvorteile',
    },
    fnfFeatures: {
      gameReview: 'Unbegrenzte Partieanalyse',
      moveExplanations: 'Unbegrenzte Zugerklärungen',
      insights: 'Unbegrenzte Erkenntnisse',
      puzzles: 'Unbegrenzte Aufgaben',
      lessons: 'Unbegrenzte Lektionen',
      coachGames: 'Unbegrenzte Coach-Partien',
      bots: 'Alle Bots freischalten',
      noAds: 'Keine Werbung',
    },
    tiers: {
      gold: 'Gold',
      platinum: 'Platin',
      diamond: 'Diamant',
      friendsAndFamily: 'Freunde & Familie',
    },
    planDescriptions: {
      diamond: 'Unbegrenzt: Aufgaben, Lektionen, Bots, Spielcoach, Keine Werbung, Partieanalyse, Zugerklärungen, Erkenntnisse, Kursvorteile',
      platinum: 'Unbegrenzt: Aufgaben, Lektionen, Bots, Spielcoach, Keine Werbung, Partieanalyse',
      gold: 'Unbegrenzt: Aufgaben, Lektionen, Bots, Spielcoach, Keine Werbung',
      friendsAndFamily: 'Premium für den ganzen Haushalt. Bis zu 6 Mitglieder.',
    },
    androidPerMonthDisplay: (rate) => `${rate} / Monat`,
    androidAnnualSummary: (total) => `12 Monate • ${total}`,
    androidGooglePlayDisclaimerYearly: (annualTotal, monthlyEquivPerMo) =>
      `Dir wird ${annualTotal} pro Jahr (${monthlyEquivPerMo}) berechnet. Du kannst jederzeit in Google Play kündigen.`,
    androidGooglePlayDisclaimerMonthly: (monthlyRate) =>
      `Dir wird ${monthlyRate} pro Monat berechnet. Du kannst jederzeit in Google Play kündigen.`,
  },

  uk: {
    trialEligible: {
      headline: 'Отримайте 1 тиждень Premium безкоштовно',
      cta: 'Спробувати за $0.00',
    },
    notTrialEligible: {
      headline: 'Отримайте найкраще від шахів',
      cta: 'Стати Premium',
    },
    yearly: 'Щорічно',
    monthly: 'Щомісячно',
    billedAnnually: (total) => `щорічна оплата, ${total} / рік`,
    perMonth: (rate) => `${rate} / міс.`,
    unlimited: 'НЕОБМЕЖЕНО',
    mostPopular: 'Найпопулярніший',
    saveLabel: (percent) => `ЕКОНОМІЯ ${percent}%`,
    membersRange: '2-6 учасників',
    yearlyPlanOnly: 'ЛИШЕ РІЧНИЙ ПЛАН',
    switchToYearly: 'Перейти на річний, щоб підписатися',
    allPlansInclude: 'Усі Premium-плани включають: Puzzle Battle, унікальні значки, дослідник дебютів, тренування, керування клубом і захист від таймауту в щоденних партіях',
    payInApp: 'ОПЛАТИТИ В ДОДАТКУ',
    features: {
      puzzles: 'Задачі',
      lessons: 'Уроки',
      bots: 'Боти',
      playCoach: 'Тренер гри',
      noAds: 'Без реклами',
      gameReview: 'Огляд партій',
      moveExplanations: 'Пояснення ходів',
      insights: 'Аналітика',
      coursesPerks: 'Переваги курсів',
    },
    fnfFeatures: {
      gameReview: 'Необмежений огляд партій',
      moveExplanations: 'Необмежені пояснення ходів',
      insights: 'Необмежена аналітика',
      puzzles: 'Необмежені задачі',
      lessons: 'Необмежені уроки',
      coachGames: 'Необмежені партії з тренером',
      bots: 'Розблокувати всіх ботів',
      noAds: 'Без реклами',
    },
    tiers: {
      gold: 'Золото',
      platinum: 'Платина',
      diamond: 'Діамант',
      friendsAndFamily: 'Друзі та родина',
    },
    planDescriptions: {
      diamond: 'Необмежено: Задачі, Уроки, Боти, Тренер гри, Без реклами, Огляд партій, Пояснення ходів, Аналітика, Переваги курсів',
      platinum: 'Необмежено: Задачі, Уроки, Боти, Тренер гри, Без реклами, Огляд партій',
      gold: 'Необмежено: Задачі, Уроки, Боти, Тренер гри, Без реклами',
      friendsAndFamily: 'Premium для всієї родини. До 6 учасників.',
    },
    androidPerMonthDisplay: (rate) => `${rate} / місяць`,
    androidAnnualSummary: (total) => `12 місяців • ${total}`,
    androidGooglePlayDisclaimerYearly: (annualTotal, monthlyEquivPerMo) =>
      `З вас стягуватиметься ${annualTotal} на рік (${monthlyEquivPerMo}). Скасувати можна будь-коли в Google Play.`,
    androidGooglePlayDisclaimerMonthly: (monthlyRate) =>
      `З вас стягуватиметься ${monthlyRate} на місяць. Скасувати можна будь-коли в Google Play.`,
  },
}

export function getTranslations(lang: LangCode): TranslationStrings {
  return translations[lang] ?? translations.en
}

export function parseLangParam(value: string | null): LangCode {
  if (value === 'de' || value === 'uk') return value
  return 'en'
}

export function parseEligibleParam(value: string | null): boolean {
  if (value === 'false' || value === '0') return false
  return true
}

export type PlatformParam = 'ios' | 'android'

export function parsePlatformParam(value: string | null): PlatformParam {
  if (value === 'android') return 'android'
  return 'ios'
}
