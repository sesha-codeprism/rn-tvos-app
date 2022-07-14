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

# Initialization 1
# ========================================================

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
# ========================================================

echo "${YELLOW}[Process] Start${NC}"
echo "${YELLOW}[Process] Cleaning${NC}"
xcodebuild \
    clean \
    -$PROJECT_TYPE ./ios/$PROJECT_NAME.$PROJECT_TYPE_EXT \
    -scheme $SCHEME_NAME \
    -configuration $CONFIGURATION

echo "${GREEN}[Success] Finished cleaning${NC}"

echo "${YELLOW}[Process] Building and Archiving${NC}"

xcodebuild \
    archive \
    -$PROJECT_TYPE ./ios/$PROJECT_NAME.$PROJECT_TYPE_EXT \
    -scheme $SCHEME_NAME \
    -archivePath $EXPORT_FILE_PATH/$PROJECT_NAME.xcarchive \
    clean archive \
    -quiet || exit

if [ -e $EXPORT_FILE_PATH/$PROJECT_NAME.xcarchive ]; then
    echo "${GREEN}[Success] Finished building and archiving${NC}"
else
    echo "${RED}[Error] Failure to build and archive${NC}"
    exit 1
fi

echo "${YELLOW}[Process] Archiving${NC}"
echo "${LIGHT_BLUE}[INFO]: Extracting IPA to: ${EXPORT_FILE_PATH}/${SCHEME_NAME}${NC}"
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
