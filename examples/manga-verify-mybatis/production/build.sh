#!/bin/bash
# Rebuild verify sample: voiceover + animated real code cards, no AI talking-head video.
set -e
cd "$(dirname "$0")"
ASSETS=../../../docs/manga/episodes/verify-mybatis-camelcase/assets
BUILD=build
rm -rf "$BUILD" && mkdir -p "$BUILD"

SEG=5.057
FPS=25

# 1. Render animated frame sequences (push-in for person, highlight + underline for cards)
python3 anim_frames.py

# 2. Encode each segment from its frame sequence
for s in f1 f2 f3 f4; do
  ffmpeg -y -framerate $FPS -i "$BUILD/frames/$s/%04d.png" \
    -vf "format=yuv420p" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/$s.mp4"
done

cat > "$BUILD/concat.txt" <<EOF
file 'f1.mp4'
file 'f2.mp4'
file 'f3.mp4'
file 'f4.mp4'
EOF
ffmpeg -y -f concat -safe 0 -i "$BUILD/concat.txt" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "$BUILD/concat.mp4"

# 3. Light highlight chime (used on f2/f3/f4, aligned to highlight fade-in)
ffmpeg -y -f lavfi -i "sine=frequency=880:duration=0.08:sample_rate=44100" \
  -af "volume=0.08,afade=t=in:st=0:d=0.01,afade=t=out:st=0.055:d=0.025" -ac 1 "$BUILD/beep.wav"

# 4. Mix four voice tracks (segment start + 600ms) with three chimes.
#    Voice starts: 600 / 5657 / 10714 / 15771 ms; highlight at +550 ms on f2/f3/f4.
ffmpeg -y -i voice/seg01.mp3 -i voice/seg02.mp3 -i voice/seg03.mp3 -i voice/seg04.mp3 \
  -i "$BUILD/beep.wav" -i "$BUILD/beep.wav" -i "$BUILD/beep.wav" \
 -filter_complex "\
[0:a]adelay=600|600[a0];[1:a]adelay=5657|5657[a1];[2:a]adelay=10714|10714[a2];[3:a]adelay=15771|15771[a3];\
[4:a]adelay=6207|6207[b1];[5:a]adelay=11264|11264[b2];[6:a]adelay=16321|16321[b3];\
[a0][a1][a2][a3][b1][b2][b3]amix=inputs=7:duration=longest:dropout_transition=0,volume=1.6[a]" \
 -map "[a]" -c:a aac -b:a 128k -ar 44100 "$BUILD/mix.m4a"

# 5. Burn ASS subtitles and encode final
ffmpeg -y -i "$BUILD/concat.mp4" -i "$BUILD/mix.m4a" -vf "subtitles=subtitles.ass" \
 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100 final.mp4

echo "=== final ==="
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 final.mp4
