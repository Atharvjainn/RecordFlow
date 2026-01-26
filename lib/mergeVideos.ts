// lib/mergeVideos.ts
'use client'

/**
 * Merge screen + camera using Canvas API (INSTANT, no FFmpeg!)
 * Records both streams in real-time with PIP overlay
 */
export async function mergeVideosWithCanvas(
  screenStream: MediaStream,
  cameraStream: MediaStream,
  micStream: MediaStream
): Promise<{ stop: () => Promise<File> }> {
  
  console.log('mergeVideosWithCanvas called');
  console.log('Screen tracks:', screenStream.getTracks().length);
  console.log('Camera tracks:', cameraStream.getTracks().length);
  console.log('Mic tracks:', micStream.getTracks().length);
  
  // Create video elements
  const screenVideo = document.createElement('video');
  const cameraVideo = document.createElement('video');
  
  screenVideo.srcObject = screenStream;
  cameraVideo.srcObject = cameraStream;
  screenVideo.muted = true;
  cameraVideo.muted = true;
  
  console.log('Playing videos...');
  await screenVideo.play();
  await cameraVideo.play();
  
  // Wait for metadata to load
  await new Promise(resolve => {
    screenVideo.onloadedmetadata = resolve;
  });
  
  console.log('Video dimensions:', screenVideo.videoWidth, 'x', screenVideo.videoHeight);
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = screenVideo.videoWidth || 1920;
  canvas.height = screenVideo.videoHeight || 1080;
  const ctx = canvas.getContext('2d')!;
  
  console.log('Canvas created:', canvas.width, 'x', canvas.height);
  
  // PIP dimensions
  const pipWidth = 300;
  const pipHeight = 220;
  const pipX = canvas.width - pipWidth - 20;
  const pipY = canvas.height - pipHeight - 20;
  
  // Draw frames
  let animationId: number;
  const drawFrame = () => {
    // Draw screen (full canvas)
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    
    // Draw camera PIP (bottom-right corner)
    ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);
    
    // Add border to PIP
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);
    
    animationId = requestAnimationFrame(drawFrame);
  };
  
  drawFrame();
  
  console.log('Drawing started');
  
  // Capture canvas stream (video only)
  const canvasStream = canvas.captureStream(30); // 30 FPS
  console.log('Canvas stream captured');
  
  // Mix audio: screen audio + microphone audio
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  
  console.log('Audio context created');
  
  // Add screen audio (system audio)
  const screenAudioTrack = screenStream.getAudioTracks()[0];
  if (screenAudioTrack) {
    console.log('Adding screen audio');
    const screenSource = audioContext.createMediaStreamSource(
      new MediaStream([screenAudioTrack])
    );
    screenSource.connect(destination);
  } else {
    console.log('No screen audio track found');
  }
  
  // Add microphone audio
  const micAudioTrack = micStream.getAudioTracks()[0];
  if (micAudioTrack) {
    console.log('Adding mic audio');
    const micSource = audioContext.createMediaStreamSource(
      new MediaStream([micAudioTrack])
    );
    micSource.connect(destination);
  } else {
    console.log('No mic audio track found');
  }
  
  // Add mixed audio to canvas stream
  destination.stream.getAudioTracks().forEach(track => {
    canvasStream.addTrack(track);
  });
  
  console.log('Total tracks in canvas stream:', canvasStream.getTracks().length);
  
  // Record the canvas stream
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(canvasStream, {
    mimeType: 'video/webm; codecs=vp8,opus',
  });
  
  console.log('MediaRecorder created');
  
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      console.log('Chunk received:', e.data.size, 'bytes');
      chunks.push(e.data);
    }
  };
  
  recorder.onerror = (e) => {
    console.error('Recorder error:', e);
  };
  
  recorder.start(100); // Collect data every 100ms
  console.log('Recorder started');
  
  // Return stop function
  return {
    stop: async () => {
      console.log('Stop function called');
      return new Promise<File>((resolve) => {
        recorder.onstop = () => {
          console.log('Recorder stopped, chunks:', chunks.length);
          cancelAnimationFrame(animationId);
          screenVideo.srcObject = null;
          cameraVideo.srcObject = null;
          audioContext.close();
          
          const blob = new Blob(chunks, { type: 'video/webm' });
          const file = new File([blob], 'merged-recording.webm', {
            type: 'video/webm',
          });
          
          console.log('File created:', file.size, 'bytes');
          resolve(file);
        };
        
        recorder.stop();
      });
    }
  };
}

/**
 * Alternative: Merge two already-recorded files
 * (This still uses FFmpeg but optimized)
 */
export async function mergeRecordedVideos(
  screenFile: File,
  cameraFile: File
): Promise<File> {
  // Create video elements
  const screenVideo = document.createElement('video');
  const cameraVideo = document.createElement('video');
  
  screenVideo.src = URL.createObjectURL(screenFile);
  cameraVideo.src = URL.createObjectURL(cameraFile);
  screenVideo.muted = true;
  cameraVideo.muted = true;
  
  await screenVideo.play();
  await cameraVideo.play();
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = screenVideo.videoWidth || 1920;
  canvas.height = screenVideo.videoHeight || 1080;
  const ctx = canvas.getContext('2d')!;
  
  const pipWidth = 300;
  const pipHeight = 220;
  const pipX = canvas.width - pipWidth - 20;
  const pipY = canvas.height - pipHeight - 20;
  
  // Draw frame function
  const drawFrame = () => {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);
  };
  
  // Capture stream
  const canvasStream = canvas.captureStream(30);
  
  // Add audio
  const audioContext = new AudioContext();
  const screenSource = audioContext.createMediaElementSource(screenVideo);
  const destination = audioContext.createMediaStreamDestination();
  screenSource.connect(destination);
  
  destination.stream.getAudioTracks().forEach(track => {
    canvasStream.addTrack(track);
  });
  
  // Record
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(canvasStream, {
    mimeType: 'video/webm; codecs=vp8,opus',
  });
  
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  
  // Start recording and drawing
  recorder.start();
  let lastTime = 0;
  
  const animate = (timestamp: number) => {
    if (timestamp - lastTime >= 1000 / 30) { // 30 FPS
      drawFrame();
      lastTime = timestamp;
    }
    
    if (!screenVideo.ended) {
      requestAnimationFrame(animate);
    } else {
      recorder.stop();
    }
  };
  
  return new Promise((resolve) => {
    recorder.onstop = () => {
      URL.revokeObjectURL(screenVideo.src);
      URL.revokeObjectURL(cameraVideo.src);
      
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(new File([blob], 'merged.webm', { type: 'video/webm' }));
    };
    
    requestAnimationFrame(animate);
  });
}