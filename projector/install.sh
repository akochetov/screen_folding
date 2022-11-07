echo 'Installing deamon ...'
sudo cp projector /etc/init.d/
sudo chmod +x /etc/init.d/projector
sudo update-rc.d projector defaults
echo 'Done'
