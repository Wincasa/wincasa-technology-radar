call npm run build
set REQUESTS_CA_BUNDLE=C:\certs\root.cer
call az login
call az storage blob upload-batch -d $web --source dist --account-name wincasatechradar