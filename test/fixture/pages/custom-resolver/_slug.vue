<template>
  <section>pages/custom-resolver/_slug.vue</section>
</template>

<script>
export default {
  editThisPage({ route }) {
    const { slug } = route.params;
    return `${slug}.md`;
  },
};
</script>