<template>
    <div class="loading-screen no-drag"
        v-on:click='unselectChampionCases()'>

        <video class='vid' autoplay='autoplay' loop
            >
            <source src='imgs/loading-screen.webm'>
        </video>

        <div class='line'
            v-if='false'>
            <div class='game-mode'> {{ global.gameData.gameMode }} </div>
            <div class='map-name'> {{ global.gameData.gameMap }} </div>
        </div>

        <div class="loading-content">
            <div class="team-display"
                v-for="(teamCase, teamIndex) of global.gameData.teams">
                    <div class="champion-case"
                        v-for="(championCase, index) of teamCase"
                        v-on:click="pickChampionCase(`${teamIndex}${index}` , $event)"
                        v-bind:class="[selectedChampionCase === `${teamIndex}${index}` ? 'selected' : '']"
                        v-bind:key='index'>

                        <div class="champion-image-holder">
                            <img class="champion-image"
                                :src="championCase.championSplash">
                        </div>

                        <div class="masteries-frame bg-landing">
                            <div class="title">
                                Masteries
                            </div>

                            <div class="content">
                                <div class="masteries-informations"
                                    v-for="masteryType of championCase.masteries">
                                    <img
                                        :src='masteryType.imagePath'>
                                    <div class="number">{{ masteryType.rank }}</div>
                                </div>
                            </div>

                        </div>
                        <div class="main-frame">
                            <div class="spells-container">
                                <div class="spell">
                                    <img class='spell-image'
                                        :src="championCase.spell1Splash">
                                </div>
                                <div class="spell">
                                    <img class='spell-image'
                                        :src="championCase.spell2Splash">
                                </div>
                            </div>

                            <div class="champion-name"> {{ championCase.championInfo.name }} </div>
                            <div class="player-name"> {{ championCase.summonerName }} </div>

                            <div class="league">
                                <img
                                    :src=" `imgs/${championCase.soloQueueStats.tier}_badge.png` ">

                                <div class="division">
                                    {{ championCase.soloQueueStats.tier !== "MASTER" && championCase.soloQueueStats.tier !== "CHALLENGER" ? championCase.soloQueueStats.entries[0].division : '' }}
                                </div>

                                <div class="win-number"> {{ championCase.soloQueueStats.entries[0].wins }} </div>
                                <div class="lose-number"> {{ championCase.soloQueueStats.entries[0].losses }} </div>
                            </div>
                        </div>



                        <div class="runes-frame bg-landing">
                            <div class="title">
                                Runes
                            </div>

                            <div class="content">
                                <div class="runes-informations"
                                    v-for="runeType of championCase.runesRecap"
                                    v-bind:class="getRuneDescription(runeType)">
                                    {{ getRuneDescription(runeType) }}
                                </div>
                            </div>

                        </div>

                    </div>



            </div>
        </div>





        <div class='leave-button no-drag'
            v-on:click='leaveLoading()'>
            leave loading
        </div>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'

    export default {
        props: ['global'],
        data: () => ({
            selectedChampionCase: -1
        }),
        methods: {
            leaveLoading: function () {
                ipcRenderer.send('home-set-home')
                this.global.showLoading = false
            },
            pickChampionCase: function (caseNumber, ev) {
                let championCase = null

                let i = ev.path.length
                for (let i = 0; i < ev.path.length; i++) {
                    if ( championCase === null && ev.path[i].classList.contains('champion-case') )
                        championCase = ev.path[i]
                }

                const boundingRect = championCase.getBoundingClientRect()

                this.selectedChampionCase = caseNumber

                championCase.style.transition = '0s all'
                championCase.style.top = `${boundingRect.top}px`
                championCase.style.left = `${boundingRect.left}px`
                championCase.style.transition = ''

                setTimeout(() => {
                    championCase.style.top = ''
                    championCase.style.left = ''
                }, 4)

                ev.stopPropagation()
            },
            unselectChampionCases: function () {
                this.selectedChampionCase = -1
            },
            getRuneDescription: function (rune) {
                const value = parseFloat(rune.description)
                const runeDescription = rune.description.replace(value, ((value * rune.count * 10)|0) / 10 )
                return runeDescription
            }
        }
    }

</script>

<style scoped>

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;

    background: rgba(250, 250, 250, 0.1);

    box-shadow: 0 0 15px 2px rgba(20, 20, 20, 0.2);
    transition: .4s opacity, .4s transform;
    z-index: var(--main-loading-z);
}

    .loading-screen .vid {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        min-width: 100vw;
        min-height: 100vh;
        z-index: -1;
        background-size: cover;
        -webkit-filter: blur(3px) contrast(1.1);
    }

    .loading-screen .line {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 100%;
        flex-direction: row;
    }

        .loading-screen .game-mode{
            font-size: 18px;
            margin: 8px;
            color: rgba(255, 255, 255, 0.7);
            -webkit-filter: drop-shadow(0 0 3px rgba(20, 20, 20, 0.6));
        }

        .loading-screen .map-name {
            font-size: 18px;
            flex-grow: 1;
            text-align: right;
            margin: 8px;

            color: rgba(255, 255, 255, 0.7);
            -webkit-filter: drop-shadow(0 0 3px rgba(20, 20, 20, 0.6));
        }

    .loading-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        filter: contrast(1.05);
    }

    .loading-screen .team-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        -webkit-app-region: no-drag;
    }

        .loading-screen .team-display {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }

            .team-display + .team-display {
                margin-top: 10vmin;
            }

            .team-display .champion-case {
                display: flex;
                position: relative;
                height: 35vmin;
                width: 20vmin;

                margin: 0 28px;

                box-shadow: 0 0 15px rgba(20, 20, 20, 0.2);
                border: solid 1px var(--main-bg-color);
                transition: 0s all ease-in-out;
                -webkit-app-region: no-drag;
                cursor: pointer;
            }

                .champion-case .main-frame {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    text-align: center;
                    flex-grow: 1;
                }

                .team-display:nth-child(1) .champion-case {
                    box-shadow: 0 0 15px rgba(20, 20, 50, 1);
                }

                .team-display:nth-child(2) .champion-case {
                    box-shadow: 0 0 15px rgba(50, 20, 20, 1);
                }


                .champion-case .champion-image-holder {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;

                    overflow: hidden;
                    z-index: -1;
                }

                .champion-case .champion-image {
                    position: absolute;
                    top: 50%;
                    left: 50%;

                    height: 100%;

                    transform: translate(-50%, -50%) scale(1.2);
                    z-index: -1;
                }

                .champion-case .spells-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    padding-bottom: 8px;
                }

                    .spells-container .spell {
                        width: 5vmin;
                        height: 5vmin;
                        border-radius: 50%;
                        overflow: hidden;
                        box-shadow: 0 0 15px rgba(20, 20, 20, 0.9);
                        border: solid 1px rgb(20, 20, 20);
                    }

                        .spells-container .spell img {
                            height: 100%;
                            width: 100%;
                        }

                .champion-case .player-name {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 1.7vmin;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 1),
                                 0 0 1px rgb(255, 255, 255);
                    overflow: hidden;
                }

                .champion-case .champion-name {
                    color: rgba(220, 220, 220, 0.7);
                    font-size: 2.5vmin;
                    font-weight: 900;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 1),
                                 0 0 1px rgb(255, 255, 255);
                }

                .champion-case .league {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                    .league > img {
                        height: 10vmin;
                        -webkit-filter: drop-shadow(0 0 5px);
                    }

                    .league .division {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translate(-50%, -50%);

                        color: rgba(255, 255, 255, 0.5);
                        font-size: 1.7vmin;
                        text-shadow: 0 0 10px rgba(0, 0, 0, 1),
                                     0 0 1px rgb(255, 255, 255);
                    }

                    .league .lose-number {
                        position: absolute;
                        top: 20%;
                        right: -28%;
                        color: rgba(255, 150, 150, 0.5);
                        font-size: 1.7vmin;
                        text-shadow: 0 0 10px rgba(0, 0, 0, 1),
                                     0 0 1px rgb(255, 200, 200);
                    }

                    .league .win-number {
                        position: absolute;
                        top: 20%;
                        left: -28%;
                        color: rgba(150, 255, 150, 0.5);
                        font-size: 1.7vmin;
                        text-shadow: 0 0 10px rgba(0, 0, 0, 1),
                                     0 0 1px rgb(200, 255, 200);
                    }

                .champion-case .runes-frame, .champion-case .masteries-frame {
                    display: none;
                    max-width: 30%;
                    overflow: hidden;
                }

                .champion-case .masteries-frame .masteries-informations {
                    display: inline-block;
                    position: relative;
                    margin: 8px;
                    height: 50px;
                    width: 50px;
                    box-shadow: 0 0 5px rgba(var(--main-bg-rgb), 0.8);
                }

                    .champion-case .masteries-frame .masteries-informations img {
                        position: relative;
                        height: 100%;
                        width: 100%;
                    }

                    .champion-case .masteries-frame .masteries-informations .number {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        background: rgba(20, 20, 20, 0.9);
                        padding: 3px;
                        width: 30%;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }





    /**
     * Design of the selected champion-case
     * The champion-case should go from its original place in the team displays
     * to the center of the screen and widen to be able to display more informations
     */
    .champion-case.selected {
        position: fixed;
        top: 50%;
        left: 50%;

        flex-direction: row;
        width: 70vw;
        height: 60vh;
        z-index: var(--loading-champion-selected-z);
        transform: translate(-50%, -50%);
        transition: .5s all ease-in-out;
    }

        .champion-case.selected .spells-container {
            justify-content: center;
        }

        .champion-case.selected .league {
            display: none;
        }

        .champion-case.selected .main-frame {
            width: 40%;
        }

        .champion-case.selected .champion-image {
            transform: translate(-50%, -50%) scale(1.0);
        }


        .champion-case.selected .runes-frame {
            display: block;
            flex-grow: 1;
            border-left: solid 1px rgb(45, 37, 23);
            box-shadow: 0px 0 3px rgb(0, 9, 18);
            padding: 8px;
            box-sizing: border-box;
        }

        .champion-case.selected .masteries-frame {
            display: block;
            flex-grow: 1;
            border-right: solid 1px rgb(45, 37, 23);
            box-shadow: 0px 0 3px rgb(0, 9, 18);
            padding: 8px;
            box-sizing: border-box;
        }


    /**
     * Does the coloring of the runes
     */
    .champion-case .runes-frame div[class*="attack speed" i] {
        color: rgba(105, 203, 52, 0.7)
    }

    .champion-case .runes-frame div[class*="ability" i] {
        color: rgba(78, 137, 214, 0.7)
    }

    .champion-case .runes-frame div[class*="magic" i] {
        color: rgba(108, 163, 235, 0.7)
    }

    .champion-case .runes-frame div[class*="damage" i] {
        color: rgba(212, 184, 42, 0.7)
    }

    .champion-case .runes-frame div[class*="armor" i] {
        color: rgba(230, 210, 108, 0.7)
    }

    .champion-case .runes-frame div[class*="Penetration" i] {
        color: rgba(185, 151, 6, 0.7)
    }

    .champion-case .runes-frame div[class*="health" i] {
        color: rgba(218, 64, 64, 0.7)
    }

    .champion-case .runes-frame div[class*="cooldown" i] {
        color: rgba(165, 67, 224, 0.7)
    }

    .champion-case .runes-frame div[class*="mana" i] {
        color: rgba(21, 38, 186, 0.7)
    }

    .champion-case .runes-frame div[class*="steal" i] {
        color: rgba(186, 21, 21, 0.7)
    }





    /**
     * Leave button
     */
    .leave-button {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background: var(--main-bg-lighter-color);
        padding: 8px;
        cursor: pointer;
    }

    .leave-button:hover {
        background: rgba(var(--main-bg-rgb), 0.8);
    }

</style>
