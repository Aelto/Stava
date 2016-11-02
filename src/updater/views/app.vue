<template>
    <div class="global">



        <div
            v-if='showApiKeyModal()'>

            <div> The app needs a <a href='#' v-on:click='openLinkRiotGamesApi()'>Riot Games API</a> to work </div>

            <p><input class='apiKey-input' placeholder='enter your api key here'
                v-model='newApiKey'
                v-on:keypress.enter='setNewApiKey()'>
            </p>

        </div>

        <div
            v-else>{{ message }}</div>

    </div>
</template>

<script>
    import {ipcRenderer, shell} from 'electron'
    import {setApiKey} from '../../common/config.js'

    export default {
        props: ['message', 'askApiKey'],
        data: function () {
            return {
                newApiKey: ''
            }
        },
        methods: {
            showApiKeyModal: function () {

                if ( this.askApiKey === true ) {
                    ipcRenderer.send('updater-focus')
                    return true
                }
                return false

            },
            setNewApiKey: function () {
                const newApiKey = this.newApiKey

                if ( newApiKey === '' ) return

                this.newApiKey = ''
                setApiKey( newApiKey )
                ipcRenderer.send('updater-reload')
            },
            openLinkRiotGamesApi: function () {
                shell.openExternal( 'https://developer.riotgames.com/docs/api-keys' )
            }
        }
    }

</script>

<style scoped>

    .global {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;

        width: 100vw;
        height: 100vh;

        font-size: 16px;
    }



</style>
