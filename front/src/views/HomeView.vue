<script setup lang="ts">
import router from '@/router'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const baseURL = 'http://localhost:8080/api/'
type Data = {
    id: number
    user_id: number
    task: string
}
type Form = {
    task: string
}
type UpdateForm = {
    taskId: number | null
    task: string
}

const tasks = ref<Data[]>([])
const isAuth = ref<boolean>()
const userName = ref<string | null>('未認証')
const form = ref<Form>({ task: '' })
const updateForm = ref<UpdateForm>({ taskId: null, task: '' })
const isActiveUpdateForm = ref<boolean>(false)
const isOpenUserMenu = ref<boolean>(false)

onMounted(() => {
    getTasks()
})

const getTasks = async () => {
    await axios
        .get(baseURL, { withCredentials: true })
        .then((res) => {
            if (res.status === 200) {
                if (res.data.isAuth) {
                    isAuth.value = res.data.isAuth
                    userName.value = res.data.userName
                    tasks.value = []
                    res.data.data.forEach((el: Data): void => {
                        tasks.value.push(el)
                    })
                } else {
                    isAuth.value = res.data.isAuth
                    userName.value = '未認証'
                    console.log('未認証')
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

const addTask = async () => {
    await axios
        .post(baseURL + 'task/add', form.value, { withCredentials: true })
        .then((res) => {
            if (res.data.rtnFlg) {
                tasks.value = []
                res.data.data.forEach((el: Data): void => {
                    tasks.value.push(el)
                })
                form.value.task = ''
            }
        })
        .catch((err) => {
            console.log(err)
            console.log(`APIエラー：URL：${baseURL}task/add`)
        })
}

const showModal = (id: number, task: string) => {
    isActiveUpdateForm.value = true
    updateForm.value.taskId = id
    updateForm.value.task = task
}

const updateTask = async () => {
    await axios
        .post(baseURL + 'task/edit', updateForm.value, { withCredentials: true })
        .then((res) => {
            getTasks()
            isActiveUpdateForm.value = false
            updateForm.value.task = ''
        })
        .catch((err) => {
            console.log(err)
            console.log(`APIエラー：URL：${baseURL}task/edit`)
        })
}

const deleteTask = async (id: number, task: string) => {
    await axios
        .post(baseURL + 'task/delete', { taskId: id, task: task }, { withCredentials: true })
        .then((res) => {
            console.log(res.data)
            getTasks()
        })
        .catch((err) => {
            console.log(err)
        })
}

const signOut = async () => {
    await axios
        .get(baseURL + '/signout', { withCredentials: true })
        .then(async (res) => {
            userName.value = '未認証'
            getTasks()
        })
        .catch((err) => {
            console.log(`APIエラー：URL：${baseURL}signout`)
            console.log(err)
        })
}

</script>

<template>
    <div class="home">
        <div class="home__cnt1">
            <div class="dummy"></div>
            <h1 class="home__ttl">vue3 + Express</h1>
            <div
                class="home__user"
                :class="{ open: isOpenUserMenu }"
                @click="isOpenUserMenu = !isOpenUserMenu"
            >
                <p class="home__username">{{ userName }}</p>
                <button class="home__btn--signout" @click="signOut">SignOut</button>
            </div>
        </div>
        <div v-if="isAuth" class="home__authed">
            <div class="home__cnt">
                <div class="home__cnt3">
                    <ul class="list">
                        <li v-for="(task, idx) of tasks" :key="idx">
                            <span>{{ task.task }}</span>
                            <div class="list__buttons">
                                <button @click="showModal(task.id, task.task)">編集</button>
                                <button @click="deleteTask(task.id, task.task)">削除</button>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="home__cnt2">
                    <form @submit.prevent="addTask" class="form">
                        <div class="form__cnt">
                            <input v-model="form.task" id="task" type="text" required />
                        </div>
                        <button class="form__btn--add" type="submit"></button>
                    </form>
                </div>

                <Teleport to="body">
                    <div class="modal" v-if="isActiveUpdateForm">
                        <div class="modal__overlay" @click="isActiveUpdateForm = false"></div>
                        <div class="modal__container">
                            <form class="modal__form" @submit.prevent="updateTask">
                                <label for="update">タスクの更新</label>
                                <input id="update" type="text" v-model="updateForm.task" />
                                <input class="form__submit" type="submit" value="更新" />
                                <input
                                    class="form__cancel"
                                    @click="isActiveUpdateForm = false"
                                    type="button"
                                    value="キャンセル"
                                />
                            </form>
                        </div>
                    </div>
                </Teleport>
            </div>
        </div>

        <div v-if="!isAuth" class="home__cta">
            <p class="home__msg">ユーザー認証を完了してください</p>
            <div class="home__links">
                <RouterLink class="home__link" to="/signin">SignIn</RouterLink>
                <span>or</span>
                <RouterLink class="home__link" to="/signup">SignUp</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home {
    &__cnt {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 0 calc(50% - min(40vw, 225px));
    }
    &__cnt1 {
        display: flex;
        gap: 1rem;
        align-items: baseline;
        border-bottom: 0.5px solid #000;
        justify-content: space-around;
        padding: 0.75em 2em;
    }
    &__cnt2 {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .form {
            display: flex;
            input[type='text'] {
                width: calc(200px - 0.5em - 4px);
                padding: 0.25em 0.25em;
                border: 0.5px solid #000;
                border-right: 0.25px solid #00000080;
            }
            &__cnt {
                display: flex;
                flex-direction: column;
            }
            &__btn--add {
                padding: 0.125em 0.75em;
                letter-spacing: 0.15em;
                width: 40px;
                position: relative;
                border: 0.5px solid #000;
                border-left: 0.25px solid #00000080;
                cursor: pointer;
                background: #bfffdd;
                transition: all 0.375s;
                &:hover {
                    background: #1ef385;
                }
                &::before,
                &::after {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    background: #000;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                &::before {
                    width: 50%;
                    height: 1px;
                }
                &::after {
                    height: 75%;
                    width: 1px;
                }
            }
        }
    }
    &__cnt3 {
        display: flex;
        justify-content: center;
        margin: 50px 0 0 0;
    }
    &__user {
        position: relative;
        cursor: pointer;
        padding: 0.5em 0;
        &.open {
            .home__btn--signout {
                transform: translateX(5em);
                opacity: 1;
                visibility: visible;
            }
        }
    }
    &__btn--signout {
        background: inherit;
        border: none;
        cursor: pointer;
        position: absolute;
        top: 30%;
        right: 0;
        opacity: 0;
        transition:
            visibility 0.25s,
            transform 0.5s,
            opacity 0.5s;
        visibility: hidden;
        color: #bfbfbf;
        &:hover {
            color: red;
        }
    }
    &__ttl {
        font-size: 1.5rem;
        margin-left: 4rem;
    }
    &__username {
        margin: 0;
        position: relative;
        padding: 0 0 0 2rem;
        &::before {
            content: url('@/assets/img/human-img.svg');
            display: inline-block;
            width: 25px;
            position: absolute;
            bottom: -10%;
            left: 0;
        }
    }
    &__heading {
        margin: 0;
    }
    &__cta {
        margin: 20vh 0 0 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .home__msg {
            color: red;
            font-weight: bolder;
        }
    }
    &__links {
        display: flex;
        gap: 0.5em;
    }
    &__link {
        letter-spacing: 0.1em;
        color: #bfbfbf;
        text-decoration: none;
        font-weight: bolder;
        position: relative;
        &::before {
            content: '';
            display: inline-block;
            position: absolute;
            height: 1.5px;
            width: 0%;
            background: #bfbfbf;
            bottom: 5%;
            transition: all 0.25s;
        }
        &:hover {
            &::before {
                width: 100%;
            }
        }
    }
}

.list {
    margin: 0;
    padding: 0;
    li {
        margin: 0 0 0.5em 0;
        position: relative;
        width: min(80vw, 450px);
        &::before {
            content: '';
            display: inline-block;
            position: absolute;
            bottom: 0;
            height: 0.5px;
            width: 100%;
            background: #000;
        }
        button {
            cursor: pointer;
            font-size: 0.75rem;
            border: none;
            background: rgb(237, 225, 225);
            letter-spacing: 0.125em;
            color: #ff0000;
            opacity: 0.5;
            transition: opacity 0.25s;
            &:hover {
                opacity: 1;
            }
        }
    }
    &__buttons {
        position: absolute;
        display: inline-block;
        bottom: 0;
        right: 0;
    }
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 1;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    &__container {
        width: 450px;
        padding: 20px;
        background: #fff;
        border: 0.5px solid #000;
        transform: translateY(-80%);
        display: inline-block;
    }
    &__form {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }
    &__overlay {
        position: fixed;
        width: 100%;
        height: 100%;
    }
}
</style>
