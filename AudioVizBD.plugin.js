/**
 * @name AudioVizBD
 * @version 0.0.5
 * @description Adds an audio visualizer behind the user modal.
 * @authorLink http://cyberfen.eu/discord
 * @donate http://cyberfen.eu/donate
 * @steam http://cyberfen.eu/steam
 * @source https://cyberfen.github.io/audiovizbd/AudioVizBD.plugin.js
 */

var AudioVizBD = (() => {

    return class AudioVizBD {
        // Plugin Info
        getName() {
            return "AudioVizBD";
        }
        getVersion() {
            return "1.0.0";
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
            this
        }

        // Start
        start() {
            setTimeout(() => {
                this.intervals = [];
                this.startVisualizer();
                this.loadStylesheet('https://cyberfen.github.io/audiovizbd/visualizer.css');
            }, 0)
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
        }

        //===========================================//
        //                Own Plugin                 //
        //===========================================//

        loadStylesheet(url) {
            $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
        }

        stopVisualizer() {
            for (const interval of this.intervals) {
                clearInterval(interval);
            }
        }

        startVisualizer() {
            const {
                desktopCapturer
            } = require('electron')
            desktopCapturer.getSources({
                types: ['window', 'screen']
            }).then(async () => {
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
                    bar.classList.add('audioviz-bar')
                    bar.style.height = Math.round(Math.random() * 90) + 5 + 'px'
                    visualizer.appendChild(bar)
                }
                const visualizerGoo = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                visualizerGoo.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
                visualizerGoo.setAttributeNS('http://www.w3.org/2000/version/', 'version', '1.1')
                visualizerGoo.classList.add('audioviz-goo')
                visualizerGoo.innerHTML = `
                <filter id="audioVisualizer">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"></feGaussianBlur>
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="audioVisualizer"></feColorMatrix>
                  <feComposite in="SourceGraphic" in2="audioVisualizer" operator="atop"></feComposite>
                </filter>
              `

                const findElement = setInterval(() => {
                    if (accountContainer) {
                        visualizer = document.querySelector('.audioviz-visualizer')
                    } else {
                        accountContainer = document.querySelector('.panels-j1Uci_ > .container-3baos1:last-child')
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
                    }
                }, 20)
                this.intervals = [style, findElement]
            }).catch(error => {
                console.error('An error occurred getting media sources', error)
            })
        }

    }
})();