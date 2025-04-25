<template>
  <div class="w flex gap-4 max-sm:flex-col">
    <button
      class="py-[12px] px-[16px] h-[48px] flex items-center gap-2 flex-1 bg-[#ECECEC] rounded-lg border-none"
      type="button"
      aria-label="Login with Google"
    >
      <div>
        <div v-html="googleIcon"></div>
      </div>
      <span class="font-inter text-[#222A3F] text-[14px] leading-[18px] font-medium">
        Fazer login com Google
      </span>
    </button>
    <button
    class="w-max py-[12px] px-[16px] h-[48px] flex items-center gap-2 flex-1 bg-[#ECECEC] rounded-lg border-none"
    type="button"
      aria-label="Login with Facebook"
    >
      <div>
        <div v-html="facebookIcon"></div>
      </div>
      <span class="font-inter text-[#222A3F] text-[14px] leading-[18px] font-medium">
        Fazer login com Facebook
      </span>
    </button>
  </div>
  <div class="flex items-center w-full max-sm:hidden">
    <div>
      <div v-html="dividerSvg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const googleIcon = '<svg id="1:1444" layer-name="Major Brand Logos [1.0]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"> <path d="M12.1836 10.3638V13.8493H17.1261C16.9091 14.9702 16.2578 15.9193 15.281 16.5575L18.2615 18.8239C19.9981 17.253 20.9999 14.9457 20.9999 12.2048C20.9999 11.5666 20.9415 10.9529 20.8329 10.3639L12.1836 10.3638Z" fill="#4285F4"></path> <path d="M3.98534 7.9668C3.35921 9.17766 3.00024 10.5441 3.00024 12.0004C3.00024 13.4567 3.35921 14.8231 3.98534 16.034C3.98534 16.0421 7.04106 13.7104 7.04106 13.7104C6.85739 13.1704 6.74882 12.5977 6.74882 12.0003C6.74882 11.403 6.85739 10.8303 7.04106 10.2903L3.98534 7.9668Z" fill="#FBBC05"></path> <path d="M12.1836 6.58365C13.5361 6.58365 14.7383 7.04183 15.6985 7.92548L18.3283 5.34823C16.7337 3.89188 14.6632 3 12.1836 3C8.59362 3 5.49624 5.02092 3.98511 7.9664L7.04074 10.29C7.76705 8.16274 9.79584 6.58365 12.1836 6.58365Z" fill="#EA4335"></path> <path d="M7.03679 13.7129L6.36457 14.2172L3.98511 16.0335C5.49624 18.9708 8.59343 20.9999 12.1834 20.9999C14.663 20.9999 16.7418 20.1981 18.2613 18.8236L15.2808 16.5572C14.4626 17.0972 13.419 17.4245 12.1834 17.4245C9.79565 17.4245 7.76694 15.8454 7.04054 13.7181L7.03679 13.7129Z" fill="#34A853"></path> </svg>'

const facebookIcon = '<svg id="1:1447" layer-name="Major Brand Logos [1.0]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"> <path d="M12 3C7.05 3 3 7.07035 3 12.0452C3 16.509 6.303 20.2176 10.56 21V14.5779H8.31V12.0452H10.56V10.0553C10.56 7.79397 12 6.52764 14.07 6.52764C14.7 6.52764 15.42 6.61809 16.05 6.70854V9.01508H14.88C13.8 9.01508 13.53 9.55779 13.53 10.2814V12.0452H15.915L15.51 14.5779H13.53V20.991C17.7825 20.204 21 16.509 21 12.0452C21 7.07035 16.95 3 12 3Z" fill="url(#paint0_linear_1_1447)"></path> <defs> <linearGradient id="paint0_linear_1_1447" x1="12" y1="20.4618" x2="12" y2="3" gradientUnits="userSpaceOnUse"> <stop stop-color="#0062E0"></stop> <stop offset="1" stop-color="#19AFFF"></stop> </linearGradient> </defs> </svg>'

const dividerSvg = '<svg id="1:1449" width="484" height="18" viewBox="0 0 484 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="divider-svg" style="width: 100%"> <path d="M0 9H218" stroke="#EDEDED" stroke-width="1.5"></path> <text fill="#222A3F" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="14" letter-spacing="0em"><tspan x="234" y="14.0909">Or</tspan></text> <path d="M266 9H484" stroke="#EDEDED" stroke-width="1.5"></path> </svg>'
</script>
