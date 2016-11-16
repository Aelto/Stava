<template>
    <div class="global background">

        <div class="login-menu">

            <div class="logo"></div>

            <div class="title">Spectate a game</div>

            <div class="group">
                <div class="informations">Which summoner to follow ?</div>
                <input type='text'
                    v-model='global.summonerName'
                    >
            </div>

            <div class="group">
                <div class="informations">Your Riot Games API key</div>
                <input type='password'
                    v-model='global.apiKey'>
            </div>

            <div class="group">
                <div class="informations">Region</div>
                <select class="no-drag" name=""
                    v-model='global.gameServer'>
                    <option value='euw'>Europe West</option>
                    <option value='na'>North America</option>
                </select>
            </div>

            <div class="group">
                <div class="informations">Spectate A friend</div>
                <input type="checkbox" name="name" value=""
                    v-model='global.spectateAFriend'>
            </div>

            <button type="button" name="button" class='no-drag'
                v-on:click="manageSpectateInterval()"> {{ global.launchButtonText }} </button>

        </div>

        <div class="content">
            <div class="title">
                Stava,
            </div>
            <div class="message">
                Your League Of Legends
                <span>Games analyst.</span>
            </div>
        </div>

        <comp-loading
            v-if='global.showLoading === true'
            :global='global'>
        </comp-loading>

        <comp-settings
            v-if='global.showSettingsFrame === true'
            :global="global">
        </comp-settings>

        <div class="controls drag-area">
            <div class="fa fa-minus no-drag"
                v-on:click='sendMinimizeCall()'
            ></div>
            <div class="fa fa-gear no-drag"
                v-on:click='global.showSettingsFrame = !global.showSettingsFrame'
            ></div>
            <div class="fa fa-times no-drag"
                v-on:click='sendCloseCall()'
            ></div>
        </div>

    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'

    import compLoading from './loading.vue'
    import compSettings from './framesettings.vue'


    export default {
        props: ['global'],
        components: {
            'comp-loading': compLoading,
            'comp-settings': compSettings
        },
        methods: {
            sendCloseCall: function () {
                ipcRenderer.send('home-close')
            },
            sendMinimizeCall: function () {
                ipcRenderer.send('home-minimize')
            },
            manageSpectateInterval: function () {

                if ( this.global.launchButtonText === 'launch' )
                    this.global.startInterval( this.global )
                else if ( this.global.launchButtonText === 'cancel' )
                    this.global.cancelInterval()

            }
        }
    }

</script>

<style scoped>

.login-menu {
    display: flex;
	flex-direction: column;
	box-shadow: 0 0 12px 1px var(--main-bg-color);
	border-left: solid 1px var(--grey-very-light-color);
	/*background: rgba(var(--main-bg-rgb), 1);*/
    padding: 0 18px;
    min-width: 20%;
    max-width: 230px;
	z-index: var(--main-menu-z);
}

    .login-menu .logo {
        margin: 16px;
        height: 64px;
        background-size: 100% 100%;
    }

    .login-menu .title {
        font-family: 'Montserrat';
        font-size: 1.1rem;
        margin-bottom: 16px;
    }

    .login-menu .group {
        display: block;
    }

    .login-menu .group + .group {
        margin-top: 16px;
    }

        .login-menu .group .informations {
            font-size: 14px;
            margin-bottom: 4px;
        }

        .login-menu .group input, .login-menu .group select {
            outline: solid 1px rgb(100, 93, 74);
            padding: 4px;
            border: none;
            background: var(--main-bg-color);
            text-align: left;
            color: var(--soft-white-color);
            font-size: 14px;
        }

        .login-menu .group select {
            outline: none;
            cursor: pointer;
            color: rgb(100, 93, 74);
        }

        .login-menu .group input[type="checkbox"] {
            cursor: pointer;
        }

    .login-menu button {
        margin-top: 64px;
        background: rgba(30, 30, 35, 0.9);
        outline: solid 3px rgb(100, 93, 74);
        border: none;
        padding: 8px;
        color: var(--soft-white-color);
        cursor: pointer;
    }

    .login-menu button:hover {
        background: rgba(40, 40, 45, 0.9);
    }

    .login-menu button:active {
        background: rgba(40, 40, 45, 0.3);
    }


.content {
	position: relative;
	flex-grow: 1;
	padding: 32px 0 32px 32px;
	z-index: var(--main-content-z);
}

    .content .title {
        color: var(--blue-light-color);
        font-family: Montserrat;
        font-size: 32px;
    }

    .message {
        color: var(--main-bg-color);
        font-size: 18px;
        font-weight: 600;
    }

        .message span {
            display: block;
        }

.controls {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 0;
    z-index: var(--main-handlebar-z);
}

    .controls div {
        padding: 10px;
        color: rgb(100, 93, 74);
        cursor: pointer;
        z-index: var(--main-handlebar-z)
    }

    .controls div:hover {
        color: rgb(120, 113, 95);
        background: var(--grey-very-light-color)
    }

</style>
