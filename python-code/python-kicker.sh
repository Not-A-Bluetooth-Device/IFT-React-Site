#!/bin/bash
# update the cd as appropriate
cd /home/dmyerscough
log_file="temperature_logger.log"
if [ -e $log_file ]; then 
	curr_time=$(date "+%Y%m%d-%H%M%S")
	file_ext="${log_file##*.}"
	save_log="${log_file%.*}-$curr_time.$file_ext"
	mv "$log_file" "$save_log"
	# echo "Renamed File"
else 
	# echo "No log existed"
fi 

python3 hello_world.py # may need to be python if python3 doesn't work

# this shell script should be added to the /etc/rc.local file before the exit 0 line
