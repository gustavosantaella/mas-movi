trap 'kill $(jobs -p) 2>/dev/null; exit 1' SIGINT SIGTERM

eas build --profile development --platform android --non-interactive &
eas build --profile development --platform ios --non-interactive &
wait