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
                            value: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
                        },
                        {
                            label: 'English',
                            value: 'abcdefghijklmnopqrstuvwxyz'
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
            setTimeout(() => this.loading = false, 500);
        },
        methods: {
            getAlphabet: function () {
                if(this.alphabet.valueSelect === 'manually')
                    return this.alphabet.value;
                else
                    return this.alphabet.valueSelect;
            },
            startEncode: function () {
                //Исходный текст
                const sourceText = this.sourceText.split('')
                //Алфавит
                const ABC = this.getAlphabet().split('')
                //Отфильтрованное
                let outputTemp = ""
                //Длинна ключа
                let keyLong = 0
                //Фильтр
                for (let i = 0; i < sourceText.length; i++) {
                    if (ABC.indexOf(sourceText[i].toLowerCase()) !== -1) {   //Тут все совпадения с алфавитом
                        outputTemp += sourceText[i]
                        keyLong++
                    } else if ( sourceText[i] === " " || sourceText[i] === "\n") {  //Тут исключения, можно добавить ещё или удалить вообще
                        outputTemp += sourceText[i]
                    } //Тут можно добавить ошибку (в блок else) на не совпадения с алфавитом или исключениями
                }
                //Подгоняем ключ по длинне
                let key = this.key.toLowerCase().split('')
                if (key.length === 0) { //Это для того, чтобы при вводе текста без ключа он шифровался первой буквой алфавита
                    key = ABC[0].repeat(keyLong)
                } else if (keyLong > this.key.length) {
                    for (let k = 0, s = 0; k < (keyLong - this.key.length); k++, s++) {
                        if (s > this.key.length - 1) {
                            s = 0
                        }
                        key.push(key[s])
                    }
                }
                console.log(key)
                let output = ""
                if (this.encode) {
                    //Шифруем
                    for (let h = 0, k = 0; h < outputTemp.length; h++) {

                        if (ABC.indexOf(outputTemp[h].toLowerCase()) === -1) {
                            output += outputTemp[h]
                        } else {
                            let a = ABC.indexOf(outputTemp[h].toLowerCase()) + ABC.indexOf(key[k])

                            if (a >= ABC.length) {
                                a -= ABC.length
                            }
                            if (ABC.indexOf(outputTemp[h]) === -1) {
                                output += ABC[a].toUpperCase()
                            } else {
                                output += ABC[a]
                            }
                            k++
                        }
                    }
                }  else {
                    //Дешифруем
                    for (let h = 0, k = 0; h < outputTemp.length; h++) {
                        if (ABC.indexOf(outputTemp[h].toLowerCase()) === -1) {
                            output += outputTemp[h]
                        } else {
                            let a = ABC.indexOf(outputTemp[h].toLowerCase()) + ABC.length - ABC.indexOf(key[k])
                            if (a >= ABC.length) {
                                a -= ABC.length
                            }
                            if (ABC.indexOf(outputTemp[h]) === -1) {
                                output += ABC[a].toUpperCase()
                            } else {
                                output += ABC[a]
                            }
                            k++
                        }
                    }
                }
                this.resultText = output
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