# https://www.instructables.com/Setup-IR-Remote-Control-Using-LIRC-for-the-Raspber/

sudo apt-get install lirc

cp ./lirc_options.conf /etc/lirc/lirc_options.conf
mv /etc/lirc/lircd.conf /etc/lirc/lircd_original.conf
cp ./lircd.conf /etc/lirc/lircd.conf

sed -i "s/#dtoverlay=gpio-ir,gpio_pin=17/dtoverlay=gpio-ir,gpio_pin=17/g" /boot/config.txt
sed -i "s/#dtoverlay=gpio-ir-tx,gpio_pin=18/dtoverlay=gpio-ir-tx,gpio_pin=18/g" /boot/config.txt

 cp projector.lircd.conf /etc/lirc/lircd.conf.d/
 cp soundbar.lircd.conf /etc/lirc/lircd.conf.d/

/etc/init.d/lircd start
/etc/init.d/lircd status


