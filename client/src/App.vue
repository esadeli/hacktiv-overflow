<template>
  <div id="app">
    <Navbar @result-token = "gettoken" @result-user-id= "getuserid"></Navbar>
    <!--
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    -->
    <router-view :sendtoken= "token" :senduserid= "userid"></router-view>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue'
// import Article from '@/views/Article.vue'

export default {
  data () {
    return {
      token: '',
      userid: ''
    }
  },
  components: {
    Navbar
  },
  methods: {
    gettoken (input) {
      this.token = input
    },
    getuserid (input) {
      this.userid = input
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
