#!/bin/bash

echo "Starting guayaba-api in a new window..."
mintty -e bash -c "cd guayaba-api && bun start:dev; exec bash" &

echo "Starting guayaba-app in a new window..."
mintty -e bash -c "cd guayaba-app && flutter run --dart-define-from-file=.env; exec bash" &


