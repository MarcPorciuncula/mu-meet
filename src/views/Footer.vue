<template>
  <footer class="footer">
    <layout-section class="footer_section-beta" padding="normal">
      <layout-container padding="less">
        <type-container>
          <type-text tag="h3" type="body2" class="footer_subheading">
            You are using MUmeet beta
          </type-text>
          <type-text tag="p" type="body1">
            This site is currently under construction, some features may be missing or unstable.
          </type-text>
          <type-text tag="p" type="body1">
            For development updates, you can <a target="_blank" href="https://twitter.com/MarcoThePoro">follow the developer on twitter</a>.
          </type-text>
          <type-text tag="p" type="body1">
            Thanks for trying out MUmeet.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <!-- <layout-container tag="section" padding="less">
      <type-container>
        <type-text tag="h3" type="body2" class="footer_subheading">
          Support
        </type-text>
        <type-text tag="p" type="body1">
          Release notes
        </type-text>
        <type-text tag="p" type="body1">
          Known issues
        </type-text>
        <type-text tag="h3" type="body2" class="footer_subheading">
          Development
        </type-text>
        <type-text tag="p" type="body1">
          View source on GitHub
        </type-text>
        <type-text tag="p" type="body1">
          Contact the developer
        </type-text>
      </type-container>
    </layout-container> -->
    <a href="https://pride.codes" rel="noopener" target="_blank"><div class="pride-bar"></div></a>
    <layout-section padding="less">
      <layout-container padding="less">
        <type-container>
          <type-text tag="p" type="body2">
            MUmeet was built by <a target="_blank" rel="noopener" href="https://twitter.com/MarcoThePoro">Marc Porciuncula</a> for <a target="_blank" rel="noopener" href="http://unihack.net/">Unihack</a> Mini 2017.<br/>
            Made with ❤ in Melbourne, Australia.<br/>
            Not affiliated with Unihack or Monash University.
          </type-text>
          <type-text tag="p" type="body2">
            <span class="build-id">{{ build }}</span><br/>
            <a target="_blank" rel="noopener" href="https://github.com/MarcoThePoro/mu-meet">View source on GitHub</a>
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
  </footer>
</template>

<script>
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import { TypeContainer, TypeText } from '@/components/Material/Typography';

export default {
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
.footer {
  color: #CFD8DC;
  background-color: #263238;
}

.type {
  color: inherit;
}

.type.footer_subheading {
  font-weight: 600;
  color: white;
}

.footer_section-beta {
  background-color: #212121;
}

.footer_section-beta .footer_subheading {
  font-weight: 500;
}

.footer_section-beta .type {
  font-family: "Roboto Mono", monospace;
}

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

.build-id {
  color: #757575;
}
</style>
