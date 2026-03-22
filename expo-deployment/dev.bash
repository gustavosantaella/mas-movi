#!/bin/bash
trap 'kill $(jobs -p) 2>/dev/null; exit 1' SIGINT SIGTERM

PLATFORM=""

while getopts "d:" opt; do
  case $opt in
    d) PLATFORM="$OPTARG" ;;
    *) echo "Uso: bash dev.bash [-d android|ios]"; exit 1 ;;
  esac
done

if [ "$PLATFORM" = "android" ]; then
  echo "🤖 Compilando solo Android..."
  eas build --profile development --platform android --non-interactive
elif [ "$PLATFORM" = "ios" ]; then
  echo "🍎 Compilando solo iOS..."
  eas build --profile development --platform ios --non-interactive
else
  echo "🔨 Compilando Android e iOS en paralelo..."
  eas build --profile development --platform android --non-interactive &
  eas build --profile development --platform ios --non-interactive &
  wait
fi