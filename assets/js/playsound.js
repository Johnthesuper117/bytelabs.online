function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

function playMultiSound(src0, src1, src2, src3, src4, src5, src6, src7, src8, src9) {
  const audio0 = new Audio(src0);
  const audio1 = new Audio(src1);
  const audio2 = new Audio(src2);
  const audio3 = new Audio(src3);
  const audio4 = new Audio(src4);
  const audio5 = new Audio(src5);
  const audio6 = new Audio(src6);
  const audio7 = new Audio(src7);
  const audio8 = new Audio(src8);
  const audio9 = new Audio(src9);
  const audioTrack = [audio0, audio1, audio2, audio3, audio4, audio5, audio6, audio7, audio8, audio9]
  audioTrack.forEach((track) => {
    track.play();
  });
}    
