<template>
  <div>
    <div class="w-100 h-100 flex items-center justify-center br-100 bg-blue-grey-800 white relative">
      <span v-if="user.profile && src === nophoto" class="lh-title absolute">
        {{ user.profile.name[0] }}
      </span>
      <img
        :src="src"
        :alt="alt"
        width="100"
        height="100"
        class="w-100 h-100 br-100"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePicture',
  props: {
    user: {},
  },
  computed: {
    src() {
      return this.user.profile.picture;
    },
    alt() {
      return `${this.user.profile.name}'s Picture'`;
    },
    nophoto() {
      return 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
    },
  },
};
</script>
