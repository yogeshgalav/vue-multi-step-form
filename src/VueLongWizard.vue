<template>
  <div class="vue-form-wizard">
    <loading 
      :active.sync="showLoader"
      :color="'#10069F'"
      :width="250"
      :is-full-page="true"
    />
    <div class="row">
      <div class="col-md-11 center-col">
        <div
          v-if="show_back_button"
          class=" custom-link mb-2 ml-2 "
        >
          <button
            type="button"
            class="btn btn-link"
            @click="prevTab()"
          >
            <i
              class="fa fa-angle-left"
              aria-hidden="true"
            />
            {{ $t('common-buttons.back') }}
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <slot name="header-row" />
    </div>

    <div
      v-for="step in totalSteps"
      :key="step"
      class="row"
    >
      <div class="col-md-11 center-col">
        <slot
          v-if="step===activeStep"
          :id="'step'+step"
          :name="'step'+step"
        />
      </div>
    </div>

    <div class="wizard-card-footer">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-6 pt-2">
            <progress-bar
              :progress="progress"
            />
          </div>

          <div class="col-md-4 col-2 text-right">
            <button
              v-if="show_next_button"
              type="submit"
              class="btn btn-primary wizard-btn"
              @click="nextTab()"
            >
              {{ $t('common-buttons.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProgressBar from './ProgressBar';
import EventBus from './event-bus';
import swal from '../components/swal';

export default {
	components: {
		ProgressBar
	},
	props:{
		stepData: { type: Array, default: () => [] },
	},
	data(){
		return{
			showLoader:false,
			step_valid:true,
			stepIndex:0,
			emitFunctions:[],
		};
	},
	computed:{
		totalSteps(){
			return this.stepData.length;
		},
		activeStep(){
			return this.stepData[this.stepIndex] ? this.stepData[this.stepIndex].step :0;
		},
		isLastStep(){
			return this.stepData[this.stepIndex] ? this.stepData[this.stepIndex].laststep : false;
		},
		progress(){
			return (this.activeStep/this.totalSteps)*100;
		},
		show_back_button(){
			return this.stepData[this.stepIndex] ? this.stepData[this.stepIndex].backbutton :false;
		},
		show_next_button(){
			return this.stepData[this.stepIndex] ? this.stepData[this.stepIndex].nextTab :true;
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
				if(self.stepIndex>stepHash && self.show_back_button===false){
					swal.confirmDialog(self.$t('vue-create-commitment-wizard.back-warning'),'', 'warning', self.$t('common-buttons.yes'),  self.$t('common-buttons.no')).then((result) => {
						if(result.value){
							window.location.href=window.location.href.replace(location.hash,'');
						}
					});
				}else if(self.stepIndex>stepHash && self.show_back_button===true){
					self.prevTab();
				}
			} 
		});
		EventBus.$on('validateWizard', (step,valid) => {
			if(step===this.activeStep && valid===true){
				this.nextStep();
				window.scrollTo(0, 0);
			}
			let emit_function=this.stepData[this.stepIndex].emit;
			if(step===this.activeStep && valid==='wait' && emit_function!==''){
				if(!this.emitFunctions.includes(emit_function)){
					this.showLoader=true;
					this.$emit(emit_function);
					this.emitFunctions.push(emit_function);
				}
			}else if(step===this.activeStep && valid===false && emit_function!==''){
				this.showLoader=false;
				let emitIndex=this.emitFunctions.indexOf(this.stepData[this.stepIndex].emit);
				if(emitIndex>-1){
					this.emitFunctions.splice(emitIndex, 1);
				}
			}
		});
	},
	methods:{
		nextTab(){
			if(this.stepData[this.stepIndex].validation===true){
				EventBus.$emit('validateStep'+this.activeStep);
			}else{
				this.nextStep();
			}

		},
		nextStep(){
			this.showLoader=false;
			if(this.isLastStep){
				this.$emit('onComplete');
				return false;
			}
			this.stepIndex++;
			while(this.stepData[this.stepIndex].stepskip===true){
				this.stepIndex++;
			}
			window.location.hash = this.stepIndex;
		},
		prevTab(){
			let emitIndex=this.emitFunctions.indexOf(this.stepData[this.stepIndex-1].emit);
			if(emitIndex>-1){
				this.emitFunctions.splice(emitIndex, 1);
			}
			this.stepIndex--;
			while(this.stepData[this.stepIndex].stepskip===true){
				let emitIndex=this.emitFunctions.indexOf(this.stepData[this.stepIndex-1].emit);
				if(emitIndex>-1){
					this.emitFunctions.splice(emitIndex, 1);
				}

				this.stepIndex--;
			}
			window.location.hash = this.stepIndex;
		}
	}
};
</script>
<style>
    .wizard-progress-bar {
        display: none !important;
    }

    .wizard-nav {
        display: none !important;
    }
    .wizard-header
    {
        visibility: hidden;
    }
    .custom-link .btn
    {
        padding:15px 0;
    }
    .vue-form-wizard .wizard-tab-content {
        min-height: 100px;
        padding: 0px 20px 10px;
    }
    .vue-form-wizard {
        padding-top: 100px;
    }
    .vue-form-wizard .wizard-card-footer {
        background: #FFFFFF;
        box-shadow: 0 -2px 50px rgba(0, 0, 0, 0.15);
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 20px 20% 20px 20%;
        z-index: 300;
        left: 0;
    }

    .wizard-btn {
        border-radius: 3px;
        text-transform: uppercase;
        border: 0 !important;
        padding: 10px 0 10px 0 !important;
    }
    .finish-button{
      background-color: rgb(16, 6, 159) !important;
      color:white;
    }
    @media only screen and (max-width:768px) {
        .vue-form-wizard .wizard-card-footer {
            background: #FFFFFF;
            box-shadow: 0 -2px 50px rgba(0, 0, 0, 0.15);
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 20px 5% 20px 5%;
            left: 0;
        }
        .vue-form-wizard .wizard-header
       {
           padding: 0;
       }
        .vue-form-wizard .wizard-tab-content {
            min-height: 100px;
            padding: 30px 0px 10px;
        }
    }
</style>
