<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Druid",
  components: { iFrame },
  data() {
    return {
      // url: process.env.VUE_APP_BASE_API + "/druid/login.html"
      url: window.location.hostname + ":8022/druid/login.html"
    };
  },
  created() {
    console.log(window.location)
    console.log(window.location.hostname + ":8022/druid/login.html")
  }
};
</script>
