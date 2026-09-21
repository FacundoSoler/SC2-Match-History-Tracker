<template>
  <div class="privacy-container">
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last updated: September 21, 2026</p>

    <section>
      <h2>Overview</h2>
      <p>
        The SC2 Match History Tracker Companion extension and web application respect your privacy. 
        This application operates locally on your machine to provide real-time StarCraft II match statistics.
      </p>
    </section>

    <section>
      <h2>Data Collection & Usage</h2>
      <p>
        We do not collect, store, or transmit any personally identifiable information (PII), 
        browsing history, or personal data to third-party servers.
      </p>
      <ul>
        <li><strong>Local Client API Data:</strong> The extension queries <code>http://localhost:6119</code> purely to read public StarCraft II client telemetry (in-game state, player handle, and match history).</li>
        <li><strong>Local Storage:</strong> Extension settings and UI preferences are saved locally in your browser via <code>chrome.storage.local</code>.</li>
      </ul>
    </section>

    <section>
      <h2>Third-Party Services</h2>
      <p>No user data is sold, rented, or shared with third parties.</p>
    </section>

    <section>
      <h2>Source Code & Issues</h2>
      <p>
        This project is open source. You can inspect the codebase, audit the extension code, or report issues directly on our GitHub repository:
      </p>
      <p>
        <a 
          href="https://github.com/FacundoSoler/SC2-Match-History-Tracker" 
          target="_blank" 
          rel="noopener noreferrer"
          class="github-link"
        >
          https://github.com/fa-soler86/sc2-pulse-extension
        </a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.privacy-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  color: #e0e0e0;
  line-height: 1.6;
}

.last-updated {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 24px;
}

h1 {
  color: #ffffff;
  margin-bottom: 8px;
}

h2 {
  color: #0d6efd;
  margin-top: 24px;
  margin-bottom: 8px;
}

section {
  margin-bottom: 24px;
}

ul {
  padding-left: 20px;
}

.github-link {
  color: #4dabf7;
  text-decoration: underline;
}

.github-link:hover {
  color: #74c0fc;
}
</style>