# Vue Multi Step Form
Vue Multi Step Form is a light weight component for form containing multiple steps and multiple components.
It will encapsulate all your form fields within one form So you can also submit form by web post request. 
## Project setup
```
npm install vue-multi-step-form
```

## Usage
```
import VueMultiStepForm from 'vue-multi-step-form';
```
### Basic Usage
```
 <vue-multi-step-form
    id="myWizard"
    name="myWizard"
    :step-data="stepData"
    @onComplete="onComplete"
 >
    <template slot="header-row">
       <h2>Wizard Heading</h2>
    </template>
    <template slot="step1">
       <component1 />
    </template>
    <template slot="step2">
       <component2 />
    </template>
    <template slot="step3">
       <component3 />
    </template>
 </vue-multi-step-form>
```
```
export dafault{
    data(){
        stepData:[],
    },
    mounted(){
        //optional
        for(let i=0;i<3;i++){
            //these all are default and optional values
            this.stepData.push({
                'step_valid': true,
                'step_skip': false,
                'show_back_button': true,
                'show_next_button': true,
                'last_step': false,
            });
        }
    },
    methods:{
        onComplete(){
            //final step submit
        }
    }
}
```
If you want to validate step from inside of component use EventBus instead.
### Validation
```
<vue-multi-step-form
    id="myWizard"
    name="myWizard"
    ref="myWizard"
    :step-data="stepData"
    @valdiateStep="valdiateStep"
    @onComplete="onComplete"
 >
```
if step_valid is false for current step in stepData then VueMultiStepForm will emit validateStep
Use your validation package or our VueNiceValidate package to validate current step fields and
set step_valid for current_step to true. 
```
methods:{
    valdiateStep(currentStepIndex){
        //validate your current step here
        //if current step is valid set step_valid 
        this.stepData[currentStepIndex].step_valid = true;
        //move to next step 
        this.$refs.myWizard.nextStep();
        //next step will keep emiting validateStep until step_valid is true
    },
}
```
### Post Submit
if action prop is defined then your form will submit through web request else it will emit onComplete event
```
<vue-multi-step-form
    id="myWizard"
    name="myWizard"
    :action="'/my-post-url'"
    method="POST" 
    :step-data="stepData"
    @valdiateStep="valdiateStep"
 >
 ```
 ### Custom Footer

```
<template
v-slot:footer="props"
>
    <div class="mt-5 m-0-a">
    <div class="row">
        <button
        v-if="!props.isFirstStep"
        type="button"
        class="btn btn-outline-dark fade-in-out mr-1"
        @click="prevClick"
        >
        {{ 'back' }}
        </button>
        <button
        type="button"
        class="btn btn-md btn-primary"
        @click="nextClick"
        >
        {{ props.isLastStep ? (post ? 'Update Post' : 'Create Post') : 'Next' }}
        </button>
    </div>
    </div>
</template>
```
You can manually go to next step and prev step by using component methods.
```
methods:{
    nextClick: function (e) {
        this.$refs.multiStep.nextStep();
    },
    prevClick: function (e) {
        this.$refs.multiStep.prevStep();
    },
}
```

 ### Props
| Props         | type      | required   | Default               |
| ------------- | --------- | ---------- | --------------------  |
| id            | String    | false      | 'vue_multi_step_form' |
| name          | String    | false      | 'vue_multi_step_form' |
| action        | String    | false      | ''                    |
| method        | String    | false      | 'POST'                |
| noHeader      | Boolean   | false      | false                 |
| noFooter      | Boolean   | false      | false                 |
| stepData      | Array     | true       |                       |
 
 ### Step Data Format
| property          | type      | required   | Default   |
| ----------------- | --------- | ---------- | --------- |
| step_valid        | Boolean   | false      | true      |
| step_skip         | Boolean   | false      | false     |
| show_back_button  | Boolean   | false      | true      |
| show_next_button  | Boolean   | false      | true      |
| last_step         | Boolean   | false      | false     |