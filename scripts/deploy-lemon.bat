@REM pnpm run build
rm build.tar
tar -cf build.tar -C build .
scp build.tar lemon:~/helium
ssh lemon tar -xf ~/helium/build.tar -C ~/helium --overwrite
ssh lemon rm ~/helium/build.tar