<template>
  <b-container>
    <b-row class="login-wrapper">
      <b-col md="4" offset="4" class="my-auto">
        <b-card title="Login" class="shadow p-3 mb-5 rounded">
          <b-form>
            <b-form-invalid-feedback :state="!hasError">
              Invalid username or password. Please try again.
            </b-form-invalid-feedback>
            <b-form-group id="username-group" label="Username" label-for="username">
              <b-input type="text" id="username" v-model="username" placeholder="Enter username" :required='true'></b-input>
            </b-form-group>

            <b-form-group id="password-group" label="Password" label-for="password">
              <b-input type="password" id="password" v-model="password" placeholder="Enter password" :required='true'></b-input>
            </b-form-group>

            <b-from-group id="secure-login-group">
              <b-checkbox v-model="secureLogin">Secure login</b-checkbox>
            </b-from-group>

            <b-button class="mt-3" block variant="primary" @click="submitForm">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import axios from 'axios'
  import Cookies from 'js-cookie'

  export default {
    data: function(){
      return {
        username: "",
        password: "",
        secureLogin: true,
        hasError: false,
      }
    },
    methods: {
      cookies() {
        return Cookies
      },

      submitForm(e){
        e.preventDefault();
        this.hasError = false

        let _this = this;
        axios.post("/session", {
          username: _this.username,
          password: _this.password,
          secure_login: _this.secureLogin
        }).then(function(resp){
          _this.cookies().set('session_token', resp.data.session_token)
          _this.$router.push('/');
        }).catch(() => _this.hasError = true)
      }
    }
  }
</script>
<style>
  .login-wrapper {
    height: 100vh;
  }
</style>
