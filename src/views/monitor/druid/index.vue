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
      url: process.env.VUE_APP_BASE_API + "/druid/login.html"
      // url: "/druid/login.html"
    };
  },
  created() {
    document.domain = window.location.hostname
    console.log(window.location)
  }
};
</script>
