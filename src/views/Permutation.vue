<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="5"></Sidebar>
            </div>
            <main>
                <div class="cezar-wrapper" v-loading="loading">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <h2>Permutation cipher</h2>
                            </div>
                        </div>
                        <div class="row mt-2">
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
                                <div style="display: flex">
                                    <div v-for="(item, i) in matrix" :key="i" style="margin-left: 5px;margin-right: 5px">
                                        <div class="cezar__title" v-if="i === 0">Key</div>
                                        <div v-else style="height: 24px"></div>
                                        <el-input-number id="key1" @change="validateAlphabet" v-model="matrix[i]" :min="1"></el-input-number>
                                    </div>
                                    <div>
                                        <el-button @click="addItemToMatrix" style="margin-top: 23px;margin-left: 15px" type="primary" icon="el-icon-plus"></el-button>
                                    </div>
                                </div>
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
        name: "permutation",
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
                resultText: '',
                matrix: [0]
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

                let blocks = [];
                for(let i = 0; i < this.sourceText.length;i += this.matrix.length) {
                    blocks.push(this.sourceText.slice(i, i + this.matrix.length));
                }
                if(blocks[blocks.length - 1].length < this.matrix.length) {
                    blocks[blocks.length - 1] += this.sourceText.slice(0, this.matrix.length - blocks[blocks.length - 1].length);
                }
                for(let i = 0; i < blocks.length; ++i) {
                    let block = '';
                    this.matrix.forEach(item => {
                        block += blocks[i][item - 1];
                    });
                    this.resultText += block;
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
                this.startEncode();
/*                if(this.alphabet.valueSelect === '') {
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
                }*/
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
            },
            addItemToMatrix: function () {
                this.matrix.push(0);
                this.startEncode();
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