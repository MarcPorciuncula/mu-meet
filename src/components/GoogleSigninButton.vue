<template>
  <button class="google-signin-button" @click="$emit('click', $event)">
    <span class="google-signin-button_alt">Sign in with google</span>
  </button>
</template>

<script>
export default {};
</script>

<style lang="scss">
.google-signin-button {
  background: url("../assets/google_signin_buttons/btn_google_signin_light_normal_web.png");
  width: 191px;
  margin-left: -4px;
  margin-right: -4px;
  padding: 0;
  height: 46px;
  border: none;
  border-radius: 2px;

  &:focus {
    background: url("../assets/google_signin_buttons/btn_google_signin_light_focus_web.png");
  }

  &:active {
    background: url("../assets/google_signin_buttons/btn_google_signin_light_pressed_web.png");
  }

  &[disabled] {
    background: url("../assets/google_signin_buttons/btn_google_signin_light_disabled_web.png");
  }
}

.google-signin-button_alt {
  opacity: 0;
}
</style>
