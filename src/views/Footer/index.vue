<template>
  <footer class="bg-blue-grey-900">
    <div class="flex flex-column items-center">
      <div class="w-100 mw8-l flex-l flex-row-reverse-l">
        <div class="flex flex-column items-center bg-grey-900 w-50-l">
          <div class="mw8 w-100 mono pa3 blue-grey-100">
            <h3 class="f6 fw5 white lh-title">You are using MUmeet beta</h3>
            <p class="f7 fw3 lh-copy">
              This site is currently under construction, some features may be missing or unstable.<br/>
              For development updates you can <a target="_blank" href="https://twitter.com/MarcoThePoro">follow the developer on twitter</a>.
            </p>
            <p class="f7 fw3 lh-copy">
              Thanks for trying MUmeet.
            </p>
          </div>
        </div>
        <div class="flex flex-column items-center bg-blue-grey-900 w-50-l">
          <div class="mw8 w-100 pt3 pb4 ph3 white">
            <p class="f6 lh-copy">
              MUmeet was built by <a target="_blank" rel="noopener" href="https://twitter.com/MarcoThePoro">Marc Porciuncula</a> for <a target="_blank" rel="noopener" href="http://unihack.net/">Unihack</a> Mini 2017.<br/>
              Made with ❤ in Melbourne, Australia.<br/>
              Not affiliated with Unihack or Monash University.
            </p>
            <div class="h0 w3 bb b--gray"></div>
            <p class="f6 lh-copy">
              <span class="grey-400">
                {{ build }}
              </span>
              <br/>
              <a target="_blank" rel="noopener" href="https://github.com/MarcoThePoro/mu-meet">View source on GitHub</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <a href="https://pride.codes" rel="noopener" target="_blank"><div class="pride-bar"></div></a>
  </footer>
</template>

<script>
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import { TypeContainer, TypeText } from '@/components/Material/Typography';

export default {
  name: 'Footer',
  components: {
    LayoutContainer,
    LayoutSection,
    TypeContainer,
    TypeText,
  },
  created() {
    if (!document.querySelector('[data-pride-codes-stylesheet]')) {
      const el = document.createElement('link');
      el.setAttribute('rel', 'stylesheet');
      el.setAttribute('href', 'https://cdn.pride.codes/css/bar_helpers.css');
      el.setAttribute('data-pride-codes-stylesheet', '');
      document.head.appendChild(el);
    }
  },
  computed: {
    build() {
      if (process.env.BUILD_ID) {
        return `Build ${process.env.BUILD_ID}`;
      } else {
        return 'Test build';
      }
    },
  },
};
</script>

<style scoped lang="scss">
a {
  border-bottom: 1px solid #CFD8DC;

  &:focus,
  &:hover {
    color: white;
    border-bottom-color: white;
  }

  &:active {
    color: #212121;
    background-color: white;
  }
}
</style>
