<template>
  <main
    class="relative w-full h-full rounded-[30px] md:rounded-[48px] overflow-hidden shadow-2xl group isolate bg-background-dark">
    <!-- Wave Animation Background -->
    <div class="absolute inset-0 w-full h-full z-0 wave-wrapper">
      <div class="wave-background">
        <span class="wave-layer wave-layer-1"></span>
        <span class="wave-layer wave-layer-2"></span>
        <span class="wave-layer wave-layer-3"></span>
      </div>
      <!-- Lighter overlay gradients optimized for your color theme -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#181717]/15 via-transparent to-[#181717]/25 mix-blend-multiply pointer-events-none">
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#810100]/15 via-transparent to-transparent mix-blend-overlay pointer-events-none">
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-between h-full w-full p-6 md:p-10 lg:p-12 text-brand-cream">
      <!-- Navigation -->
      <AppNavigation />

      <!-- Hero Content -->
      <section
        class="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-8 mt-12 md:mt-0 pointer-events-none">
        <h1
          class="font-display italic text-6xl md:text-8xl lg:text-9xl leading-tight text-brand-cream drop-shadow-lg pointer-events-auto">
          {{ heroTitle }}
        </h1>
        <p
          class="font-sans font-light text-lg md:text-xl lg:text-2xl text-brand-cream/90 max-w-2xl leading-relaxed drop-shadow-md pointer-events-auto">
          {{ heroDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center pointer-events-auto">
          <button v-for="action in heroActions" :key="action.text"
            class="glass-button px-8 py-3 rounded-full text-base font-medium min-w-[180px]" @click="action.onClick">
            {{ action.text }}
          </button>
        </div>
      </section>

      <!-- Email Signup Form -->
      <div class="w-full flex flex-col items-center justify-end pb-4 md:pb-8 space-y-4">
        <div class="w-full max-w-xl mx-auto">
          <form class="relative group" id="join" @submit.prevent="handleSubmit">
            <input v-model="email"
              class="input-glass w-full rounded-full py-4 pl-8 pr-16 text-brand-charcoal font-medium placeholder-brand-charcoal/50 outline-none focus:ring-2 focus:ring-brand-red/30 font-sans text-lg transition-all shadow-xl"
              placeholder="Enter your email for early access" type="email" required :disabled="isSubmitting" />
            <button
              class="absolute right-2 top-2 bottom-2 bg-brand-red text-brand-cream rounded-full w-12 h-12 flex items-center justify-center hover:bg-brand-red-light transition-colors shadow-md disabled:opacity-50"
              type="submit" :disabled="isSubmitting || !email">
              <span class="material-icons-outlined text-2xl">
                {{ isSubmitting ? 'hourglass_empty' : 'arrow_forward' }}
              </span>
            </button>

            <!-- Success Message -->
            <div v-if="success" class="absolute -bottom-8 left-0 right-0 text-center">
              <p class="text-brand-cream/80 text-sm">✨ Thank you for joining our waitlist!</p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="absolute -bottom-8 left-0 right-0 text-center">
              <p class="text-red-200 text-sm">{{ error }}</p>
            </div>
          </form>
        </div>
        <p class="font-sans text-xs md:text-sm text-brand-cream/60 text-center max-w-md">
          Join our newsletter for exclusive insights into the art of memory keeping.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const heroTitle = "Unfold Your Story"
const heroDescription = "Fold is a private sanctuary for your memories. Capture the unspoken emotions and fleeting moments in a digital tapestry woven from your life."

const heroActions = [
  {
    text: "Watch the Film",
    onClick: () => {
      // Handle watch film action
      console.log("Watch film clicked")
    }
  },
  {
    text: "Read Our Story",
    onClick: () => {
      // Handle read story action
      console.log("Read story clicked")
    }
  }
]

// Email Form Logic
const email = ref('')
const { isSubmitting, error, success, submitEmail, reset } = useEmailSignup()

const handleSubmit = async () => {
  const submitted = await submitEmail(email.value)
  if (submitted) {
    email.value = ''
  }
}

onUnmounted(() => {
  if (reset) reset()
})
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
  background: rgba(24, 23, 23, 1);
  animation: wave-animate 5s linear infinite;
}

.wave-layer-2 {
  border-radius: 40%;
  background: rgba(24, 23, 23, 0.5);
  animation: wave-animate 10s linear infinite;
}

.wave-layer-3 {
  border-radius: 42.5%;
  background: rgba(24, 23, 23, 0.5);
  animation: wave-animate 15s linear infinite;
}

@keyframes wave-animate {
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
}

/* Mobile: Adjust top position to bring waves higher */
@media (max-width: 768px) {
  .wave-layer {
    top: -25%;
  }
}

/* Extra small phones: Even higher */
@media (max-width: 480px) {
  .wave-layer {
    top: -35%;
  }
}
</style>
