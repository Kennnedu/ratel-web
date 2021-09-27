<template>
  <b-container>
    <b-row class="login-wrapper">
      <b-col md="4" offset-md="4" cols="10" offset="1" class="my-auto">
        <b-card title="" class="shadow p-3 mb-5 rounded">
          <div class="d-flex justify-content-center mb-5">
            <img :src="logo" style="height:150px;width:150px;"/>
          </div>
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
  import axios from 'axios'
  import Cookies from 'js-cookie'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
  import logo from '../assets/logo.png'
  
  library.add(faUser, faLock)
  
  export default {
    data: function(){
      return {
        username: "",
        password: "",
        hasError: false,
        logo 
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
        axios.post("/sessions", {
          username: _this.username,
          password: _this.password,
          secure_login: _this.secureLogin
        }).then(function(resp){
          window.OneSignal.push(['setExternalUserId', _this.username]);
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
