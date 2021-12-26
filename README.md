# Vue Long Wizard

## Project setup
```
npm install
```

## Usage
```
import VueLongWizard from 'vue-long-wizard';
```
### Basic Usage
```
 <vue-long-wizard
    ref="myWizard"
    :step-data="stepData"
    @valdiateStep="valdiateStep"
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
 </vue-long-wizard>
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
                'laststep': false,
            });
        }
    },
    methods:{
        valdiateStep(currentStepIndex){
            //validate your current step
            this.stepData[currentStepIndex].step_valid = true;
            //move to next step
            this.$refs.myWizard.nextStep();
        },
        onComplete(){
            //final step submit
        }
    }
}
```
If you want to validate step from inside of component use EventBus instead.
