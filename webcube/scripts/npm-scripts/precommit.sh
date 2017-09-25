#!/bin/sh
webcubeRoot="."
binRoot="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  webcubeRoot="${npm_package_config_webcube_monorepo_root}"
  binRoot="${npm_package_config_webcube_monorepo_root}"
  if [[ ! -d ${binRoot}/node_modules/ ]]; then
    webcubeRoot="."
    binRoot="./node_modules/webcube"
  fi
fi
lint() {
  $binRoot/node_modules/.bin/lint-staged || (
    echo ""
    echo "=============================="
    echo "All eslint errors in staged files must be fixed. "
    echo ""
    echo "Any rule set to 'error' (2) is considered to can be fixed without "
    echo "understanding business logic and code owner's thoughts."
    echo "Otherwise, it will be set to 'warn' (1)."
    echo ""
    echo "When you see an eslint's error or warning and don't know how to fix it,"
    echo "follow these steps:"
    echo "1. Find the rule ID that correspond to the error/warning"
    echo "   from the console log or IDE's problems/lint panel."
    echo "2. Open the closest .eslintrc, such as"
    echo "   https://cd.i.strikingly.com/strikingly/Bobcat/blob/develop/.eslintrc"
    echo "   then search for the rule ID."
    echo "3. Find tips in comments. If they do not exist or are not enough,"
    echo "   open the link (cmd+click in VSCode) in the comments to see rule's document."
    echo "4. If you cannot find the rule ID in the .eslintrc or you want to know more,"
    echo "   open the following link:"
    echo "   https://github.com/dexteryy/Project-WebCube/blob/master/eslint-config-webcube/.eslintrc.config.json"
    echo "   then search for the rule ID."
    echo ""
    echo "NOTE:"
    echo "* Inline configuration (like eslint-disable) MUST only be used for explicitly declare the rare case,"
    echo "  NOT for permanently or temporarily ignore the error/warning."
    echo "* DO NOT optionally modify .eslintrc and pre-commit scripts."
    exit 1
  )
}

(
  lint
) && (
  npm run precommit:custom
) && (

echo ""
echo "=============================="
echo "[PRECOMMIT] Verified!"
echo ""

) || (
echo ""
echo "=============================="
echo "[PRECOMMIT] failed!"
echo ""
echo "For TRULY URGENT case (like hotfix), you can skip the precommit script:"
echo "git commit --no-verify -m \"message\""
echo "Otherwise, you MUST solve all above issues one by one!"
echo ""
exit 1

)