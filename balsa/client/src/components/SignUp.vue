<template>
  <el-row type="flex" justify="center">
    <el-col :span="8" :xs="20" style="margin-top:3%">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-row type="flex" justify="center" style="margin-top:24px;">
              <el-col :lg="16" :xl="14">
                <el-row>
                  <el-form
                    label-position="top"
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="120px"
                  >
                    <div class="small-text-color" v-if="!process.env.VUE_APP_DEMO_MODE">* Now, you are going to create an admin account on this Balsa instance. That means, you will be able to add other users to this platform as well, either as user account, or admin account.</div>
                    <el-row type="flex" :gutter="20">
                      <el-col>
                        <el-form-item label="Name" prop="name">
                          <el-input v-model="ruleForm.name" autocomplete="given-name"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="Surname" prop="surname">
                          <el-input v-model="ruleForm.surname" autocomplete="family-name"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="Email" prop="email" :error="errors.email">
                      <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                      <el-input v-model="ruleForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top:10px">
                      <el-button
                        :class="{'full-width':fullWidth}"
                        type="primary"
                        @click="submitForm('ruleForm')"
                      >Sign Up</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import Button from './Button.vue';
import gql from 'graphql-tag';
import NotificationMixin from './Mixins/NotificationMixin';
import process from 'process';

export default {
  mixins: [NotificationMixin],
  data() {
    return {
      fullWidth: true,
      loading: false,
      ruleForm: {
        name: '',
        surname: '',
        email: '',
        password: '',
      },
      errors: {
        email: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please enter your name.',
            trigger: 'change',
          },
          {
            min: 3,
            max: 50,
            message: 'Length should be 3 to 50',
            //trigger: 'blur',
          },
        ],
        surname: [
          {
            required: true,
            message: 'Please enter your surname.',
            trigger: 'change',
          },
          {
            min: 3,
            max: 50,
            message: 'Length should be 3 to 50',
            //trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: 'An email address is required.',
            trigger: 'change',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            //trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: 'A password is required.',
            trigger: 'change',
          },
          {
            min: 6,
            max: 255,
            message: 'Length should be 6 to 255',
            //trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      this.$router.push({ name: 'home' });
    }
  },
  methods: {
    submitForm(formName) {
      this.errors.email = '';
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.register()
            .then(({ data }) => {
              this.loading = false;
              this.notifySuccess('Signed up successfully. Now you may login.');
              this.$router.push({ name: 'login' });
            })
            .catch(error => {
              this.notifyError(error.message);
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register() {
      return this.$apollo.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
            register(email: $email, password: $password, firstName: $firstName, lastName: $lastName)
          }
        `,
        variables: {
          email: this.ruleForm.email,
          password: this.ruleForm.password,
          firstName: this.ruleForm.name,
          lastName: this.ruleForm.surname,
        },
      });
    },
  },
  apollo: {
    configurations: {
      query: gql`
        query configurations {
          configurations {
            id
            appInitialized
          }
        }
      `,
      result({ data }) {
        const configurations = data.configurations;
        if (configurations.appInitialized && !process.env.VUE_APP_DEMO_MODE) {
          this.$router.push({ name: 'login' });
        }
      },
    },
  },
};
</script>
<style scoped>
</style>
