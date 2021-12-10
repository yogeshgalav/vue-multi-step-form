<template>
  <div class="progress">
    <div
      class="progress-bar"
      role="progressbar"
      :aria-valuenow="progress_value"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="'width:'+progress_value+ '%'"
    >
      <span class="sr-only">{{ $t('vue-progressbar.complete', { percentage: progress_value }) }} </span>
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
export default {
	props: { progress: {
		type: Number, default: 0
	}
	},
	data() {
		return {
			progress_value:(Math.floor(this.progress)),
		};
	},
	watch:{
		progress(val){
			this.progress_value=(Math.floor(val));
		}
	}
};
</script>
