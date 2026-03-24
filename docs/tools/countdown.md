---
layout: page
title: 沉浸式计时器
description: 为课堂练习设计的极简倒计时工具，致敬 Apple Watch 设计。
aside: false
---

<div class="countdown-page-container">
  <ClientOnly>
    <MatCountdown />
  </ClientOnly>
</div>

<style scoped>
.countdown-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height));
  width: 100%;
  padding: 20px 0;
}

:global(.is-countdown-active .VPNav),
:global(.is-countdown-active .VPFooter),
:global(.is-countdown-active .VPDocFooter) {
  display: none !important;
}

:global(.is-countdown-active .VPDoc) {
  padding: 0 !important;
  background-color: #000 !important;
}

:global(.is-countdown-active body) {
  background-color: #000 !important;
}
</style>
