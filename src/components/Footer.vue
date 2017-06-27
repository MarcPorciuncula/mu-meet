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
    <layout-section padding="less">
      <layout-container padding="less">
        <type-container>
          <type-text tag="p" type="body2">
            MUmeet was built by <a href="#">Marc Porciuncula</a> for <a href="#">Unihack</a> Mini 2017.<br/>
            Made with ❤ in Melbourne, Australia.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
  </footer>
</template>

<script>
import LayoutContainer from './Layout/Container';
import LayoutSection from './Layout/Section';
import { TypeContainer, TypeText } from './Material/Typography';

export default {
  components: {
    LayoutContainer,
    LayoutSection,
    TypeContainer,
    TypeText,
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
</style>
