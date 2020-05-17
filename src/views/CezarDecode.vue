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
                                    <el-tooltip class="item" effect="dark" content="Load data from save encoding page" placement="top">
                                        <el-button @click="loadData" type="success" icon="el-icon-s-promotion" circle></el-button>
                                    </el-tooltip>
                                </div>
                                <h2>Caesar's Cipher frequency analysis</h2>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="cezar__title">Input text</div>
                                <el-input
                                        @input="start"
                                        class="cezar__source-text"
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
                                    <el-select @change="start" class="select-default" v-model="alphabet.valueSelect" placeholder="Select">
                                        <el-option
                                                v-for="item in alphabet.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input
                                            v-if="alphabet.valueSelect === 'manually'"
                                            class="inp-default"
                                            placeholder="Please input alphabet"
                                            v-model="alphabet.value"
                                            clearable>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <el-divider class="mb-3"></el-divider>
                            <div class="result" v-if="this.resultText !== ''">
                                Result:
                                <!--<el-tooltip class="item" effect="dark" content="Click to copy" placement="top">
                                    <span>{{this.resultText}}</span>
                                </el-tooltip>-->
                                <span>{{this.resultText}}</span>
                                <br>
                                Key: {{this.key}}
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

    function scalarMult(map1, map2) {
        let result = 0;
        map1.forEach((value, key) => {
            result += value * map2.get(key);
        });
        return result;
    }

    export default {
        name: "cezar-decode",
        components: {
            AppHeader,
            Sidebar
        },
        data() {
            return {
                loading: true,
                alphabet: {
                    options: [
                        {
                            label: 'Russian',
                            value: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
                            frequency: new Map([
                                ['о', 11.01],['е', 8.73],['а', 7.51],['и', 7.44],
                                ['т', 6.49],['н', 6.45],['с', 5.5],['р', 4.77],
                                ['в', 4.53],['л', 4.2],['к', 3.37],['м', 3.12],
                                ['д', 3.02],['п', 2.8],['у', 2.48],['я', 2.12],
                                ['ы', 1.97],['г', 1.8],['з', 1.75],['б', 1.75],
                                ['ч', 1.49],['й', 1.18],['х', 1.07],['ъ', 1.01],
                                ['ж', 0.97],['ь', 0.79],['ю', 0.73],['ш', 0.68],
                                ['ц', 0.45],['щ', 0.45],['э', 0.32],['ф', 0.19],
                                ['ё', 0.04]
                            ])
                        },
                        {
                            label: 'English',
                            value: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                            frequency: new Map([
                                ['e', 12.7],['t', 9.06],['a', 8.17],['o', 7.51],
                                ['i', 6.97],['n', 6.75],['s', 6.33],['h', 6.09],
                                ['r', 5.99],['d', 4.25],['l', 4.03],['c', 2.78],
                                ['u', 2.76],['m', 2.41],['w', 2.36],['f', 2.23],
                                ['g', 2.02],['y', 1.97],['p', 1.93],['b', 1.49],
                                ['v', 0.98],['k', 0.77],['x', 0.15],['j', 0.15],
                                ['q', 0.1],['z', 0.05]
                            ])
                        }
                    ],
                    valueSelect: ''
                },
                sourceText: '',
                frequencySourceText: new Map(),
                resultText: '',
                key: '',
                index: 0
            }
        },
        mounted() {
            setTimeout(() => this.loading = false, 1000);
        },
        methods: {
            loadData: function () {
                let data = JSON.parse(localStorage.getItem('cezar'));
                if(data === null)
                    return;
                this.sourceText = data.resultText;
                this.alphabet.valueSelect = data.alphabet;
                this.start();
            },
            start: function () {
                if(this.alphabet.valueSelect === '')
                    return;
                else if(this.alphabet.valueSelect === this.alphabet.options[0].value)
                    this.index = 0;
                else
                    this.index = 1;

                this.frequencySourceText.clear();

                let max = scalarMult(this.frequencyLetter(this.sourceText), this.alphabet.options[this.index].frequency);
                let maxTmp = 0;
                let textTmp = "";
                let key = 0;

                for (let i = 1; i < this.alphabet.options[this.index].value.length; ++i) {
                    textTmp = this.decode(i);
                    this.frequencySourceText = this.frequencyLetter(textTmp);
                    maxTmp = scalarMult(this.frequencySourceText, this.alphabet.options[this.index].frequency);
                    if (maxTmp > max) {
                        max = maxTmp;
                        key = i;
                    }
                }

                this.key = key;
                this.resultText = this.decode(key);
            },
            decode: function (key) {

                let decryptedText = "";

                for(let i = 0; i < this.sourceText.length; ++i){

                    let symbol = this.sourceText[i];//хранит рассматриваемый символ
                    let pos = this.alphabet.options[this.index].value.indexOf(symbol);//позиция symbol в алфавите

                    if(pos !== -1){
                        if(pos - key < 0){
                            let keyTmp = key;
                            keyTmp -= pos + 1;
                            let period = parseInt(keyTmp / this.alphabet.options[this.index].value.length);
                            keyTmp -= this.alphabet.options[this.index].value.length * period;
                            keyTmp -= this.alphabet.options[this.index].value.length - 1;
                            decryptedText += this.alphabet.options[this.index].value[Math.abs(keyTmp)];
                        } else{
                            decryptedText += this.alphabet.options[this.index].value[pos - key];
                        }
                    } else {
                        decryptedText += this.sourceText[i];
                    }

                }

                return decryptedText;
            },
            frequencyLetter: function (text) {
                let frOfLetters = new Map();
                for(let i = 0; i < this.alphabet.options[this.index].value.length; ++i){
                    let count = 0;
                    for(let j = 0; j < text.length; ++j){
                        if(text[j] === this.alphabet.options[this.index].value[i].toLowerCase())
                            ++count;
                    }
                    frOfLetters.set(this.alphabet.options[this.index].value[i].toLowerCase(), count);
                }
                return frOfLetters
            }
        }
    }
</script>

<style scoped lang="scss">

</style>