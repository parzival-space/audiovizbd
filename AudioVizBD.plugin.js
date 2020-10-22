/**
 * @name AudioVizBD
 * @version 1.0.7
 * @description Adds an audio visualizer behind the user modal.
 * @authorLink http://cyberfen.eu/discord
 * @donate http://cyberfen.eu/donate
 * @source https://cyberfen.github.io/audiovizbd/AudioVizBD.plugin.js
 */

var AudioVizBD = (() => {

    return class AudioVizBD {
        // Plugin Info
        getName() {
            return "AudioVizBD";
        }
        getVersion() {
            return "1.0.7";
        }
        getAuthor() {
            return "𝓟𝓪𝓻𝔃𝓲𝓿𝓪𝓵";
        }
        getDescription() {
            return "Adds an audio visualizer behind the user modal."
        }

        // Constructor
        constructor() {}

        // Load Plugin
        load() {
            if (BdApi.getData(this.getName(), "colorCode") == undefined) BdApi.setData(this.getName(), "colorCode", "#7289da");
            this.ColorCode = BdApi.getData(this.getName(), "colorCode");

            if (BdApi.getData(this.getName(), "hasShownChangelog") != true) {
                ZeresPluginLibrary.Modals.showChangelogModal(this.getName(), this.getVersion(), Changelog, "View [GitHub Repo](https://github.com/dev-parzival/audiovizbd)");
                BdApi.setData(this.getName(), "hasShownChangelog", true)
            }
        }

        // Settings
        getSettingsPanel() {
            let settings = document.createElement("div");
            settings.style.padding = "10px";

            let title = document.createElement("h1");
            title.innerText = this.getName();
            settings.appendChild(title)

            settings.appendChild(new ZeresPluginLibrary.Settings.ColorPicker("Color", "Can be overwritten by themes.", BdApi.getData(this.getName(), "colorCode"), (color) => {
                BdApi.setData(this.getName(), "colorCode", color);
                this.ColorCode = color;
            }).getElement());

            return settings;
        }

        // Start
        start() {
            if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing", `The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://dev-parzival.github.io/audiovizbd/AudioVizBD.plugin.js");

            this.intervals = [];
            this.startVisualizer();
            this.loadStylesheet('https://dev-parzival.github.io/audiovizbd/visualizer.css');
        }

        // Reload
        reload() {
            this.stopVisualizer();
            this.startVisualizer();
        }

        // Stop
        stop() {
            for (const interval of this.intervals) {
                clearInterval(interval);
            }
            let visualizer = document.querySelector('.audioviz-visualizer');
            if (visualizer) visualizer.remove();
        }

        //===========================================//

        loadStylesheet(url) {
            var loader = document.createElement("link");
            loader.rel = "stylesheet";
            loader.href = url;
            document.getElementsByTagName("head")[0].appendChild(loader);
        }

        stopVisualizer() {
            for (const interval of this.intervals) {
                clearInterval(interval);
            }
            for (const Goo of document.querySelectorAll('.audioviz-visualizer')) {
                Goo.remove();
            }
        }

        startVisualizer() {
            const {
                desktopCapturer
            } = require('electron')
            desktopCapturer.getSources({
                types: ['window', 'screen']
            }).then(async sources => {
                // fixed issue #1 https://github.com/cyberfen/audiovizbd/issues/1
                for (const source of sources) {
                    if (source.name === `${document.title} - Discord`) {

                        const stream = await navigator.mediaDevices.getUserMedia({
                            audio: {
                                mandatory: {
                                    chromeMediaSource: 'desktop'
                                }
                            },
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop'
                                }
                            }
                        }).catch((err) => {
                            ZeresPluginLibrary.Modals.showConfirmationModal(this.getName() + " - Oops...",
                            "Something didnt work as expected:<br>**" + err + "**\n\nIf you see this message the first time,\n try to reload your discord.\n\nIf the problem still persists, please open an issue: https://github.com/cyberfen/audiovizbd/issues",
                            {
                                danger: true,
                                confirmText: "Reload",
                                cancelText: "Ignore",
                                onConfirm: function() {DiscordNative.app.relaunch();},
                                onCancel: function() {}
                            });
                        })
        
                        const audioCtx = new AudioContext()
                        const audio = audioCtx.createMediaStreamSource(stream)
                        const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
                        const barCount = 25
        
                        const analyser = audioCtx.createAnalyser()
                        audio.connect(analyser)
                        analyser.fftSize = 1024
                        let accountContainer
                        let visualizer = document.createElement('div')
                        visualizer.classList.add('audioviz-visualizer')
                        for (let i = 0; i < barCount; i++) {
                            let bar = document.createElement('div')
                            bar.classList.add('audioVisualizer')
                            bar.style.height = Math.round(Math.random() * 90) + 5 + 'px'
                            visualizer.appendChild(bar)
                        }
                        const visualizerGoo = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                        visualizerGoo.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
                        visualizerGoo.setAttributeNS('http://www.w3.org/2000/version/', 'version', '1.1')
                        visualizerGoo.classList.add('audioviz-goo')
                        visualizerGoo.innerHTML = `
                        <filter id="audiovizGoo">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"></feGaussianBlur>
                          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="audiovizGoo"></feColorMatrix>
                          <feComposite in="SourceGraphic" in2="audiovizGoo" operator="atop">e</feComposite>
                        </filter>
                      `
        
                        const findElement = setInterval(() => {
                            if (accountContainer) {
                                visualizer = document.querySelector('.audioviz-visualizer');
                            } else {
                                accountContainer = document.getElementsByClassName(BdApi.findModuleByProps('downloadProgressCircle', 'panels').panels)[0].lastElementChild;
                                if (accountContainer) {
                                    accountContainer.prepend(visualizer)
                                    accountContainer.prepend(visualizerGoo)
                                }
                            }
                        }, 1000)
        
                        const style = setInterval(() => {
                            if (!visualizer) return
                            const bufferLength = analyser.frequencyBinCount
                            const dataArray = new Uint8Array(bufferLength)
                            analyser.getByteFrequencyData(dataArray)
        
                            for (let i = 0; i < barCount; i++) {
                                const y = dataArray[i * 2]
                                const height = easeInOutCubic(Math.min(1, y / 255)) * 100 + 50
                                const bar = visualizer.children[i]
                                bar.style.height = height + '%'
                                if (bar.style.backgroundColor != this.ColorCode) {
                                    bar.style.backgroundColor = this.ColorCode;
                                }
                            }
                        }, 20)
                        this.intervals = [style, findElement]

                    }
                }
                
            }).catch(error => {
                console.error('An error occurred getting media sources', error)
            })
        }
    }
})();

const Changelog = [
    {
        title: "Fixed",
        type: "improved",
        items: [
            "updated style urls thanks to userXinos"
        ]
    }
]
