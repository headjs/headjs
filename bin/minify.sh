# http://marijnhaverbeke.nl/uglifyjs

cd ../src

echo '/**
	Head JS: The only script in your <HEAD>

	copyright: "tipiirai" / Tero Piirainen
	license: MIT
*/' > ../head.js

grep -A 3000 "(function" head.core.js >> ../head.js 
grep -A 3000 "(function" head.detect.js >> ../head.js 
grep -A 3000 "(function" head.loader.js >> ../head.js

