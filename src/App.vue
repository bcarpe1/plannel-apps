<template>
  <div>
    <PlannelHeader />
    <section style="height: 170px"></section>
    <PlannelBody />
  </div>
</template>

<script>
import PlannelHeader from './components/PlannelHeader.vue'
import PlannelBody from './components/PlannelBody.vue'

export default {
  name: 'App',
  components: {
    PlannelHeader,
    PlannelBody
  }
}
</script>

<style>
@font-face {
    font-family: 'cedarville_cursive';
    src: url('@/assets/fonts/CedarvilleCursive-Regular.ttf');
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  background-image: url('~@/assets/Flannel_Loose.png');
}

.plannel-header {
  font-family: 'cedarville_cursive';
}
</style>
