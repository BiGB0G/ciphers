<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="6"></Sidebar>
            </div>
            <main>
                <div class="cezar-wrapper" v-loading="loading">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <h2>Affine two power cipher</h2>
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
                        <div class="row mt-2">
                            <div class="col">
                                <div style="display: flex">
                                    <div>
                                        <div class="cezar__title">Key three</div>
                                        <el-input-number id="key3" @change="validateAlphabet" v-model="key3" :min="0"></el-input-number>
                                    </div>
                                    <div style="margin-left: 20px">
                                        <div class="cezar__title">Key four</div>
                                        <el-input-number id="key4" @change="validateAlphabet" v-model="key4" :min="0"></el-input-number>
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
        name: "affine2",
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
                key3: 0,
                key4: 0,
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
                    let bigram = this.createBigrams();
                    let vectors = [];
                    bigram.forEach(item => {
                        vectors.push(
                            [
                                alphabet.indexOf(item[0]),
                                alphabet.indexOf(item[1])
                            ]
                        );
                    });
                    let temp = this.mul([[this.key1, this.key2],[this.key3, this.key4]], vectors);
                    for(let i = 0; i < bigram.length; ++i) {
                        this.resultText += alphabet[temp[i][0]];
                        this.resultText += alphabet[temp[i][1]];
                    }
                } else {
                    let bigram = this.createBigrams();
                    let vectors = [];
                    bigram.forEach(item => {
                        vectors.push(
                            [
                                alphabet.indexOf(item[0]),
                                alphabet.indexOf(item[1])
                            ]
                        );
                    });
                    let delta = this.getDelta();
                    if(delta < 0) {
                        delta = delta % alphabet.length + alphabet.length;
                    }
                    else
                        delta = delta % alphabet.length;
                    let w1 = this.findW1(delta);
                    let matrixTemp = [
                        [
                            this.ostDel(this.key4 * w1, alphabet.length),
                            this.ostDel(- this.key2 * w1, alphabet.length),
                        ],
                        [
                            this.ostDel(- this.key3 * w1, alphabet.length),
                            this.ostDel(this.key1 * w1, alphabet.length)
                        ]
                    ];
                    let result = this.mul(matrixTemp, vectors);
                    for(let i = 0; i < bigram.length; ++i) {
                        this.resultText += alphabet[result[i][0]];
                        this.resultText += alphabet[result[i][1]];
                    }
                }

            },
            ostDel: function (a, b) {
                if(a < 0)
                    return a % b + b;
                else
                    return a % b;
            },
            getDelta: function () {
                return this.key1 * this.key4 - this.key2 * this.key3;
            },
            findW1: function (w) {
                let len = this.getAlphabet().length;
                for(let i = 0; i < len; ++i) {
                    if(1 === (w * i) % len)
                        return i;
                }
            },
            createBigrams: function () {
                let bigram = [];
                for(let i = 0; i < this.sourceText.length; i += 2) {
                    bigram.push(this.sourceText.slice(i, i + 2));
                }
                return bigram;
            },
            mul: function (matr1, matr2) {
                let matr = [];
                for (let i = 0; i < matr2.length; ++i) {
                    matr.push([
                        (matr1[0][0] * matr2[i][0] + matr1[0][1] * matr2[i][1]) % this.getAlphabet().length,
                        (matr1[1][0] * matr2[i][0] + matr1[1][1] * matr2[i][1]) % this.getAlphabet().length
                    ]);
                }
                return matr;
            },
            validateAlphabet: function () {
                if(this.alphabet.valueSelect === '') {
                    document.getElementById('select-alphabet').style.borderColor = 'red';
                    return;
                } else {
                    document.getElementById('select-alphabet').style.borderColor = '#DCDFE6';
                }
                if(this.nod(this.getDelta(), this.getAlphabet().length) === 1) {
                    document.querySelector('#key1>.el-input>input').style.borderColor = '#DCDFE6';
                    document.querySelector('#key2>.el-input>input').style.borderColor = '#DCDFE6';
                    document.querySelector('#key3>.el-input>input').style.borderColor = '#DCDFE6';
                    document.querySelector('#key4>.el-input>input').style.borderColor = '#DCDFE6';
                    this.startEncode();
                } else {
                    document.querySelector('#key1>.el-input>input').style.borderColor = 'red';
                    document.querySelector('#key2>.el-input>input').style.borderColor = 'red';
                    document.querySelector('#key3>.el-input>input').style.borderColor = 'red';
                    document.querySelector('#key4>.el-input>input').style.borderColor = 'red';
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