---
layout: page
title: 沉浸式计时器
description: 为课堂练习设计的极简倒计时工具，致敬 Apple Watch 设计。
navbar: false
sidebar: false
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
  min-height: 100vh;
  width: 100%;
  padding: 0;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.countdown-page-container::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.12;
  pointer-events: none;
  /* Expert manual SVG typesetting for math formulas */
  background-image: url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' font-family='Georgia, serif' font-style='italic'%3E%3C!-- Euler's --%3E%3Ctext x='50' y='50' font-size='18'%3Ee%3Ctspan dy='-6' font-size='12'%3Eiπ%3C/tspan%3E%3Ctspan dy='6'%3E + 1 = 0%3C/tspan%3E%3C/text%3E%3C!-- Schrodinger --%3E%3Ctext x='200' y='110' font-size='14'%3Eiħ%3C/text%3E%3Ctext x='225' y='100' font-size='12' text-anchor='middle'%3E∂Ψ%3C/text%3E%3Cline x1='215' y1='105' x2='235' y2='105' stroke='white' stroke-width='1'/%3E%3Ctext x='225' y='120' font-size='12' text-anchor='middle'%3E∂t%3C/text%3E%3Ctext x='240' y='110' font-size='14'%3E = ĤΨ%3C/text%3E%3C!-- Einstein --%3E%3Ctext x='80' y='220' font-size='20'%3EE = mc%3Ctspan dy='-7' font-size='13'%3E2%3C/tspan%3E%3C/text%3E%3C!-- Integral --%3E%3Ctext x='280' y='280' font-size='14'%3E∫e%3Ctspan dy='-5' font-size='10'%3E-x²%3C/tspan%3E%3Ctspan dy='5'%3Edx = √π%3C/tspan%3E%3C/text%3E%3C!-- Gauss Law --%3E%3Ctext x='50' y='340' font-size='16'%3E∇·E = %3C/text%3E%3Ctext x='110' y='330' font-size='13' text-anchor='middle'%3Eρ%3C/text%3E%3Cline x1='100' y1='335' x2='120' y2='335' stroke='white' stroke-width='1'/%3E%3Ctext x='110' y='350' font-size='13' text-anchor='middle'%3Eε₀%3C/text%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 600px 600px;
  z-index: 0;
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
