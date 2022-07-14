#!/bin/sh
# makeIPA.sh

# Color
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
LIGHT_BLUE='\033[1;36m'
NC='\033[0m'

# Line Break
LINE_BREAK_LEFT="\n\033[32;1m"
LINE_BREAK_RIGHT="\033[0m\n"

# Project name
PROJECT_NAME="RetailClient"

# info.plis path
INFOPLIST_PATH="./ios/RetailClient-tvOS/Info.plist"

DATE="$(date +%Y%m%d)"
# Storage folder name
IPA_FOLDER_NAME="Release-${DATE}"

# IPA File path
EXPORT_FILE_PATH="outputs/${IPA_FOLDER_NAME}"
ExportOptions_Path=./ios/ExportOptions.plist

SCHEME_NAME="RetailClient-tvOS"
CONFIGURATION="Release"
PROJECT_TYPE="workspace"
PROJECT_TYPE_EXT="xcworkspace"

echo "${YELLOW}[Process] Archiving${NC}"
echo "${LIGHT_BLUE}[INFO]: ${EXPORT_FILE_PATH}/${SCHEME_NAME}${NC}"
xcodebuild \
    -exportArchive \
    -archivePath $EXPORT_FILE_PATH/$PROJECT_NAME.xcarchive \
    -exportPath $EXPORT_FILE_PATH \
    -exportOptionsPlist $ExportOptions_Path \
    -allowProvisioningUpdates \
    -quiet | xcpretty || exit

if [ -e $EXPORT_FILE_PATH/$SCHEME_NAME.ipa ]; then
    echo "${GREEN}[Success] Finished Archiving${NC}"
    open $EXPORT_FILE_PATH
else
    echo "${RED}[Error] Failure to export archive${NC}"
fi
