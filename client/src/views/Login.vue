<template>
  <div class="login section">
    <div class="card">
      <div class="card-content">
        <h1 class="title">Login</h1>
        <p class="has-text-danger error-message" v-if="errorMessage">{{errorMessage}}</p>
        <login-form :full-form="registering" @form-change="onFormChange"/>
        <div class="level ">
          <b-button @click="clickSwitchMode">{{this.registering
          ? 'Back to login'
          : 'I don\'t have an account'}}
          </b-button>
          <b-button @click="clickAction" type="is-primary" :disabled="!isValidForm" :loading="loading">{{this.registering
            ? 'Create account'
            : 'Login'}}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoginForm from '@/components/LoginForm.vue'
import apiAuth from '../api/mixins/apiAuth'

export default {
  components: {
    LoginForm
  },
  mixins: [apiAuth],
  data () {
    return {
      registering: false,
      isValidForm: false,
      loading: false,
      errorMessage: '',
      userData: {}
    }
  },
  methods: {
    clickSwitchMode () {
      this.errorMessage = ''
      this.registering = !this.registering
    },
    async clickAction () {
      this.loading = true
      try {
        if (this.registering) {
          await this._register()
        } else {
          await this._login()
        }
      } catch (error) {
         console.log('ERROR: clickAction -> error', error)
      }
      this.loading = false
    },
    onFormChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.userData = data
      }
    },
    _register() {
      return this.apiRegister(this.userData)
        .then(() => this._login(this.userData))
        .catch(error => {
          this.errorMessage = error
        })
    },
    _login() {
      return this.apiLogin(this.userData)
        .then(() => { this.$router.push({name: 'Home'}) })
        .catch(error => {
          this.errorMessage = error
        })
    }
  }
}
</script>
<style scoped>
.login {
  display: grid;
  justify-content: center;
  align-content: flex-start;
}
.error-message {
  margin-bottom: 1rem;
}
.card {
  max-width: 500px;
}
.level {
  margin-top: 2em;
}
.level>*:not(:last-child) {
  margin-right: 1em;
}

</style>