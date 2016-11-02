<template>
    <div id="apiKey-input" class='apiKey-input'>

        <div> The API Key you're using is invalid or inexistant </div>

        <input placeholder='enter your api key here'
            v-model='newApiKey'
            v-on:keypress.enter='setNewApiKey()'>

    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'
    import {setApiKey} from '../../common/config.js'

    export default {
        props: {
            global: {
                type: Object,
                default: () => ({})
            }
        },
        data: () => ({
            newApiKey: ''
        }),
        methods: {
            setNewApiKey: function () {
                const newApiKey = this.newApiKey

                if ( newApiKey === '' ) return

                this.newApiKey = ''
                setApiKey( newApiKey )
                ipcRenderer.send('updater-reload')
            }
        }
    }

</script>

<style scoped>

</style>
