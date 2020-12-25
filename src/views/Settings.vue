<template>
  <section>
    <b-container>
      <b-overlay :show="isFetching" opacity="1" rounded="sm">
        <div class="d-flex justify-content-around flex-wrap">
            <b-card class="settings-item" no-body >
              <b-card-header>
                <h3>User Info</h3>
              </b-card-header>
              <b-card-body>
                <b-form @submit="submitForm">
                  <b-form-group
                    id="input-group-username"
                    label="Username"
                    label-for="input-username">
                    <b-form-input
                      id="input-username"
                      v-model="userInfoForm.username"
                      placeholder="Enter username"
                      autocomplete="off"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-password" label="Password" label-for="input-password">
                    <b-form-input
                      id="input-password"
                      type="password"
                      v-model="userInfoForm.password"
                      placeholder="Enter password"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-password-confirmation" label="Password Confirmation" label-for="input-password-confirmation">
                    <b-form-input
                      id="input-password-confirmation"
                      type="password"
                      v-model="userInfoForm.passwordConfirmation"
                      placeholder="Enter password confirmation"
                    ></b-form-input>
                  </b-form-group>

                  <b-button type="submit" variant="primary">Update</b-button>
                </b-form>
              </b-card-body>
            </b-card>

            <b-card class="settings-item" no-body v-if="gmailConnectionForm">
              <b-card-header>
                <h3>Gmail Connection</h3>
              </b-card-header>
              <b-card-body>
                <fieldset disabled>
                  <b-form-group id="input-group-connected">
                    <b-form-checkbox
                      id="input-connected"
                      :checked="gmailConnectionForm.connected"
                    > Connected</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-report-sender" label="Report Sender" label-for="input-report-sender">
                    <b-form-input
                      id="input-report-sender"
                      :value="gmailConnectionForm.reportSender"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group id="input-group-last-fetching" label="Last Connection" label-for="input-last-fetching">
                    <b-form-input
                      id="input-last-fetching"
                      :value="gmailConnectionForm.lastConnection"
                    ></b-form-input>
                  </b-form-group>
                </fieldset>
              </b-card-body>
            </b-card>
        </div>
        </b-overlay>
    </b-container>
  </section>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'

  export default {
    data: function() {
      return {
        isFetching: true,
        userInfoForm: {
          username: '',
          password: '',
          passwordConfirmation: ''
        },
        gmailConnectionForm: null
      }
    },

    computed: {
      userInfoParams() {
        let fd = new FormData();
        fd.append('user[username]', this.userInfoForm.username);
        fd.append('user[password]', this.userInfoForm.password);
        fd.append('user[password_confirmation]', this.userInfoForm.passwordConfirmation);
        return fd;
      }
    },

    created() {
      this.fetchSettings()
    },

    methods: {
      assignResponse(data) {
        this.userInfoForm.username = data.username
        this.userInfoForm.password = ''
        this.userInfoForm.passwordConfirmation = ''

        if(data.gmail_connection) {
          this.gmailConnectionForm = {
            connected: data.gmail_connection.connected,
            reportSender: data.gmail_connection.report_sender,
            lastConnection: moment(data.gmail_connection.connected_at).fromNow()
          }
        }
      },

      fetchSettings() {
        axios.get('/user').then(({ data }) => { 
          this.assignResponse(data);
          this.isFetching = false;
        })
      },

      submitForm(e){
        e.preventDefault();

        axios.put('/user', this.userInfoParams).then(({data}) => {
          this.assignResponse(data);
          this.$bvToast.toast('User info was succesfully updated!', { title: 'Success!', variant: 'success' })
        })
      }
    }
  }
</script>
<style>
  .settings-item {
    margin: 15px 2px 2px;
    width: 48%;
  }

  @media (max-width: 900px)  {
    .settings-item {
      width: 100%;
    }
  }
</style>
