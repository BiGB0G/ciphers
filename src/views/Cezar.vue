<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="1"></Sidebar>
            </div>
            <main>
                <div class="cezar-wrapper" v-loading="loading">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="btn-group">
                                    <el-tooltip class="item" effect="dark" content="Save data" placement="top">
                                        <el-button @click="saveData" type="success" icon="el-icon-check" circle></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Frequency analysis" placement="top">
                                        <el-button @click="goToDecode" type="warning" icon="el-icon-key" circle></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Delete save" placement="top">
                                        <el-button @click="cleanStorage" type="danger" icon="el-icon-delete" circle></el-button>
                                    </el-tooltip>
                                </div>
                                <h2>Caesar's Cipher</h2>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <el-switch
                                        style="display: block"
                                        @change="startEncode"
                                        v-model="encode"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="Encode"
                                        inactive-text="Decode">
                                </el-switch>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <div class="cezar__title">Input text</div>
                                <el-input
                                        class="cezar__source-text"
                                        @input="startEncode"
                                        type="textarea"
                                        :rows="2"
                                        placeholder="Please input text"
                                        v-model="sourceText">
                                </el-input>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <div class="cezar__title">Select alphabet</div>
                                <div class="cezar__inp-wrapper">
                                    <el-select @change="startEncode" class="select-default" v-model="alphabet.valueSelect" placeholder="Select">
                                        <el-option
                                                v-for="item in alphabet.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input
                                            v-if="alphabet.valueSelect === 'manually'"
                                            @input="startEncode"
                                            class="inp-default"
                                            placeholder="Please input alphabet"
                                            v-model="alphabet.value"
                                            clearable>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <div class="cezar__title">Input key</div>
                                <el-input-number v-model="key" :min="0" @input="startEncode"></el-input-number>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <el-divider class="mb-3"></el-divider>
                            <div class="result" v-if="this.resultText !== ''">
                                Result:
                                <!--<el-tooltip class="item" effect="dark" content="Click to copy" placement="top">
                                    <span @click="copyToBuffer">{{this.resultText}}</span>
                                </el-tooltip>-->
                                <span>{{this.resultText}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
    import AppHeader from "@/components/AppHeader";
    import Sidebar from "@/components/Sidebar";

    export default {
        name: "cezar",
        components: {
            AppHeader,
            Sidebar
        },
        data() {
            return {
                loading: true,
                encode: true,
                sourceText: '',
                alphabet: {
                    options: [
                        {
                            label: 'Russian',
                            value: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
                        },
                        {
                            label: 'English',
                            value: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
                        },
                        {
                            label: 'Manually',
                            value: 'manually'
                        }
                    ],
                    valueSelect: '',
                    value: ''
                },
                key: '',
                resultText: ''

            }
        },
        mounted() {
            this.loadDataFromStorage();
            setTimeout(() => this.loading = false, 1000);
        },
        methods: {
            copyToBuffer: function () {
                navigator.clipboard.writeText(this.resultText)
                    .then(() => {
                        this.$notify.info({
                            title: 'Info',
                            message: 'The text is copied to the clipboard'
                        });
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            },
            loadDataFromStorage: function () {
                let json = localStorage.getItem('cezar');
                if(json === '' || json === null || json === undefined)
                    return;
                let data = JSON.parse(json);
                this.sourceText = data.sourceText;
                this.key = data.key;
                this.resultText = data.resultText;
                switch (data.alphabet) {
                    case this.alphabet.options[0].value:
                        this.alphabet.valueSelect = data.alphabet;
                        break;
                    case this.alphabet.options[1].value:
                        this.alphabet.valueSelect = data.alphabet;
                        break;
                    default:
                        this.alphabet.valueSelect = 'manually';
                        this.alphabet.value = data.alphabet;
                        break;
                }
            },
            cleanStorage: function () {
                localStorage.setItem('cezar', '');
                this.$notify.info({
                    title: 'Info',
                    message: 'Storage successfully cleared'
                });
                this.sourceText = '';
                this.alphabet.valueSelect = '';
                this.alphabet.value = '';
                this.key = '';
                this.resultText = '';
            },
            saveData: function () {
                if(
                    this.sourceText === '' ||
                    this.alphabet.valueSelect === '' ||
                    (this.alphabet.valueSelect === 'manually' && this.alphabet.value === '')
                ){
                    this.$notify.error({
                        title: 'Error',
                        message: 'Something went wrong'
                    });
                    return;
                }
                let data = {
                    sourceText: this.sourceText,
                    alphabet: this.getAlphabet(),
                    key: this.key,
                    resultText: this.resultText
                };
                localStorage.setItem('cezar', JSON.stringify(data));
                this.$notify({
                    title: 'Success',
                    message: 'The data was successfully stored',
                    type: 'success'
                });
            },
            getAlphabet: function () {
                if(this.alphabet.valueSelect === 'manually')
                    return this.alphabet.value;
                else
                    return this.alphabet.valueSelect;
            },
            startEncode: function () {
                if(this.sourceText === '')
                    this.resultText = '';
                if(
                    this.alphabet.valueSelect === '' ||
                    (this.alphabet.valueSelect === 'manually' && this.alphabet.value === '')
                )
                    return;


                this.resultText = '';
                let alphabet = this.getAlphabet();//хранит алфавит

                for(let i = 0; i < this.sourceText.length; ++i){

                    let symbol = this.sourceText[i];//хранит рассматриваемый символ
                    let pos = alphabet.indexOf(symbol);//позиция symbol в алфавите

                    if(pos !== -1){
                        if(this.encode){ // кодирование
                            if(pos + this.key >= alphabet.length){
                                let keyTmp = this.key;
                                let distance = alphabet.length - pos;
                                keyTmp -= distance;
                                let period = parseInt(keyTmp / alphabet.length);
                                keyTmp -= alphabet.length * period;
                                this.resultText += alphabet[keyTmp];
                            } else{
                                this.resultText += alphabet[pos + this.key];
                            }
                        } else { // декодирование
                            if(pos - this.key < 0){
                                let keyTmp = this.key;
                                keyTmp -= pos + 1;
                                let period = parseInt(keyTmp / alphabet.length);
                                keyTmp -= alphabet.length * period;
                                keyTmp -= alphabet.length - 1;
                                this.resultText += alphabet[Math.abs(keyTmp)];
                            } else{
                                this.resultText += alphabet[pos - this.key];
                            }
                        }
                    } else {// -1 => символа нет в алфавите
                        this.resultText += symbol;
                    }

                }
            },
            goToDecode: function () {
                this.$router.push('/cezar/decode');
            }
        }
    }
</script>

<style scoped lang="scss">

</style>