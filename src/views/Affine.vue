<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="2"></Sidebar>
            </div>
            <main>
                <div class="cezar-wrapper" v-loading="loading">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <h2>Affine cipher</h2>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <el-switch
                                        style="display: block"
                                        @change="validateAlphabet"
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
                                        @input="validateAlphabet"
                                        type="textarea"
                                        :rows="2"
                                        placeholder="Please input text"
                                        v-model="sourceText">
                                </el-input>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <div class="cezar__title">Select Alphabet</div>
                                <div class="cezar__inp-wrapper">
                                    <el-select id="select-alphabet" @change="validateAlphabet" class="select-default select-error" v-model="alphabet.valueSelect" placeholder="Select">
                                        <el-option
                                                v-for="item in alphabet.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input
                                            v-if="alphabet.valueSelect === 'manually'"
                                            @input="validateAlphabet"
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
                                <div style="display: flex">
                                    <div>
                                        <div class="cezar__title">Key one</div>
                                        <el-input-number id="key1" @change="validateAlphabet" v-model="key1" :min="0"></el-input-number>
                                    </div>
                                    <div style="margin-left: 20px">
                                        <div class="cezar__title">Key two<span id="error-message">NOD({{this.key1}}, {{this.getAlphabet().length}}) not equal to one</span></div>
                                        <el-input-number id="key2" @change="validateAlphabet" v-model="key2" :min="0"></el-input-number>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button @click="startEncode">DEBUG</button>
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
        name: "replacement",
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
                key1: 0,
                key2: 0,
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
                if(this.sourceText === '') {
                    return;
                }
                this.resultText = '';
                let alphabet = this.getAlphabet();

                if(this.encode) {
                    for(let i = 0; i < this.sourceText.length; ++i) {
                        if(this.sourceText[i] === ' ') {
                            this.resultText += ' ';
                            continue;
                        }
                        let index = alphabet.indexOf(this.sourceText[i]);
                        let newIndexChar = (this.key1 * index + this.key2) % alphabet.length;
                        this.resultText += alphabet[newIndexChar];
                    }
                } else {
                    let temp = this.equation();
                    for(let i = 0; i < this.sourceText.length; ++i) {
                        if(this.sourceText[i] === ' ') {
                            this.resultText += ' ';
                            continue;
                        }
                        let index = alphabet.indexOf(this.sourceText[i]);
                        let tmp = (temp * (index - this.key2)) % alphabet.length;
                        while (tmp < 0) {
                            tmp = alphabet.length + tmp;
                        }
                        this.resultText += alphabet[tmp];
                    }
                }

            },
            equation: function () {
                for(let i = 1; i < this.getAlphabet().length; ++ i) {
                    if(this.key1 * i % this.getAlphabet().length === 1) {
                        return i;
                    }
                }
            },
            validateAlphabet: function () {
                if(this.alphabet.valueSelect === '') {
                    document.getElementById('select-alphabet').style.borderColor = 'red';
                    return;
                } else {
                    document.getElementById('select-alphabet').style.borderColor = '#DCDFE6';
                }
                if(this.nod(this.key1, this.key2) === 1 && this.key1 <= this.getAlphabet().length) {
                    this.startEncode();
                    this.hideError();
                } else {
                    this.showError();
                }
            },
            nod: function (a, b) {
                while(a > 0 && b > 0)
                    if(a > b)
                        a %= b;
                    else
                        b %= a;
                return a + b;
            },
            showError: function () {
                document.querySelector('#key1>.el-input>input').style.borderColor = 'red';
                document.querySelector('#key2>.el-input>input').style.borderColor = 'red';
                try { document.getElementById('input-manually').style.borderColor = 'red'; } catch (e) { '' }
                document.getElementById('error-message').style.display = 'inline';
            },
            hideError: function () {
                document.querySelector('#key1>.el-input>input').style.borderColor = '#DCDFE6';
                document.querySelector('#key2>.el-input>input').style.borderColor = '#DCDFE6';
                // document.getElementById('input-key').style.borderColor = '#DCDFE6';
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