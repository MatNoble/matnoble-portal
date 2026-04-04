<script setup lang="ts">
import { withBase } from 'vitepress'

interface Role {
  title: string
  details: string
  link: string
  linkText: string
}

interface Props {
  roles: Role[]
}

defineProps<Props>()
</script>

<template>
  <div class="roles-grid">
    <div v-for="role in roles" :key="role.title" class="role-card">
      <h3 class="role-title">{{ role.title }}</h3>
      <p class="role-details">{{ role.details }}</p>
      <a :href="withBase(role.link)" class="role-link">
        {{ role.linkText }} <span class="arrow">&rarr;</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;
}

.role-card {
  padding: 40px;
  background: var(--mn-primary-soft);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.role-card:hover {
  transform: translateY(-6px);
  border-color: var(--mn-primary);
  box-shadow: var(--shadow-xl);
  background: var(--vp-c-bg-soft);
}

.role-title {
  margin: 0 0 16px;
  color: var(--mn-primary);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.role-details {
  color: var(--mn-text-soft);
  margin: 0 0 24px;
  line-height: 1.6;
  font-size: 1.05rem;
  flex-grow: 1;
}

.role-link {
  font-weight: 600;
  color: var(--mn-primary);
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s;
}

.role-link:hover .arrow {
  transform: translateX(4px);
}

.arrow {
  transition: transform 0.2s;
}

@media (max-width: 640px) {
  .role-card {
    padding: 32px;
  }
  .role-title {
    font-size: 1.3rem;
  }
}
</style>
