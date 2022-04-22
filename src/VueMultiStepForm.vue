<template>
  <form
    :id="id"
    class="vue-multi-form"
    :name="name"
    :action="action"
    :method="method"
  >
    <div
      v-if="!noHeader"
      class="row"
    >
      <slot
        name="header" 
        :currentStep="currentStep"
        :stepIndex="stepIndex"
      />
    </div>

    <div
      v-for="(step,index) in stepData"
      :key="index"
    >
      <div
        v-show="index===stepIndex" 
        class="vue-form-step"
      >
        <slot
          :id="'step'+index"
          :name="'step'+index"
          :currentStep="currentStep"
          :stepIndex="stepIndex"
        />
      </div>
    </div>

    <div
      v-if="!noFooter"
      class="row"
    >
      <slot
        name="footer"
        :isFirstStep="isFirstStep"
        :isLastStep="isLastStep"
        :currentStep="currentStep"
        :stepIndex="stepIndex"
      >
        <button
          v-if="stepIndex!==0"
          type="button"
          class="btn btn-md btn-primary"
          @click="prevStep"
        >
          {{ 'Previous' }}
        </button>

        <button
          type="button"
          class="btn btn-md btn-primary"
          @click="nextStep"
        >
          {{ isLastStep ? 'Submit' : 'Next' }}
        </button>
      </slot>
    </div>
  </form>
</template>
<style>
.vue-multi-form {
  overflow: hidden;
}

.vue-form-step {
  
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>
<script>
export default {
	props:{
		id: { 
			type: String, 
			default: 'vue_multi_step_form',
      		required: false,
		},
		name: { 
			type: String, 
			default: 'vue_multi_step_form',
			required: false,
		},
		action: { 
			type: String, 
			default: '',
      		required: false,
		},
		method: { 
			type: String, 
			default: 'POST',
      		required: false,
		},
		stepData: { 
			type: Array, 
			default: () => [],
      		required: true, 
		},
		noHeader: { 
			type: Boolean, 
			default: false,
      		required: false,
		},
		noFooter: { 
			type: Boolean, 
			default: false,
      		required: false,
		},
	},
	data(){
		return{
			stepIndex:0,
			emitFunctions:[],
		};
	},
	computed:{
		totalSteps(){
			return this.stepData.length;
		},
		currentStep(){
			let basic_step_data = {
				show_back_button: false,
				show_next_button: false,
				step_valid: true,
				step_skip: false,
				last_step: false,
			};
			return this.stepData[this.stepIndex] 
				? Object.assign(basic_step_data,this.stepData[this.stepIndex]) 
				: basic_step_data;
		},
		isFirstStep(){
			if(!this.stepData.length) return false;
			else if(!this.stepData[0].stepskip && this.stepIndex!==0) return false;
			else if(!this.stepData[0].stepskip && this.stepIndex===0) return true;
			return this.stepIndex===this.stepData.findIndex(el=>el.stepskip===false);
		},
		isLastStep(){
			if(this.stepIndex === (this.totalSteps-1)) return true;
      
			return (this.currentStep && this.currentStep.last_step) ? this.currentStep.last_step : false;
		},
		progress(){
			return ((this.stepIndex+1)/this.totalSteps)*100;
		},
	},
	watch:{
		stepData(val){
			if(val.length){
				let i=0;
				while(val[i].stepskip===true){
					this.stepIndex++;
					i++;
				}
				val[i].backbutton=false;
			}
		},
	},
	mounted(){
		var self=this;
		window.addEventListener('hashchange', ()=>{
			let stepHash=parseInt(window.location.hash.replace('#',''));
			if(stepHash){
				if(self.stepIndex>stepHash && !this.currentStep.show_back_button){
					window.location.href=window.location.href.replace(location.hash,'');
				}else if(self.stepIndex>stepHash && this.currentStep.show_back_button===true){
					self.prevTab();
				}
			} 
		});
	},
	methods:{
		nextStep(){
			if(!this.currentStep.step_valid){
				this.$emit('valdiateStep', this.stepIndex);
				return false;
			}
			if(this.isLastStep && this.action){
				this.submitForm();
			}
			if(this.isLastStep){
				this.$emit('onComplete');
				return false;
			}
			this.stepIndex++;
			while(this.currentStep.step_skip===true){
				this.stepIndex++;
			}
			window.location.hash = this.stepIndex;
		},
		prevStep(){
			this.stepIndex--;
			while(this.currentStep.step_skip===true){
				this.stepIndex--;
			}
			window.location.hash = this.stepIndex;
		},
		submitForm(){
			document.getElementById(this.id).submit();
		}
	}
};
</script>