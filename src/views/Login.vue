<template>
  <b-container>
    <b-row class="login-wrapper">
      <b-col md="4" offset-md="4" cols="10" offset="1" class="my-auto">
        <b-card title="Login" class="shadow p-3 mb-5 rounded">
          <b-form @submit="submitForm">
            <b-input-group id="username-group" class="mb-3">
              <b-input-group-prepend>
                <b-input-group-text ><font-awesome-icon icon="user"/></b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" id="username" v-model="username" placeholder="Enter username" :required='true'></b-form-input>
            </b-input-group>

            <b-input-group id="password-group"> 
              <b-input-group-prepend>
                <b-input-group-text ><font-awesome-icon icon="lock"/></b-input-group-text>
              </b-input-group-prepend>
              
              <b-form-input type="password" id="password" v-model="password" placeholder="Enter password" :required='true'></b-form-input>
            </b-input-group>

            <b-form-invalid-feedback :state="!hasError">
              Invalid username or password. Please try again.
            </b-form-invalid-feedback>
            
            <b-button type="submit" class="mt-3" block variant="primary">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import { mapActions } from 'vuex'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
  
  library.add(faUser, faLock)
  
  export default {
    data: function(){
      return {
        username: "",
        password: "",
        hasError: false,
      }
    },

    methods: {
      ...mapActions(['authorizeUser']),

      submitForm(e){
        e.preventDefault();
        this.hasError = false

        this.authorizeUser({
          username: this.username,
          password: this.password,
          secure_login: this.secureLogin
        }).then(() => {
          this.$router.push('/');
          window.OneSignal.push(function() {
            window.OneSignal.setExternalUserId(this.username)
          })
        })
          .catch(() => this.hasError = true)
      }
    }
  }
</script>
<style>
  .login-wrapper {
    height: 100vh;
  }
</style>
