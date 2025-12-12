#!/bin/bash
cd /home/kavia/workspace/code-generation/digital-test-suite-6953-6962/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

