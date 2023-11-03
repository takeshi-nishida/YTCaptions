function currentCaption(player) {
    const captionElement = document.querySelector(".captions-text");
    const time = player.getCurrentTime();
    return captionElement ? { time, caption: captionElement.innerText } : null;

}

function setOptions(player){
    const captionId = player.getCaptionWindowContainerId();
    if(document.getElementById(captionId).childElementCount == 0){
      player.toggleSubtitles();
    }
    player.setOption("captions", "track", { "languageCode": "en" });
    player.seekTo(0);
    player.playVideo();
}

window.addEventListener("message", (e) => {
    if(e.data.from == "content.js"){
        console.log("message received at inject.js from content.js");
        const player = document.getElementById('movie_player');

        switch (e.data.type) {
            case "start":
                setOptions(player);
                const timer = setInterval(() => {
                    const info = currentCaption(player);
                    if (info) e.source.postMessage({ from: "inject.js", info }, e.origin);
                    if(player.getPlayerState() != 1) clearInterval(timer);
                }, 1000);
                break;
            case "play":
                player.playVideo();
                break;
            case "pause":
                player.pauseVideo();
                break;
        }
    }
})