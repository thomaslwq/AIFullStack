#!/bin/bash
# Rebuild verify sample: voiceover + real code cards, no AI talking-head video.
set -e
cd "$(dirname "$0")"
ASSETS=../../../docs/manga/episodes/verify-mybatis-camelcase/assets
BUILD=build
rm -rf "$BUILD" && mkdir -p "$BUILD"

SEG=5.057
FPS=25

# f1: person atmosphere still (voiceover 1)
ffmpeg -y -framerate $FPS -loop 1 -t $SEG -i "$ASSETS/01.jpg" \
  -vf "scale=720:1280,format=yuv420p" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/f1.mp4"

# f2: XML card (voiceover 2) ; f3: compare card (3) ; f4: yml card (4)
ffmpeg -y -framerate $FPS -loop 1 -t $SEG -i cards/card1.png \
  -vf "scale=720:1280,format=yuv420p" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/f2.mp4"
ffmpeg -y -framerate $FPS -loop 1 -t $SEG -i cards/card2.png \
  -vf "scale=720:1280,format=yuv420p" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/f3.mp4"
ffmpeg -y -framerate $FPS -loop 1 -t $SEG -i cards/card3.png \
  -vf "scale=720:1280,format=yuv420p" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/f4.mp4"

cat > "$BUILD/concat.txt" <<EOF
file 'f1.mp4'
file 'f2.mp4'
file 'f3.mp4'
file 'f4.mp4'
EOF
ffmpeg -y -f concat -safe 0 -i "$BUILD/concat.txt" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/concat.mp4"

# Mix four voice tracks, aligned to segment start + 600ms
ffmpeg -y -i voice/seg01.mp3 -i voice/seg02.mp3 -i voice/seg03.mp3 -i voice/seg04.mp3 \
 -filter_complex "[0:a]adelay=600|600[a0];[1:a]adelay=5657|5657[a1];[2:a]adelay=10714|10714[a2];[3:a]adelay=15771|15771[a3];[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0,volume=1.6[a]" \
 -map "[a]" -c:a aac -b:a 128k -ar 44100 "$BUILD/mix.m4a"

# Burn ASS subtitles and encode final
ffmpeg -y -i "$BUILD/concat.mp4" -i "$BUILD/mix.m4a" -vf "subtitles=subtitles.ass" \
 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100 final.mp4

echo "=== final ==="
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 final.mp4
