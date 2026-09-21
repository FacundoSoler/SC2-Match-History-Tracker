<template>
  <header class="navbar">
    <div class="nav-brand">
      <span class="brand-text">SC2 Match History Tracker</span>
    </div>

    <nav class="nav-links">
      <router-link to="/" class="nav-item">Search</router-link>
      <router-link to="/ingamedetection" class="nav-item">Live Match</router-link>
      <router-link to="/privacy" class="nav-item">Privacy</router-link>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: relative; /* Anchor point for absolute positioning */
  display: flex;
  align-items: center;
  justify-content: center; /* Perfectly centers .nav-links */
  padding: 12px 24px;
  background-color: #121621;
  border-bottom: 1px solid #2a2f45;
  min-height: 56px;
}

.nav-brand {
  position: absolute; /* Pins title to top-left regardless of centered menu */
  left: 24px;
}

.nav-brand .brand-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-item {
  color: #a0a6b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
}

.router-link-active {
  color: #38ef7d;
  background-color: rgba(56, 239, 125, 0.1);
  font-weight: 600;
}
</style>