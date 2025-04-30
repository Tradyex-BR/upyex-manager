<template>
  <svg
v-if="name === 'svg-dashboard'" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.842 8.29901L13.842 3.63201C12.759 2.78901 11.242 2.78901 10.158 3.63201L4.158 8.29901C3.427 8.86701 3 9.74101 3 10.667V18C3 19.657 4.343 21 6 21H18C19.657 21 21 19.657 21 18V10.667C21 9.74101 20.573 8.86701 19.842 8.29901Z" stroke="currentColor" stroke-width="1.5"/>
  <path d="M9 17H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <svg
v-else-if="name === 'svg-vendas'" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
d="M3 18C3 15.791 4.791 14 7 14H11C13.209 14 15 15.791 15 18" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" />
    <path
d="M16 4.651C17.381 4.651 18.5 5.77 18.5 7.151C18.5 8.532 17.381 9.651 16 9.651" stroke="currentColor"
      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M11.4049 4.99613C12.733 6.3243 12.733 8.4777 11.4049 9.80587C10.0767 11.134 7.9233 11.134 6.59513 9.80587C5.26696 8.4777 5.26696 6.3243 6.59513 4.99613C7.9233 3.66796 10.0767 3.66796 11.4049 4.99613"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
d="M17 13C19.209 13 21 14.791 21 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>

  <svg
v-else-if="name === 'svg-ofertas'" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
d="M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
d="M10 9V5C10 3.89543 10.8954 3 12 3H19C20.1046 3 21 3.89543 21 5V12C21 13.1046 20.1046 14 19 14H17"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 7H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M16 10H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="8" cy="16.5" r="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <rect
x="14" y="21" width="12" height="9" rx="2" transform="rotate(-180 14 21)" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
v-else-if="name === 'svg-saques'" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 17H18C19.6569 17 21 15.6569 21 14V6C21 4.34315 19.6569 3 18 3H6C4.34315 3 3 4.34315 3 6V14C3 15.6569 4.34315 17 6 17H7"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 16V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 19L12 21L14 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
v-else-if="name === 'svg-users'" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
d="M16 21H18C19.6569 21 21 19.6569 21 18V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
d="M16 3H18C19.6569 3 21 4.34315 21 6V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
d="M3 16V18C3 19.6569 4.34315 21 6 21H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
d="M3 8V6C3 4.34315 4.34315 3 6 3H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <circle
cx="13.75" cy="10.75" r="4.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path
      d="M14.1301 14.98C13.2953 16.8739 11.2167 17.8898 9.20957 17.3849C7.20248 16.8799 5.85201 15.0013 6.01285 12.9379C6.17369 10.8745 7.79897 9.22786 9.86006 9.04004"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuIcons',
  props: {
    name: {
      type: String,
      required: true
    }
  }
})
</script>