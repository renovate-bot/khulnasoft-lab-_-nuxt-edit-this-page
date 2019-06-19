<template>
  <section>
    pages/scoped-slot.vue
    <edit-this-page-link id="link-with-scoped-slot">
      <template v-slot:default="{ href }">
        <span>{{ href }}</span>
      </template>
    </edit-this-page-link>
  </section>
</template>

<script>
export default {};
</script>