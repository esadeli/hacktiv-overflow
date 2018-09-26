<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>{{text}}</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  computed: {
    text () {
      return this.$store.state.text
    }
  }
}
</script>
