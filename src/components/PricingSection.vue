<template>
  <section class="pricing-section">
    <div class="pricing-inner">

      <p class="pricing-eyebrow">Consultations</p>
      <Divider />
      <h2 class="pricing-title">Simple, transparent pricing built around your needs</h2>
      <p class="pricing-free-note-top">✦ &nbsp; Your first 45-minute consultation is always complimentary</p>

      <table class="pricing-table">
        <thead>
          <tr>
            <th></th>
            <th class="col-paypervisit">Pay-per-consult</th>
            <th class="col-membership">Zen Membership</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Recommended for</td>
            <td>
              <p class="recommended-text">Patients who generally know what they want and require less frequent touch points</p>
            </td>
            <td class="membership-cell">
              <p class="recommended-text">Patients looking for a trusted source to help them start their wellness journey</p>
            </td>
          </tr>
          <tr>
            <td>Consultations</td>
            <td>
              <div class="consult-item">
                <span class="consult-duration">30 minutes</span>
                <span class="consult-price">$80</span>
              </div>
              <div class="consult-item">
                <span class="consult-duration">45 minutes</span>
                <span class="consult-price">$120</span>
              </div>
            </td>
            <td class="membership-cell">
              <div class="membership-consult">
                <span class="consult-count">4 × 45 min</span>
                <span class="consult-detail">per month</span>
                <span class="consult-tag">included</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Text &amp; Email Support</td>
            <td>
              <p class="support-limited">Emergencies and medication or supplement order changes only</p>
            </td>
            <td class="membership-cell">
              <p class="support-included">
                <strong>Unlimited</strong>
                Treatments, protocols, and any general questions
              </p>
            </td>
          </tr>
          <tr>
            <td>Monthly Cost</td>
            <td>
              <span class="cost-amount">Pay as you go</span>
              <span class="cost-note">No commitment required</span>
            </td>
            <td class="membership-cell">
              <span class="cost-amount">$200 / month <sup>*</sup></span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pricing-notes">
        <p><sup>*</sup> First 3 months billed upfront at $600 to cover initial plan personalization and treatment refinement. Cancel anytime after that.</p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
</script>

<style scoped>
.pricing-section {
  background: var(--p-surface-50);
  padding: 16px 24px 100px;
  color: var(--p-primary-color);
}

.pricing-inner {
  max-width: 860px;
  margin: 0 auto;
}

.pricing-eyebrow {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--p-primary-color);
  margin-bottom: 14px;
}

.pricing-section :deep(.p-divider) {
  width: 30%;
  margin: 8px 0;
}

.pricing-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.2vw, 2.24rem);
  font-weight: 300;
  line-height: 1.2;
  color: var(--p-primary-color);
  margin-bottom: 28px;
}

.pricing-free-note-top {
  font-size: 13px;
  color: var(--p-surface-600);
  letter-spacing: 0.06em;
  text-align: center;
  margin-bottom: 20px;
}

/* ── Table ── */
.pricing-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 6px;
  overflow: hidden;
}

.pricing-table thead th {
  padding: 24px 32px;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--p-surface-200);
}

.pricing-table thead th:first-child {
  color: var(--p-surface-400);
  width: 28%;
}

.col-paypervisit {
  color: var(--p-primary-color);
  width: 36%;
}

.col-membership {
  background: var(--p-primary-color);
  color: #c9a84c;
  width: 36%;
}

.pricing-table tbody tr {
  border-bottom: 1px solid var(--p-surface-200);
}

.pricing-table tbody tr:last-child {
  border-bottom: none;
}

.pricing-table tbody td {
  padding: 28px 32px;
  vertical-align: top;
  font-size: 14px;
  line-height: 1.6;
}

.pricing-table tbody td:first-child {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--p-surface-400);
  padding-top: 32px;
}

.pricing-table tbody td.membership-cell {
  background: var(--p-primary-color);
  color: var(--p-surface-300);
}

.pricing-table tbody td.membership-cell strong {
  color: var(--p-surface-100);
}

.recommended-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--p-primary-color);
  line-height: 1.65;
}

.membership-cell .recommended-text {
  color: var(--p-surface-100);
}

/* ── Consultations ── */
.consult-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;
}

.consult-item + .consult-item {
  border-top: 1px solid var(--p-surface-200);
  margin-top: 8px;
  padding-top: 12px;
}

.consult-duration {
  font-size: 14px;
  color: var(--p-surface-600);
}

.consult-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #a07828;
}

.membership-consult {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.consult-count {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: var(--p-surface-50);
  line-height: 1;
}

.consult-detail {
  font-size: 13px;
  color: var(--p-surface-400);
}

.consult-tag {
  display: inline-block;
  margin-top: 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c9a84c;
  border: 1px solid rgba(201, 168, 76, 0.35);
  padding: 3px 10px;
  border-radius: 2px;
  width: fit-content;
}

/* ── Support ── */
.support-limited {
  color: var(--p-surface-600);
}

.support-included {
  color: var(--p-surface-400);
}

.support-included strong {
  color: var(--p-surface-100);
  display: block;
  margin-bottom: 4px;
}

/* ── Cost ── */
.cost-amount {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: var(--p-primary-color);
  display: block;
  margin-bottom: 4px;
}

.cost-note {
  font-size: 12px;
  color: var(--p-surface-400);
}

.membership-cell .cost-amount {
  color: var(--p-surface-50);
}

sup {
  font-size: 14px;
  font-weight: 600;
  color: #c9a84c;
  font-family: 'DM Sans', sans-serif;
}

/* ── Notes ── */
.pricing-notes {
  margin-top: 20px;
}

.pricing-notes p {
  font-size: 12.5px;
  color: var(--p-surface-600);
  line-height: 1.6;
}
</style>
