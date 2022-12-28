# Prepare contributors
wget https://raw.githubusercontent.com/ScratchAddons/contributors/with-commits/contributors.json -O "./data/credits/contributors.json"

# Prepare security.txt expirity date (28 days later)
sed -i "s/Expires: .*/Expires: $(date +"%Y-%m-%dT%H:%M:%S%z" -d "4 week")/g" static/.well-known/security.txt

# Prepare translations
npm ci --prefix ../script
node ../script/node/ci/hugo-add-i18n.js