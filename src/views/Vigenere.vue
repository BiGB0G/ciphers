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
                // console.log('start');
                // console.log(this.sourceText)
                // console.log(this.getAlphabet())
                // // console.log(this.key)
                // console.log(this.resultText)
                // console.log(this.encode) //true - шифровать
                //Массив символов ключа
                //Ключ приводим к нижнему регистру, так надо, дальше объясняется
                const key = this.key.toLowerCase().split('')
                //Массив символов исходного текста
                const sourceText = this.sourceText.split('')
                //Массив алфавита
                const ABC = this.getAlphabet().split('')



                if (key.length === 0) {
                    key.push(ABC[0])
                }

                let keyController = 0



                //Тут собираю то, что буду выводить
                let output = ""
                //Тут собираю то, что буду шифровать (чтобы знать длинну и брать нужный символ ключа
                let templateStorage = ""
                //Сложить индекс исходной буквы и индекс буквы-ключа и если он меньше 33 (кол-во индексов
                //в массиве алфавита), то этот индекс "зашифрованная буква" иначе от суммы отнять 33. Добавить условия на uppercase lowercase
                //потому что у нас в массиве всё в перемешку (тут от суммы нужно будет отнимать 66, а проверять
                // на то чтобы было меньше 66)


                //Перебираем введенную строку в поисках соответствия с массивом алфавита или пробелом
                for (let i = 0; i < sourceText.length; i++) {
                    if (ABC.indexOf(sourceText[i]) === -1) {    //При выполнении условия - символа нет в алфавите
                        if (sourceText[i] === " ") {            //При выполнении условия - символ пробел
                            output += sourceText[i]    //Добавляем пробел к выводу
                        } else {
                            //Тут можно написать инструкции на случай, когда вводят не букву алфавита и не пробел
                            //Например выводить ошибку. Или не выводить вообще ничего. Символ всё равно не попадет в стек вывода

                        }
                    } else {    //Выполняется если символ есть в алфавите
                        //Выкидываю символ в templateStorage, чтобы в дальшейшем брать нужный индекс ключа
                        templateStorage += sourceText[i]


                        //Шифрование
                        if (templateStorage.length <= key.length) {                  //Если ключ длиннее или равен исходному тексту
                            if (sourceText[i].toLowerCase() === sourceText[i]) {    //И если веденный символ в нижнем регистре
                                //то складываем индексы букв из алфавита
                                let a = ABC.indexOf(sourceText[i]) + ABC.indexOf(key[templateStorage.length - 1])
                                if (a < ABC.length/2) { //Если сумма индексов меньше чем длинна массива (букв в нижнем регистре)
                                    output += ABC[a] //выводим зашифрованную букву по индексу a
                                } else {    //Если сумма индексов больше... (максимум может быть 32 + 32)
                                    a -= ABC.length/2
                                    output += ABC[a]
                                }
                            } else {    //Введенный символ в верхнем регистре
                                let a = ABC.indexOf(sourceText[i]) + ABC.indexOf(key[templateStorage.length - 1]) + ABC.length/2
                                if (a < ABC.length) { //Если сумма индексов меньше чем длинна массива (букв в верхнем! (33-35) регистре)
                                    output += ABC[a] //выводим зашифрованную букву по индексу a
                                } else {    //Если сумма индексов больше...
                                    a -= ABC.length
                                    output += ABC[a]
                                }
                            }
                        } else if (templateStorage.length > key.length) {    //Если ключ меньше исходного текста
                            if (sourceText[i].toLowerCase() === sourceText[i]) {

                                let a = ABC.indexOf(sourceText[i]) + ABC.indexOf(key[keyController])
                                if (keyController === key.length - 1) {
                                    keyController = 0
                                } else {
                                    keyController++
                                }
                                if (a < ABC.length/2) {
                                    output += ABC[a]
                                } else {
                                    a -= ABC.length/2
                                    output += ABC[a]
                                }

                            } else {
                                let a = ABC.indexOf(sourceText[i]) + ABC.indexOf(key[keyController]) + ABC.length/2
                                if (keyController === key.length - 1) {
                                    keyController = 0
                                } else {
                                    keyController++
                                }
                                if (a < ABC.length) {
                                    output += ABC[a]
                                } else {
                                    a -= ABC.length
                                    output += ABC[a]
                                }
                            }
                        }

                        // 10    templateStorage    -1  3   4   5   6
                        // 3     key                    3   3   3   3
                        //                              0   1   2   3

                        // 1 key                        1   1   1   1
                        //                              3   4   5   6
                        // 0 1 2 3 4 5 6 7 8 9
                        // 0 1 2 0 1 2 0 1 2 0
                        //
                        //
                    }
                }





                this.resultText = output















                // if(this.sourceText === ''){
                //     return;
                // }
                // if(
                //     this.alphabet.valueSelect === '' ||
                //     (this.alphabet.valueSelect === 'manually' && this.alphabet.value === '')
                // )
                //     return;
                // if(this.key === ''){
                //     this.hideError();
                //     return;
                // }
                //
                // let alphabet = this.getAlphabet();
                // if (!this.validateAlphabet(alphabet, this.key)){
                //     this.showError();
                //     return null;
                // } else {
                //     this.hideError();
                // }
                // // let alphabet = this.getAlphabet();
                // this.keyTmp = this.key;
                //
                // if (this.sourceText.length > this.keyTmp.length) {
                //     this.addSymbolsToKey();
                // } else
                //     if (this.sourceText.length < this.keyTmp.length){
                //         this.resultText = '';
                //         return;
                //     }
                //
                // for(let i = 0; i < this.sourceText.length; ++i){
                //     if (this.sourceText[i] === ' ')
                //         continue;
                //
                //     let index = (alphabet.indexOf(this.sourceText[i]) + alphabet.indexOf(this.keyTmp[i])) % alphabet.length;
                //
                //     this.resultText += alphabet[index];
                // }
            },
            // addSymbolsToKey: function () {
            //     let tmp = this.sourceText.length / this.keyTmp.length - 1;
            //     let tmpKey = this.keyTmp;
            //     for(let i = 0; i < tmp; ++i){
            //         this.keyTmp += tmpKey;
            //     }
            //     let restChar = this.sourceText.length % this.keyTmp.length;
            //     for(let i = 0; i < restChar; ++i){
            //         this.keyTmp += this.keyTmp[i];
            //     }
            // },
            // validateAlphabet: function (alphabet, key) {
            //     if(alphabet.length !== key.length)
            //         return false;
            //     for(let i = 0; i < alphabet.length; ++i){
            //         if(key.indexOf(alphabet[i]) === -1)
            //             return false;
            //     }
            //     return true;
            // },
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