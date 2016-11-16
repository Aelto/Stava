<template>
    <div class="object no-drag settings">

        <div class="frame">

            <div class="title">Stava / <span>Settings</span></div>

            <div class="group">
                <div class="informations">Path to your League of Legends folder</div>
                <input type="text" name="name" value=""
                    v-model='global.pathToLeagueFolder'
                    placeholder='ex.: C:\Program Files\Riot Games\League Of Legends\'>
            </div>

            <div class="group">
                <div class="informations">Open Stava appdata in file explorer.</div>
                <button
                    v-on:click='openUserData()'>
                    Open AppData
                </button>
            </div>


            <div class="center">
                <button class='done-buton'
                    v-on:click="global.showSettingsFrame = false">done</button>
            </div>
        </div>

    </div>
</template>

<script>
    import {setApiKey, setGameServer} from '../../common/config.js'
    import {openExplorer} from '../../common/userdata.js'

    export default {
        props: ['global'],
        methods: {
            clearAppData: function () {

            },
            openUserData: function () {
                openExplorer()
            }
        }
    }

</script>

<style scoped>

.object {
    position: absolute;;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5% 15%;
    box-sizing: border-box;
    background: var(--main-bg-lighter-color);
    z-index: var(--main-loading-z);
}

    .frame {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        /*background: rgb(var(--main-bg-rgb));*/
        border: solid 2px rgb(93, 71, 30);
        box-shadow: inset 0 0 2px rgba(20, 20, 20, 0.2);
        text-align: left;
        padding: 8px;
    }

        .frame .title {
            padding: 12px;
            margin-bottom: 12px;
            border-bottom: solid 1px rgb(120, 113, 95);
            font-weight: bolder;
            font-size: 18px;
            filter: contrast(0.8);
        }

            .title > span {
                opacity: 1;
            }

    .frame .group {
        display: block;
        margin-left: 2rem;
    }

    .frame .group + .group {
        margin-top: 16px;
    }

        .frame .group .informations {
            font-size: 14px;
            margin-bottom: 4px;
        }

        .frame .group input, .frame .group select {
            outline: solid 1px rgb(93, 71, 30);
            padding: 8px;
            border: none;
            background: var(--main-bg-color);
            text-align: left;
            color: var(--soft-white-color);
            font-size: 14px;
            min-width: 60%;
        }

        .frame .group select {
            outline: none;
            cursor: pointer;
            color: rgb(100, 93, 74);
        }

        .frame .group input[type="checkbox"] {
            cursor: pointer;
        }

        .frame .group span {
            color: var(--blue-red-color)
        }

    .frame button {
        background: rgba(30, 30, 35, 0.9);
        outline: solid 3px rgb(100, 93, 74);
        border: none;
        padding: 8px;
        color: var(--soft-white-color);
        cursor: pointer;
    }

    .frame .done-button {
        margin-top: 64px;
    }

    .frame button:hover {
        background: rgba(40, 40, 45, 0.9);
    }

    .frame button:active {
        background: rgba(20, 20, 25, 0.9);
    }

    .center {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex-grow: 1;
    }

        .center button {
            display: inline-block;
            margin: 0 auto;
        }


</style>
