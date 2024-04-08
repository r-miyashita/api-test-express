<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import { RouterLink } from 'vue-router'

type Form = {
    name: string | null
    password: string | null
}

const baseURL = 'http://localhost:8080/api/'
const form = ref<Form>({
    name: null,
    password: null
})
const isSucessLoin = ref<boolean>(true)

const signIn = async () => {
    await axios
        .post(baseURL + 'signin', form.value)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.rtnFlg) {
                    console.log(res.data.data)

                    router.push('/')
                } else {
                    isSucessLoin.value = false;
                    console.log('ログイン失敗')
                    console.log(res.data)
                }
            }
        })
        .catch((err) => {
            console.log(`APIエラー：URL：${baseURL}signin`)
            console.log(err)
        })
}
</script>

<template>
    <RouterLink to="/" class="logo"><h1>vue3 + Express</h1></RouterLink>
    <div class="login">
        <h1 class="login__ttl">SignIn</h1>
        <form @submit.prevent="signIn" action="" class="form login__form">
            <div class="form__cnt">
                <label for="name">name</label>
                <input v-model="form.name" type="text" id="name" required />
            </div>
            <div class="form__cnt">
                <label for="password">password</label>
                <input v-model="form.password" type="password" id="password" required />
            </div>
            <input class="form__btn" type="submit" value="SUBMIT" />
        </form>
    </div>
    <p v-if="!isSucessLoin" class="msg--err">ログインに失敗しました。</p>
</template>

<style scoped lang="scss">
.login {
    align-items: center;
    border: 0.5px solid #000;
    display: flex;
    flex-direction: column;
    padding: 6rem 1rem 2rem;
    gap: 1rem;
    width: min(80vw, 400px);
    margin: 10vh auto 0;
    position: relative;
    &__ttl {
        margin: 0;
        position: absolute;
        top: 2rem;
        left: 5%;
        font-size: 1.5rem;
        width: 90%;
        letter-spacing: 0.1em;
        &::before {
            content: '';
            height: 0.5px;
            display: inline-block;
            background: #000;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }
}
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    &__btn {
        padding: 0.25em 0.75em;
        letter-spacing: 0.15em;
        margin: 1rem 0 0 0;
    }
    &__cnt {
        display: flex;
        flex-direction: column;
        gap: 0.125em;
        width: 100%;
        input[type='text'],
        input[type='password'] {
            width: calc(200px - 0.5em - 4px);
            padding: 0.25em 0.25em;
        }
    }
}

.logo {
    text-decoration: none;
    display: inline-block;
    margin: 1rem 2rem 0;
    h1 {
        color: #000;
        font-size: 1.5rem;
    }
}

.msg--err {
        color: red;
        text-align: center;
    }
</style>
