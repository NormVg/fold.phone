<template>
  <main
    class="relative w-full h-[90vh] min-h-[600px] rounded-[30px] md:rounded-[48px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group isolate bg-background-light mb-12 border border-black/5">
    <!-- Wave Animation Background -->
    <div class="absolute inset-0 w-full h-full z-0 wave-wrapper opacity-90">
      <div class="wave-background">
        <span class="wave-layer wave-layer-1"></span>
        <span class="wave-layer wave-layer-2"></span>
        <span class="wave-layer wave-layer-3"></span>
      </div>
      <!-- Lighter overlay gradients optimized for your color theme -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-background-light/90 via-background-light/40 to-background-light/90 mix-blend-normal pointer-events-none">
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-brand-red/5 via-transparent to-transparent pointer-events-none">
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-between h-full w-full p-6 md:p-10 lg:p-12 text-brand-charcoal">
      <!-- Navigation -->
      <AppNavigation />

      <!-- Hero Content -->
      <section
        class="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6 mt-12 md:mt-0 pointer-events-none flex-1">
        <h1
          class="font-display italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight text-brand-charcoal pointer-events-auto mix-blend-darken">
          {{ heroTitle }}
        </h1>
        <p
          class="font-sans font-medium text-base sm:text-lg md:text-xl lg:text-2xl text-brand-charcoal/80 max-w-2xl leading-relaxed pointer-events-auto mix-blend-darken">
          {{ heroDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-8 w-full justify-center pointer-events-auto">
          <button v-for="action in heroActions" :key="action.text"
            class="glass-button px-8 py-3.5 rounded-full text-sm sm:text-base font-medium min-w-[180px] shadow-sm"
            @click="action.onClick">
            {{ action.text }}
          </button>
        </div>
      </section>

      <!-- Email Signup Form -->
      <div class="w-full flex flex-col items-center justify-end pb-4 md:pb-8 space-y-4 pointer-events-auto">
        <div class="w-full max-w-lg mx-auto relative">
          <form class="relative group shadow-lg shadow-brand-red/5" id="join" @submit.prevent="handleSubmit">
            <input v-model="email"
              class="input-glass w-full rounded-full py-4 pl-6 pr-14 text-brand-charcoal font-medium placeholder-brand-charcoal/40 outline-none focus:ring-2 focus:ring-brand-red/30 focus:bg-white/40 font-sans text-base transition-all bg-white/20"
              placeholder="Enter your email for early access" type="email" required :disabled="isSubmitting" />
            <button
              class="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-red text-brand-cream rounded-full w-10 sm:w-11 h-10 sm:h-11 flex items-center justify-center hover:bg-brand-red-light transition-colors shadow-md disabled:opacity-50"
              type="submit" :disabled="isSubmitting || !email">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Success Message -->
            <transition name="fade">
              <div v-if="success" class="absolute -bottom-8 left-0 right-0 text-center">
                <p class="text-green-600 text-sm font-medium">✨ Thank you for joining our waitlist!</p>
              </div>
            </transition>
          </form>
        </div>
        <p class="font-sans text-xs sm:text-sm text-brand-charcoal/50 text-center max-w-sm pt-2">
          Join our newsletter for exclusive updates. No spam.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const heroTitle = "Unfold Your Story"
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

// Dummy Email Form Logic
const email = ref('')
const isSubmitting = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  if (!email.value) return
  isSubmitting.value = true

  // Simulate network
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
  /* brand-cream */
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
