// lib/recorder.ts

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: BlobPart[] = [];
let activeStream: MediaStream | null = null;
let cleanupVideos: (() => void) | null = null;

/**
 * START RECORDING
 */
export async function startRecording(options: {
  mode: "camera" | "screen" | "screen+camera";
  videoDeviceId?: string;
  audioDeviceId?: string;
}) {
  recordedChunks = [];

  let stream: MediaStream;

  // 🎥 CAMERA ONLY
  if (options.mode === "camera") {
    stream = await navigator.mediaDevices.getUserMedia({
      video: options.videoDeviceId
        ? { deviceId: { exact: options.videoDeviceId } }
        : true,
      audio: options.audioDeviceId
        ? { deviceId: { exact: options.audioDeviceId } }
        : true,
    });
  }

  // 🖥 SCREEN ONLY
  else if (options.mode === "screen") {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
  }

  // 🖥 + 🎥 SCREEN + CAMERA
  else {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true, // user must share tab audio
    });

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: options.videoDeviceId
        ? { deviceId: { exact: options.videoDeviceId } }
        : true,
      audio: false,
    });

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: options.audioDeviceId
        ? { deviceId: { exact: options.audioDeviceId } }
        : true,
    });

    stream = await combineStreams(screenStream, cameraStream, micStream);
  }

  activeStream = stream;
  const previewCleanup = attachPreview(stream);

    const previousCleanup = cleanupVideos;
    cleanupVideos = () => {
      previewCleanup();
      previousCleanup?.();
    }


  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp8,opus",
  });

  mediaRecorder.ondataavailable = e => {
    if (e.data.size) recordedChunks.push(e.data);
  };

  mediaRecorder.start();
}

/**
 * STOP RECORDING AND RETURN FILE
 * 
 * 
 */

export function pauseRecording() {
  if (!mediaRecorder) return;

  if (mediaRecorder.state === "recording") {
    mediaRecorder.pause();
  }
}

/**
 * RESUME RECORDING
 */
export function resumeRecording() {
  if (!mediaRecorder) return;

  if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
  }
}


export async function stopRecording(): Promise<File> {
  if (!mediaRecorder) throw new Error("No active recording");

  await new Promise<void>(res => {
    mediaRecorder!.onstop = () => res();
    mediaRecorder!.stop();
  });

  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const file = new File([blob], "recording.webm", { type: "video/webm" });

  cleanup();
  return file;
}

/**
 * CLEANUP
 */
function cleanup() {
  activeStream?.getTracks().forEach(t => t.stop());
  cleanupVideos?.();
  activeStream = null;
  mediaRecorder = null;
  recordedChunks = [];
  cleanupVideos = null;
}

/**
 * COMBINE SCREEN + CAMERA + MIC
 */
async function combineStreams(
  screenStream: MediaStream,
  cameraStream: MediaStream,
  micStream: MediaStream
): Promise<MediaStream> {

  // ---------- VIDEO ----------
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  const screenVideo = document.createElement("video");
  const camVideo = document.createElement("video");

  screenVideo.srcObject = screenStream;
  camVideo.srcObject = cameraStream;

  screenVideo.muted = true;
  camVideo.muted = true;
  screenVideo.playsInline = true;
  camVideo.playsInline = true;

  screenVideo.style.display = "none";
  camVideo.style.display = "none";

  document.body.append(screenVideo, camVideo);

  cleanupVideos = () => {
    screenVideo.remove();
    camVideo.remove();
  };

  await Promise.all([
    new Promise(r => (screenVideo.onloadedmetadata = r)),
    new Promise(r => (camVideo.onloadedmetadata = r)),
  ]);

  await screenVideo.play();
  await camVideo.play();

  function draw() {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(camVideo, canvas.width - 320, canvas.height - 240, 300, 220);
    requestAnimationFrame(draw);
  }
  draw();

  const canvasStream = canvas.captureStream(30);

  // ---------- AUDIO ----------
  const audioContext = new AudioContext();
  await audioContext.resume();

  const destination = audioContext.createMediaStreamDestination();

  if (screenStream.getAudioTracks().length) {
    audioContext
      .createMediaStreamSource(screenStream)
      .connect(destination);
  }

  if (micStream.getAudioTracks().length) {
    audioContext
      .createMediaStreamSource(micStream)
      .connect(destination);
  }

  destination.stream.getAudioTracks().forEach(track =>
    canvasStream.addTrack(track)
  );

  return canvasStream;
}

function attachPreview(stream: MediaStream) {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.style.position = "fixed";
  video.style.bottom = "20px";
  video.style.right = "20px";
  video.style.width = "320px";
  video.style.zIndex = "9999";
  document.body.appendChild(video);

  return () => video.remove();
}
