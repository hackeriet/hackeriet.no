##  systemd timers
### meetup.com event data

- `meetup_com-data.service` downloads meetup event data and saves it in the
  public html folder
- `meetup_com-data.timer` runs the above service at specific time intervals

**NOTE:** The service file uses a specific target path for storing the
downloaded data. Read the source to make sure it downloads the file to
the correct directory.

#### Install

    # Help systemd find the unit files
    sudo cp ./meetup_com-data.{service,timer} /etc/systemd/system/
    sudo systemctl daemon-reload

    # Start now
    sudo systemctl start meetup_com-data.{service,timer}

    # Start on boot
    sudo systemctl enable meetup_com-data.{service,timer}

