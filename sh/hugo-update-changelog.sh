SAVEIFS=$IFS
IFS=$'\n'

DO_PRINT_1=true
DESTINATION_FILE="content/changelog.md"

print_line() {
echo $1 >> "$DESTINATION_FILE.tmp"
}

while read -r line1; do
	if [[ $line1 == "<!-- sa-changelog-end -->" ]]; then
	DO_PRINT_1=true
fi
if [[ $DO_PRINT_1 = true ]]; then 
	print_line "$line1"
fi
if [[ $line1 == "<!-- sa-changelog-start -->" ]]; then
	DO_PRINT_1=false
	DO_PRINT_2=false
	while read -r line2; do
	if [[ $line2 == "<!-- sa-changelog-end -->" ]]; then
		DO_PRINT_2=false
	fi
	if [[ $DO_PRINT_2 = true ]]; then 
		print_line "$line2"
	fi
	if [[ $line2 == "<!-- sa-changelog-start -->" ]]; then
		DO_PRINT_2=true
	fi
	done <<< "$(curl https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/changelog/CHANGELOG.md)"
fi

done <<< "$(tr -d '\r' < $DESTINATION_FILE)"

IFS=$SAVEIFS

perl -pi -e 's/\n/\r\n/g' "$DESTINATION_FILE.tmp"
rm -rf "$DESTINATION_FILE"
mv "$DESTINATION_FILE.tmp" "$DESTINATION_FILE"