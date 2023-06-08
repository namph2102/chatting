const Hello = 'dsadsa';
export default Hello;
// useEffect(() => {
//   if (navigator.mediaDevices) {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then(function (stream) {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           console.log(stream);
//           videoRef.current.play();
//         }
//       })
//       .catch(function (error) {
//         console.log('Lỗi khi truy cập thiết bị media: ', error);
//       });
//   } else {
//     console.log('getUserMedia không được hỗ trợ trên trình duyệt này');
//   }
// }, []);
// Nói
// useEffect(() => {
//   if (navigator.mediaDevices) {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then(function (stream: any) {
//         const audioContext = new AudioContext();
//         const audioSource = audioContext.createMediaStreamSource(stream);
//         if (audioRef.current) {
//           audioRef.current.srcObject = stream;
//           audioRef.current.play();
//         }
//         // Process or transmit the audio
//         // Example: Send audio data to a server
//         const audioData = new FormData();
//         audioData.append('audio', stream);
//        truyền data audiodata
//
//       })
//       .catch(function (error) {
//         // Handle any errors that occurred or if access was denied
//         console.log('getUserMedia error:', error);
//       });
//   } else {
//     console.log('getUserMedia không được hỗ trợ trên trình duyệt này');
//   }
// }, []);

// Ghi âm
// useEffect(() => {
//   navigator.mediaDevices
//     .getUserMedia({ audio: true })
//     .then(function (stream) {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then(function (stream) {
//           const mediaRecorder = new MediaRecorder(stream);
//           const chunks: BlobPart[] = [];

//           mediaRecorder.addEventListener('dataavailable', function (e) {
//             chunks.push(e.data);
//           });

//           mediaRecorder.addEventListener('stop', function () {
//             const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             // Làm gì đó với audioUrl, ví dụ tải về hoặc phát lại
//             console.log(audioUrl);
//             if (audioRef.current) {
//               audioRef.current.src = audioUrl;
//             }
//           });

//           // Bắt đầu ghi âm
//           mediaRecorder.start();

//           // Dừng ghi âm sau khoảng thời gian nhất định
//           setTimeout(function () {
//             mediaRecorder.stop();
//           }, 5000); // Dừng sau 5 giây
//         })
//         .catch(function (error) {
//           console.log('Lỗi khi truy cập vào microphone: ', error);
//         });
//     })
//     .catch(function (error) {
//       console.log('Lỗi khi truy cập vào microphone: ', error);
//     });
// });
