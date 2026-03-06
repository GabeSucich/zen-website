<template>
  <footer class="site-footer">
    <div class="footer-inner">

      <div class="footer-col">
        <h3 class="footer-heading">Evergreen, CO</h3>
        <p>32186 Castle Court | Suite 308</p>
        <p>Evergreen, CO 80439</p>
      </div>

      <div class="footer-col">
        <h3 class="footer-heading">Chicago, IL</h3>
        <p>2001 North Point St</p>
        <p>Chicago, IL 60647</p>
      </div>

      <div class="footer-col">
        <h3 class="footer-heading">Contact</h3>
        <p><a href="mailto:drbex@zenforcewellness.com">drbex@zenforcewellness.com</a></p>
        <p><a href="tel:+17204171201">(720) 417-1201</a></p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--p-surface-50);
  color: var(--p-primary-color);
  padding: 16px 48px;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.footer-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 2px;
}

.footer-col p {
  font-size: 0.85rem;
  line-height: 1.2;
  opacity: 0.8;
}

.footer-col a {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-col a:hover {
  opacity: 0.6;
}

.footer-social {
  align-items: center;
  gap: 4px;
  padding-top: 24px;
}

.footer-social svg {
  width: 28px;
  height: 28px;
  opacity: 0.9;
}

.social-handle {
  font-size: 0.85rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 16px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }
}
</style>
