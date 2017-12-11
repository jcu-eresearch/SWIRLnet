% Parent script to loop through the read_output_10min.m script

for ii = 1:300
    clear
    datestr(now)
    read_output_10min
    close all
    
    pause(1770)
end