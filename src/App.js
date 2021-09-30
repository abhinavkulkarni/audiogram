import React, {useState} from "react";
import './App.css';
import Wave from "./lib";


function App() {
    const [state, setState] = useState('INIT');
    const [props, setProps] = useState({label: 'Load audio'});
    let [wave] = useState(new Wave());

    const changeState = (state) => {
        const states = ["INIT", "AUDIO_LOADED", "START_TS_SELECTED", "END_TS_SELECTED", "WAVEFORM_GENERATED", "END"];
        let index = states.indexOf(state);
        if (index < 0)
            index = 0
        else if (index >= states.length)
            index = states.length - 1;
        else
            index += 1;
        return states[index];
    }

    const callback = () => {
        let nextStateLabel = 'Load audio';
        let startTs = props.startTs || 0;
        let endTs = props.endTs || 0;
        let audioSrc = props.audioSrc;

        const stateAfterClick = changeState(state);

        if (stateAfterClick === 'AUDIO_LOADED') {
            nextStateLabel = 'Select start timestamp'
            // audioSrc = 'https://traffic.megaphone.fm/MERE7176906291.mp3?updated=1632752564'
            // audioSrc = 'https://dts.podtrac.com/redirect.mp3/pdst.fm/e/chrt.fm/track/9EE2G/rss.art19.com/episodes/1cbd6342-60d2-44c4-aad2-c14721a7c84a.mp3'
            audioSrc = '1cbd6342-60d2-44c4-aad2-c14721a7c84a.mp3'
        } else if (stateAfterClick === 'START_TS_SELECTED') {
            startTs = document.getElementById('audio').currentTime;
            nextStateLabel = 'Select end timestamp'
        } else if (stateAfterClick === 'END_TS_SELECTED') {
            endTs = document.getElementById('audio').currentTime;
            endTs = Math.max(startTs, endTs);
            nextStateLabel = 'Generate waveform'
        } else if (stateAfterClick === 'WAVEFORM_GENERATED' || stateAfterClick === 'END') {
            let audio = document.getElementById("audio");
            audio.pause();
            audio.currentTime = startTs;
            let loop = setInterval(function () {
                if (audio.currentTime >= endTs) {
                    audio.pause();
                    mediaRecorder.stop();
                    clearInterval(loop);
                }
            }, 100);

            const canvas = document.getElementById("canvas");
            const video = document.getElementById('video');
            // const cStreamFn = canvas.captureStream || canvas.mozCaptureStream;
            const cStream = canvas.captureStream();
            // const aStreamFn = audio.captureStream || audio.mozCaptureStream
            const aStream = audio.captureStream();
            cStream.addTrack(aStream.getAudioTracks()[0]);

            const options = {
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
                mimeType: 'video/webm'
            }

            const mediaRecorder = new MediaRecorder(cStream, options);
            let chunks = [];
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };

            mediaRecorder.onstop = function (e) {
                const blob = new Blob(chunks, {'type': 'video/webm'}); // other types are available such as 'video/webm' for instance, see the doc for more info
                chunks = [];
                video.src = URL.createObjectURL(blob);
            };

            video.autoplay = true;
            video.muted = true;

            const button = document.getElementById("button");
            button.remove();

            audio.play();
            mediaRecorder.start();
        }

        let _props = {label: nextStateLabel, audioSrc, startTs, endTs};
        Object.keys(_props).forEach(key => _props[key] === undefined && delete _props[key])
        setState(stateAfterClick);
        setProps(_props);
    }

    const button = <button id="button" style={{width: "300px", height: "30px"}}
                           onClick={callback}>{props.label}</button>
    const eventListener = () => wave.fromElement("audio", "canvas", {type: "wave"})
    const audio = props.audioSrc ?
        <audio id="audio" controls={"controls"} style={{width: "300px"}} crossOrigin={"anonymous"}
               onCanPlay={eventListener}>
            <source src={props.audioSrc} type={"audio/mpeg"}/>
        </audio> : <div/>

    const canvas = <canvas id={"canvas"}
                           style={{
                               backgroundImage: "url(88607104505073b59e1c788c42d8cf75c24cbc91.jpg)",
                               backgroundSize: "300px 300px",
                               width: "300px",
                               height: "300px"
                           }}></canvas>


    const video = <video id={"video"} style={{
        width: "300px",
        height: "300px"
    }} controls={true} autoPlay={false}/>

    return (
        <div className="App">
            {canvas}
            <br/>
            {audio}
            <br/>
            {button}
            <br/>
            {video}
        </div>
    )

}

export default App;
