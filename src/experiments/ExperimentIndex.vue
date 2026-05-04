<template>
  <div class="experiment-index">
    <h1 class="index-title">Condensed Paywall Experiments</h1>
    <nav class="experiment-list">
      <router-link to="/a" class="experiment-card">
        <span class="experiment-label">A</span>
        <span class="experiment-name">Experiment A</span>
        <span class="experiment-desc">Feature comparison grid</span>
      </router-link>
      <router-link to="/b" class="experiment-card">
        <span class="experiment-label">B</span>
        <span class="experiment-name">Experiment B</span>
        <span class="experiment-desc">Visual variant (in progress)</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.experiment-index {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px var(--space-24) var(--space-24);
  gap: var(--space-32);
}

.index-title {
  font-family: var(--font-family-heading);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.27;
  color: var(--color-text-boldest);
  text-align: center;
}

.experiment-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
}

.experiment-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-16) var(--space-24);
  border-radius: var(--radius-md, 8px);
  background: var(--color-transparent-white-5);
  border: 1px solid var(--color-transparent-white-10);
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.experiment-card:hover {
  background: var(--color-transparent-white-10);
  border-color: var(--color-border-selected);
}

.experiment-label {
  font-family: var(--font-family-heading);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-transparent-white-50);
}

.experiment-name {
  font-family: var(--font-family-heading);
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-boldest);
}

.experiment-desc {
  font-family: 'Inter', var(--font-family-system);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-transparent-white-72);
}
</style>
