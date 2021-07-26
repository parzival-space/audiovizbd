/**
 * @name AudioVizBD
 * @version 2.0.0
 * @description Please use powercord-pspectrum instead: https://github.com/malte-linke/powercord-pspectrum
 * @source https://malte-linke.github.io/audiovizbd/AudioVizBD.plugin.js
 */


//   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   !!                                             !!
//   !!     IMPORTANT: STOP USING THIS PLUGIN!      !!
//   !! THIS PLUGIN IS OUTDATED AND DOES NOT WORK!  !!
//   !!                                             !!
//   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var AudioVizBD = (() => {
  return class AudioVizBD {
    getName() { return "AudioVizBD"; }
    getVersion() { return "2.0.0"; }
    getAuthor() { return "𝓟𝓪𝓻𝔃𝓲𝓿𝓪𝓵"; }
    getDescription() { return "Please use powercord-pspectrum instead:\nhttps://github.com/malte-linke/powercord-pspectrum"; }

    load() {
      if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/malte-linke/audiovizbd/master/AudioVizBD.plugin.js");

      this.hasShown = false;

      // the function name describes what it does
      this.showAnnoyingAlert(false);
    }

    constructor() { }
    getSettingsPanel() { /* here do not show the annoying warning. I am not evil. òwó */ return ""; }
    start() { this.showAnnoyingAlert(true); }
    reload() { this.showAnnoyingAlert(false); }
    stop() { this.showAnnoyingAlert(true); }

    showAnnoyingAlert(ignore) { if (!ignore && !this.hasShown) ZeresPluginLibrary.Modals.showAlertModal("AudioVizBD? Switch to PSpectrum!", "You are still using AudioVizBD?! This plugin doesn't even work anymore.\nIf you really need an audio visualizer for Discord, check out my Powercord plugin:\nhttps://github.com/malte-linke/powercord-pspectrum"); this.hasShown = true; }

    //   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //   !!                                             !!
    //   !!   FUNCTIONS REMOVED DUE TO END OF SUPPORT   !!
    //   !!     USE BETTERDISCORD-PSPECTRUM INSTEAD     !!
    //   !!                                             !!
    //   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  };
})();