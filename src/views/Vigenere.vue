<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="3"></Sidebar>
            </div>
            <main>
                <div class="cezar-wrapper" v-loading="loading">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <h2>Vigenere cipher</h2>
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
                                <div class="cezar__title">Select alphabet<span id="error-message">Key must be mixed alphabet!</span></div>
                                <div class="cezar__inp-wrapper">
                                    <el-select id="select-alphabet" @change="startEncode" class="select-default select-error" v-model="alphabet.valueSelect" placeholder="Select">
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
                                            id="input-manually"
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
                                <el-input id="input-key" class="inp-default" @input="startEncode" placeholder="Please input key" v-model="key" clearable></el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <el-divider class="mb-3"></el-divider>
                            <div class="result" v-if="this.resultText !== ''">
                                Result:
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
        name: "vigenere",
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
                keyTmp: '',
                resultText: ''
            }
        },
        mounted() {
            setTimeout(() => this.loading = false, 1000);
        },
        methods: {
            getAlphabet: function () {
                if(this.alphabet.valueSelect === 'manually')
                    return this.alphabet.value;
                else
                    return this.alphabet.valueSelect;
            },
            startEncode: function () {
                console.log('start');
                this.resultText = '';
                if(this.sourceText === ''){
                    return;
                }
                if(
                    this.alphabet.valueSelect === '' ||
                    (this.alphabet.valueSelect === 'manually' && this.alphabet.value === '')
                )
                    return;
                if(this.key === ''){
                    this.hideError();
                    return;
                }

                let alphabet = this.getAlphabet();
                if (!this.validateAlphabet(alphabet, this.key)){
                    this.showError();
                    return null;
                } else {
                    this.hideError();
                }
                // let alphabet = this.getAlphabet();
                this.keyTmp = this.key;

                if (this.sourceText.length > this.keyTmp.length) {
                    this.addSymbolsToKey();
                } else
                    if (this.sourceText.length < this.keyTmp.length){
                        this.resultText = '';
                        return;
                    }

                for(let i = 0; i < this.sourceText.length; ++i){
                    if (this.sourceText[i] === ' ')
                        continue;

                    let index = (alphabet.indexOf(this.sourceText[i]) + alphabet.indexOf(this.keyTmp[i])) % alphabet.length;

                    this.resultText += alphabet[index];
                }
            },
            addSymbolsToKey: function () {
                let tmp = this.sourceText.length / this.keyTmp.length - 1;
                let tmpKey = this.keyTmp;
                for(let i = 0; i < tmp; ++i){
                    this.keyTmp += tmpKey;
                }
                let restChar = this.sourceText.length % this.keyTmp.length;
                for(let i = 0; i < restChar; ++i){
                    this.keyTmp += this.keyTmp[i];
                }
            },
            validateAlphabet: function (alphabet, key) {
                if(alphabet.length !== key.length)
                    return false;
                for(let i = 0; i < alphabet.length; ++i){
                    if(key.indexOf(alphabet[i]) === -1)
                        return false;
                }
                return true;
            },
            showError: function () {
                document.getElementById('select-alphabet').style.borderColor = 'red';
                document.getElementById('input-key').style.borderColor = 'red';
                try { document.getElementById('input-manually').style.borderColor = 'red'; } catch (e) { '' }
                document.getElementById('error-message').style.display = 'inline';
            },
            hideError: function () {
                document.getElementById('select-alphabet').style.borderColor = '#DCDFE6';
                document.getElementById('input-key').style.borderColor = '#DCDFE6';
                try { document.getElementById('input-manually').style.borderColor = '#DCDFE6'; } catch (e) { '' }
                document.getElementById('error-message').style.display = 'none';
            }
        }
    }
</script>

<style scoped lang="scss">
    #error-message{
        margin-left: 10px;
        font-size: 13px;
        color: #c10000;
        display: none;
    }
</style>