<template>
  <main class="relative w-full min-h-screen overflow-hidden bg-background-light">
    <!-- Wave Animation Background — FULL SCREEN behind everything -->
    <div class="absolute inset-0 w-full h-full z-0 wave-wrapper">
      <div class="wave-background">
        <span class="wave-layer wave-layer-1"></span>
        <span class="wave-layer wave-layer-2"></span>
        <span class="wave-layer wave-layer-3"></span>
      </div>
    </div>

    <!-- Top gradient: cream fades into wave -->
    <div
      class="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-background-light via-background-light/70 to-transparent z-[1] pointer-events-none">
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-12 py-12">
      <!-- Navigation -->
      <AppNavigation />

      <!-- Hero Card -->
      <div
        class="w-full max-w-[900px] mx-auto bg-white/50 backdrop-blur-2xl rounded-[32px] md:rounded-[48px] border border-white/60 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)] px-8 md:px-14 py-10 md:py-14 text-center space-y-6 mt-16 mb-8">
        <h1
          class="font-display italic text-5xl sm:text-6xl md:text-8xl lg:text-[110px] leading-[1.05] text-brand-charcoal tracking-tight">
          Unfold Your<br />Story
        </h1>

        <p class="font-sans text-base sm:text-lg md:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed">
          {{ heroDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button v-for="action in heroActions" :key="action.text"
            class="px-8 py-3.5 rounded-2xl text-sm sm:text-base font-semibold min-w-[200px] transition-all duration-200 bg-white/70 backdrop-blur-sm border border-brand-charcoal/10 text-brand-charcoal/90 hover:bg-white hover:shadow-md hover:border-brand-charcoal/20 active:scale-[0.98]"
            @click="action.onClick">
            {{ action.text }}
          </button>
        </div>

        <!-- Email Signup -->
        <div class="w-full max-w-md mx-auto pt-2">
          <form class="relative" id="join" @submit.prevent="handleSubmit">
            <input v-model="email"
              class="w-full rounded-2xl py-3.5 pl-6 pr-14 text-brand-charcoal font-medium placeholder-brand-charcoal/35 outline-none font-sans text-sm transition-all duration-200 bg-white/60 backdrop-blur-lg border border-brand-charcoal/8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_28px_-4px_rgba(0,0,0,0.12)] focus:border-brand-charcoal/15 focus:bg-white/80"
              placeholder="Enter your email for early access" type="email" required :disabled="isSubmitting" />
            <button
              class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-red text-white rounded-xl w-9 h-9 flex items-center justify-center hover:bg-brand-red-light transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 active:scale-95"
              type="submit" :disabled="isSubmitting || !email">
              <span v-if="isSubmitting"
                class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>

            <transition name="fade">
              <div v-if="success" class="absolute -bottom-7 left-0 right-0 text-center">
                <p class="text-green-700 text-xs font-medium">✨ Thank you for joining our waitlist!</p>
              </div>
            </transition>
          </form>

          <p class="font-sans text-[11px] text-brand-charcoal/35 text-center pt-3">
            Join our newsletter for exclusive updates. No spam.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const heroDescription = "Fold is a private sanctuary for your memories. Capture the unspoken emotions and fleeting moments in a digital tapestry woven from your life."

const heroActions = [
  {
    text: "Watch the Film",
    onClick: () => {
      console.log("Watch film clicked")
    }
  },
  {
    text: "Download Android APK",
    onClick: () => {
      window.location.href = "https://admin.fold.taohq.org/download"
    }
  }
]

const email = ref('')
const isSubmitting = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  if (!email.value) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSubmitting.value = false
  success.value = true
  email.value = ''
  setTimeout(() => { success.value = false }, 4000)
}
</script>

<style scoped>
.wave-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.wave-background {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8D1A1A 0%, #810100 50%, #5a0000 100%);
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
  transition: 0.5s;
}

.wave-layer {
  content: "";
  position: absolute;
  width: 325vh;
  height: 325vh;
  top: 0;
  left: 50%;
  transform: translate(-50%, -75%);
  background: #000;
}

.wave-layer-1 {
  border-radius: 45%;
  background: rgba(237, 234, 220, 1);
  animation: wave-animate 8s linear infinite;
}

.wave-layer-2 {
  border-radius: 40%;
  background: rgba(237, 234, 220, 0.6);
  animation: wave-animate 12s linear infinite;
}

.wave-layer-3 {
  border-radius: 42.5%;
  background: rgba(237, 234, 220, 0.4);
  animation: wave-animate 16s linear infinite;
}

@keyframes wave-animate {
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .wave-layer {
    top: -25%;
  }
}

@media (max-width: 480px) {
  .wave-layer {
    top: -35%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
