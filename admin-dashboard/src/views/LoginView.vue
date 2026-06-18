<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import untitledBg from '@/assets/Untitled13_20260525215101.png'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

onMounted(() => {
  localStorage.removeItem('admin_token')
  sessionStorage.removeItem('admin_token')
})

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Silakan isi email/username dan password.'
    return
  }
  
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: email.value, 
        password: password.value 
      })
    })

    const data = await res.json()

    if (!res.ok) {
      errorMsg.value = data.error || 'Login gagal.'
      return
    }

    sessionStorage.setItem('admin_token', data.token)
    errorMsg.value = ''
    
    router.push('/')
    
  } catch (error) {
    errorMsg.value = 'Server sedang bermasalah atau mati.'
  }
}
</script>

<template>
  <div :class="$style.loginPage">
    <img :src="untitledBg" :class="$style.untitled13202605252151012Icon" alt="Background" />
    <div :class="$style.frameParent">
      <div :class="$style.selamatDatangWrapper">
        <div :class="$style.selamatDatang">Selamat Datang</div>
      </div>
      <div :class="$style.silahkanLogInTerlebihDahulWrapper">
        <div :class="$style.selamatDatang">Silahkan log in terlebih dahulu</div>
      </div>
      
      <form @submit.prevent="handleLogin" :class="$style.form">
        <div v-if="errorMsg" :class="$style.errorText">
          {{ errorMsg }}
        </div>

        <div :class="$style.input">
          <label :class="$style.selamatDatang">Email/username</label>
          <div :class="$style.input2">
            <input 
              v-model="email" 
              type="text" 
              placeholder="admin" 
              :class="$style.inputElement" 
            />
          </div>
        </div>

        <div :class="$style.input">
          <label :class="$style.selamatDatang">Password</label>
          <div :class="$style.input2">
            <input 
              v-model="password" 
              type="password" 
              placeholder="At least 8 characters" 
              :class="$style.inputElement" 
            />
          </div>
        </div>

        <button type="submit" :class="$style.mainButton">
          <div :class="$style.selamatDatang">Log in</div>
        </button>
      </form>
    </div>
  </div>
</template>

<style module>
@import url('https://fonts.googleapis.com/css2?family=FONTSPRING+DEMO+-+Biennale+Bold:wght@400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

.loginPage {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #65be3e;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  isolation: isolate;
  gap: 10px;
  text-align: center;
  font-size: 16px;
  color: #000;
  font-family: 'FONTSPRING DEMO - Biennale Bold', sans-serif;
}

.untitled13202605252151012Icon {
  width: 2209px;
  height: 1027px;
  position: absolute;
  margin: 0 !important;
  top: -18px;
  left: -385px;
  object-fit: cover;
  z-index: 0;
  flex-shrink: 0;
}

.frameParent {
  width: 100%;
  max-width: 480px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  background-color: #ffd339;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
  gap: 20px;
  z-index: 1;
  flex-shrink: 0;
}

.selamatDatangWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 32px;
}

.selamatDatang {
  position: relative;
  letter-spacing: 0.01em;
  line-height: 100%;
}

.silahkanLogInTerlebihDahulWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
}

.form {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 32px;
  text-align: left;
  color: #0c1421;
  font-family: Roboto, sans-serif;
}

.input {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.input2 {
  align-self: stretch;
  height: 48px;
  position: relative;
  color: #8897ad;
}

.inputElement {
  position: absolute;
  height: 104.17%;
  width: 100.43%;
  top: -2.08%;
  right: -0.22%;
  bottom: -2.08%;
  left: -0.22%;
  border-radius: 12px;
  background-color: #f7fbff;
  border: 1px solid #d4d7e3;
  box-sizing: border-box;
  padding: 0 19px;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  color: #0c1421;
  outline: none;
}

.inputElement::placeholder {
  color: #8897ad;
}

.mainButton {
  cursor: pointer;
  border: none;
  align-self: stretch;
  border-radius: 12px;
  background-color: #02a554;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0px;
  text-align: center;
  font-size: 20px;
  color: #1e1e1e;
  font-family: 'FONTSPRING DEMO - Biennale Bold', sans-serif;
}

.errorText {
  color: #d32f2f;
  font-size: 14px;
  font-family: Roboto, sans-serif;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 10px 12px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}
</style>