#!/usr/bin/env bash
# Dev-only. Pulls the slug-named menu photos from the shared Drive folder into
# assets/source/menu. Re-runnable: existing files are overwritten.
set -uo pipefail
DEST="assets/source/menu"
mkdir -p "$DEST"

# slug<TAB>drive-file-id  — taken from the Menu-images folder listing.
read -r -d '' MAP <<'MAPEOF'
spicy-rice	1cXbC0X5Fw6u8OIWA_OQMcGSkFu4JxLdd
fried-rice	1GVdRmIL10Mm1uVb54-n7MWqg8p9Roljf
rice-and-beans	1ROyzOiRbacJIYVjDlyOG07Gp5cwGYicj
beans-ewa	1FAVb8n00g9kObB26Y9t87q4-c12kULW_
yam-porridge	1MtCS_tghMiGn9M1N8jpzVjPOOmM4T4hg
amala	1hRJhYsRt1Z7DKQUm8_bOA6XMuyPA7Vzg
eba	1K1bLBvNPEE6hyIhvLsUblKJf4QLHBdg2
semo	1U9oLWXKqQo-sTjO3ymN08wgpkqS1Cc66
chicken	1nMO9MBepoeMd37EiqiJIvzAApQK-3jk4
beef	1_kH3_lCRkS8E9193_2kN2kHmciBeyoxf
goat-meat	1JreqFfGAEgyd-tGlFFGoqtrAEXueIfs6
turkey	1xNZP4IBkv9Qc-oOLJgY-anvo1gcRrI4-
assorted	10XXV8JsxETErlPxHk5BJRbsL15Pc-2zD
ponmo	1Wk7SdQT7kG73llq44-5oMtOKyBDPCL-b
bokoto	18einAk8nSJ3cdbk64tP0rKUMmPbXeCzF
titus	15RLcDMtr3eKJZ-lqcN4U11ss6IF3BoS-
panla	1NJA2sbz-EqxelNwX7ba6UygZ3mx5eQSJ
boiled-egg	1zl2zV5ckaQhzkdNTGFsUOZ27B2WOh-dd
plantain-dodo	1I6nhtUkf7e_BOfqP1_C7dSHP_MVxmfBk
moin-moin	1nM8nePPGvLQKL7nuv6rX8t6PL7LDh1Xt
coleslaw	139PW5wBUjgks_Uam-Hufchl8q7Q0FjF_
macbite-bread	1pUfB7IegnoYpvxg214SVM-kJDGQf6XV6
coke	19aVaf0T_ywGAJp5SmB57at-b2rB8PGxu
fanta	1AmqZNv5aFkLPsEsmNZ87zetvbgRfuFZq
sprite	1xoK_9QG1-Ondp-aPJzcStzGY8UCNEhvp
pepsi	1p7jYZoBrrCetUKY6p50f_6y5A8gBNEmG
schweppes	16Xs-kZ_U3jRSV-getlIYspTc9vzw_KD6
pulpy	148_xPt8D9jjMjwtrbms6Jfi03gZkyzWC
maltina	1bAbCQkzP9eK8aK9Dmh3amGJ72itHLKwd
sossa	1_cIgufIc7Vl-o_pD8uyZI0zETuuAPAF7
dudu-osun-drink	182U9KR-QaBVfdqoMG0opMCnE9PAdMMbp
yogurt	1LsrjFel3GLHoiWij5vtgfgQDPU2z0S-6
bottled-water	1z-xHu1oz9Fjy1ocY6H24o1xzpVM86JEC
chivita	1hnrCVpCUtRhoM55ZOXzxiLAXINCocPDH
active	1KqX--EfODMBcohhfx3-3EZP1EZWSil8z
hollandia	1ndkHDB54Wz4bKeV2MG7EHrqu_wvLwdQu
MAPEOF

ok=0; fail=0
while IFS=$'\t' read -r slug id; do
  [ -z "${slug:-}" ] && continue
  out="$DEST/$slug.png"
  curl -sL -o "$out" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t"
  if file "$out" | grep -qi 'image data'; then
    ok=$((ok+1)); printf '  ok      %-18s %s\n' "$slug" "$(du -h "$out" | cut -f1)"
  else
    fail=$((fail+1)); printf '  FAILED  %-18s (not an image — check sharing)\n' "$slug"; rm -f "$out"
  fi
done <<< "$MAP"
echo "downloaded $ok, failed $fail"
