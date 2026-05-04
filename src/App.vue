<template>
  <router-view />
</template>

<style>
html {
  box-sizing: border-box;
  font-size: 62.5%;
}

*, *::before, *::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  background-color: var(--color-gray-800);
  color: var(--color-text-boldest);
  font-family: var(--font-family-system);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
  padding: 0;
}
</style>
