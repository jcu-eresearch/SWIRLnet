% Import and view output from logger

% Required info and input data files (must be updated for each event)
tc_name = 'DEBBIE';
directory = ['C:\Users\uqmmaso1\Google_Drive\RESEARCH\SWIRLnet\Deployments\2017_TC_' tc_name '\data_10min'];
%z0_site = load([directory 'z0_site_ita.txt']); % site roughness characteristics for each tower (columns) and 8 45degree segments (rows). first row; 337.5-22.5 deg
%lat_site = load([directory 'lat_site_ita.txt']); % Latitude South for each tower site (don't include the -ve)
savefiledirpublic = 'C:\Users\uqmmaso1\Dropbox\ADTCC\TC_Debbie_March2017\TC_Debbie_public\';
savefiledirprivate = 'C:\Users\uqmmaso1\Dropbox\ADTCC\TC_Debbie_March2017\diagnostic\';
savefiledirarchive = 'C:\Users\uqmmaso1\Google_Drive\RESEARCH\SWIRLnet\Deployments\2017_TC_DEBBIE\realtime_archive\';
% 
towers = 1:6;% input('List towers (pakbus?) to be analysed - e.g. [1 2 6] or [1:6] : ');
num_towers = length(towers);
datetimeformat = 'yyyy-mm-dd HH:MM:SS';
kmh_to_mps = 1/3.6;
start_time_list = [datenum('2017-03-26 12:20:00',datetimeformat);...  %T1
    datenum('2017-03-26 15:30:00',datetimeformat);...  %T2
    datenum('2017-03-27 03:50:00',datetimeformat);...  %T3
    datenum('2017-03-27 07:00:00',datetimeformat);...  %T4
    datenum('2017-03-27 11:00:00',datetimeformat);...  %T5
    datenum('2017-03-27 14:00:00',datetimeformat)];   %T6

for i = 1:num_towers
    %close all
    twr_num = towers(i);
%     disp(['**** Tower number ' num2str(twr_num) ' ****'])
%     out_files = input('List tower non-wind output file (TOA5_TenMin?)numbers, e.g. [1 2 6] or [1:6] : ');
     num_out_files = 1; %length(out_files);
     start_time = start_time_list(i);
    
    datafile = [];
    for j = 1:num_out_files
        % Generate 10 min data filename
        filename_10min = [directory '\tenmin_pkb' num2str(towers(i)) '.dat']; %out_files(j)) '.dat'];
%         filename_10min = [directory 'pakbus' num2str(towers(i))...
%             '/tenmin_pkb' num2str(towers(i)) '.dat']; %out_files(j)) '.dat'];
        
        % Import 10 minute  data (this doesn't include wind)
        fid = fopen(filename_10min);
        data = textscan(fid,'%q %f %f %f %f %f %f %f %f %f %f %f',...
            'Delimiter',',','treatAsEmpty',{'"NAN"'});
%         data = textscan(fid,'%q %f %f %f %f %f %f %f %f %f %f %f',...
%             'HeaderLines',4,'Delimiter',',','treatAsEmpty',{'"NAN"'});
        fclose(fid);
        data{1} = datenum(data{1},datetimeformat); % This converts the date text strings to numeric values
        datafile =[datafile ; data]; 
    end
    
    % Extracting individual data columns
    time = cell2mat(datafile(:,1)); % Date and time of record (averaging is 10 min prior to this time)
    start_row = find(time == start_time);
    time = time(start_row:end);
    id = cell2mat(datafile(:,2)); % Sequential numeric stamp (Record number)
    id = id(start_row:end);
    battery_volt = cell2mat(datafile(:,3)); % Minimum battery voltage [V]
    battery_volt = battery_volt(start_row:end);
    % PTemp_Avg??? potential temp??
    board_temp = cell2mat(datafile(:,5)); % Average board temperature [Deg C]
    board_temp = board_temp(start_row:end);
    temp_avg = cell2mat(datafile(:,6)); % Average atmospheric temperature [Deg C]
    temp_avg = temp_avg(start_row:end);
    temp_max = cell2mat(datafile(:,7)); % Maximum atmospheric temperature [Deg C] (averaging time = ????)
    temp_max = temp_max(start_row:end);
    temp_min = cell2mat(datafile(:,8)); % Minimum atmospheric temperature [Deg C] (averaging time = ????)
    temp_min = temp_min(start_row:end);
    rh_avg = cell2mat(datafile(:,9)); % Average relative humidity [%]
    rh_avg = rh_avg(start_row:end);
    rh_max = cell2mat(datafile(:,10)); % Maximum relative humidity [%]
    rh_max = rh_max(start_row:end);
    rh_min = cell2mat(datafile(:,11)); % Minimum relative humidity [%]
    rh_min = rh_min(start_row:end);
    press = cell2mat(datafile(:,12)); % Atmospheric pressure [hPa] (this is not a 10 min average, but is a sample taken in the last minute)
    press = press(start_row:end);
    
    clear datafile data
    
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     out_files_wind = input('List tower wind output file (TOA5_Wind10Min?) numbers, e.g. [1 2 6] or [1:6] : ');
    num_out_files_wind = 1; %length(out_files_wind);
    
    datafile = [];
    for k = 1:num_out_files_wind
        % Generate 10 min wind data file
        filename_10min_wind = [directory '\wind10min_pkb' num2str(towers(i)) '.dat']; %out_files_wind(k)) '.dat'];
%         filename_10min_wind = [directory 'pakbus' num2str(towers(i))...
%             '/wind10min_pkb' num2str(towers(i)) '.dat']; %out_files_wind(k)) '.dat'];
        
        % Import 10 minute wind data
        fid = fopen(filename_10min_wind);
        data = textscan(fid,'%q %f %f %q %f %f %f %f',...
            'Delimiter',',','treatAsEmpty',{'"NAN"'});
%         data = textscan(fid,'%q %f %f %q %f %f %f %f',...
%             'HeaderLines',4,'Delimiter',',','treatAsEmpty',{'"NAN"'});
        fclose(fid);
        data{1} = datenum(data{1},datetimeformat); % This converts the date text strings to numeric values
        data{4} = datenum(data{4},datetimeformat); % This converts the date text strings to numeric values 
        datafile =[datafile ; data]; 
    end
    
    % Extracting individual data columns
    wind_time = cell2mat(datafile(:,1)); % Date and time of record (averaging is 10 min prior to this time)
    start_row_wind = find(wind_time == start_time);
    wind_time = wind_time(start_row_wind:end);
    wind_id = cell2mat(datafile(:,2)); % Sequential numeric stamp (Record number)
    wind_id = wind_id(start_row_wind:end);
    wind_speed_max = cell2mat(datafile(:,3)) * kmh_to_mps; % Maximum horizontal wind speed [m/s] (averaging time = ????)
    wind_speed_max = wind_speed_max(start_row_wind:end);
    wind_speed_max_time = cell2mat(datafile(:,4)); % Date and time of maximum wind speed
    wind_speed_max_time = wind_speed_max_time(start_row_wind:end);
    wind_dir_max = cell2mat(datafile(:,5)); % Wind direction of max gust [Deg]
    wind_dir_max = wind_dir_max(start_row_wind:end);
    wind_speed = cell2mat(datafile(:,6)) * kmh_to_mps; % Mean horizontal wind speed [m/s]
    wind_speed = wind_speed(start_row_wind:end);
    wind_dir = cell2mat(datafile(:,7)); % Mean wind direction [Deg]
    wind_dir = wind_dir(start_row_wind:end);
    wind_stdev = cell2mat(datafile(:,8)) * kmh_to_mps; % Standard deviation [m/s]
    wind_stdev = wind_stdev(start_row_wind:end);
    
    ti = wind_stdev./wind_speed;
    z0eff = 3.2./exp(1./ti);  %%%%%%% height is hard coded here and should be fixed to a variable
    
    %time_output = datafile(:,1);
    clear datafile data
    
    % Gust wind speed adjustment
    [ubar2,uhat2_3,uhat2_02,uhat2_3Mod,uhat2_02Mod] = toweradjust(wind_speed,wind_stdev,wind_speed_max);   
    
    % Calculate Iu and zoeff for bins
    DirBound = 0:22.5:360;
    udirShift = mod(wind_dir + 22.5/2,360); % adds 11.25deg to direction so that, say, N = 348.75 to 11.25
    for j = 1:(length(DirBound) - 1)
        rws = find(udirShift >= DirBound(j) & udirShift < DirBound(j + 1));
        WindDirBin(rws) = j;
        WindTiBin(j,i) = median(ti(rws));
        z0effBin(j,i) = median(z0eff(rws));
    end
%     
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    % Plotting data
    plot_time_step = 24; % plotting time step in hours
    tm_step = plot_time_step/24; % conversion of time step to a daily ratio
    time_min = datenum('2017-03-26 12:00:00',datetimeformat); %min(min(time),min(wind_time));
    time_max = datenum('2017-03-29 24:00:00',datetimeformat); %max(max(time),max(wind_time));
    
    figure(1)
    % 10 minute data
    subplot(3,2,1)
    plot(wind_time,wind_speed,'-b')
    hold on
    plot(wind_time,wind_speed_max,'-r')
    xlabel('Time')
    ylabel('V3,600 [m/s]')
    ylim([0 30])
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    legend('V600','V3,600','Location','Best')
    title('Wind Speed Obs (z=3m)')
    hold off
    
    subplot(3,2,2)
    plot(wind_time,wind_dir_max,'b-')
    hold
    %plot(wind_time,wind_dir_max,'r+')
    xlabel('Time')
    ylabel('Wind direction [degrees]')
    ylim([0 360])
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    %legend('Mean','Max gust','Location','Best')
    title('Wind Direction Obs (z=3m)')
    text(time_min - (time_max - time_min)/2.5,450,['TC ' tc_name ' - Tower ' num2str(twr_num)],'FontWeight','bold');
%     text(time_min - (time_max - time_min)/1.25,450,['TC ' tc_name ' - Tower '...
%         num2str(twr_num) '; Plot start time: ' datestr(time_min)]);  % this is the overall figure title
    hold off
    
%     subplot(4,2,3)
%     plot(wind_time,gf_theo,'-b') 
%     hold
%     plot(wind_time,gf,'+r')
%     xlabel('Time')
%     ylabel('G3,600')
%     set(gca,'XTick',[min(wind_time):tm_step:max(wind_time)]);
%     datetick('x',15,'keeplimits','keepticks');
%     xlim([time_min time_max]);
%     legend('Theoretical','Observed','Location','Best')
%     title('Gust Factors (z=3m)')
%     hold off
%     
%     subplot(4,2,4)
%     plot(wind_time,mean_open,'-b')
%     hold
%     plot(wind_time,gust_open,'+r')
%     xlabel('Time')
%     ylabel('Wind speed [m/s]')
%     set(gca,'XTick',[min(wind_time):tm_step:max(wind_time)]);
%     datetick('x',15,'keeplimits','keepticks');
%     xlim([time_min time_max]);
%     legend('Mean (V600)','Max gust (V3,600)','Location','Best')
%     title('Wind Speed (z=10m, z0=0.02m)')
%     hold off
    
    subplot(3,2,3)
    plot(time,temp_avg,'-b')
    xlabel('Time')
    ylabel('Temperature [degrees C]')
    hold
    ylim([20 35])
    plot(time,temp_max,'-r')
    plot(time,temp_min,'-g')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    legend('Mean','Maximum','Minimum','Location','Best')
    title('Atmospheric Temperature')
    hold off
    
    subplot(3,2,4)
    plot(time,rh_avg,'-b')
    xlabel('Time')
    ylabel('Relative humidity [%]')
    hold
    ylim([50 100])
    plot(time,rh_max,'-r')
    plot(time,rh_min,'-g')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    legend('Mean','Maximum','Minimum','Location','Best')
    title('Relative Humidity')
    hold off
    
    subplot(3,2,5)
    plot(time,press,'b-')
    xlabel('Time')
    ylabel('Pressure [hPa]')
    ylim([990 1015])
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    title('Atmospheric Pressure')
    
    subplot(3,2,6)
    plot(time,battery_volt,'-b')
    xlabel('Time')
    ylabel('Voltage [V]; Board Temp [C]')
    hold
    plot(time,board_temp,'-r')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim([time_min time_max]);
    legend('Battery voltage','Board temp','Location','Best')
    title('Unit Diagnostics')
    hold off
    
    fig = gcf;
    fig.PaperUnits = 'centimeters';
    fig.PaperPosition = [0 0 30 20];
    fig1name = [savefiledirprivate 'Diagnostic_T' num2str(twr_num)];
    print(fig1name,'-dpng','-r300')
    tm_text = [mat2str(day(now)) mat2str(month(now)) mat2str(hour(now)) mat2str(minute(now))];
    %print([savefiledirarchive 'Diagnostic_T' num2str(twr_num) '_' tm_text],'-dpng','-r300')
    
    
    % 10 minute data
    
    % Wind speed & direction
    figure(2)
    [hAx,hLine1,hLine2] = plotyy([wind_time wind_time],[wind_speed/kmh_to_mps (wind_speed_max)/kmh_to_mps],wind_time,wind_dir);
    hold
    hLine1(1).LineStyle = '-';
    hLine1(1).Color = 'k';
    hLine1(1).LineWidth = 1.0;
    hLine1(2).LineStyle = '-';
    hLine1(2).Color = 'r';
    hLine1(2).LineWidth = 1.0;
    hLine2.Color = 'k';
    hLine2.LineStyle = 'none';
    hLine2.Marker = '.';
    set(hAx(1),'ycolor','k')
    set(hAx(2),'ycolor','k')
    ylim(hAx(1),[0 150])
    set(hAx(1),'YTick',0:25:150)
    ylim(hAx(2),[0 360])
    set(hAx(2),'YTick',0:60:360)
    grid on
    grid minor
    xlabel('Time')
    ylabel(hAx(1),'Wind speed [km/h]')
    ylabel(hAx(2),'Direction')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim(hAx(1),[time_min time_max]);
    xlim(hAx(2),[time_min time_max]);
    legend('10-min Mean','Max 3-sec gust','Direction')
    title(['TC ' tc_name ', - SWIRLnet T' num2str(twr_num)])
    text(time_max-28/24,-13,'\it{Source: CTS(JCU), WiRL(UQ)}');  %-3
    text(time_min+1/24,137,['Max gust = ' num2str(round(max(wind_speed_max)/kmh_to_mps,1)) ' km/h'])  %28
    hold off
    fig = gcf;
    fig.PaperUnits = 'centimeters';
    fig.PaperPosition = [0 0 16 12];
    fig1name = [savefiledirpublic 'WindSpeedDir_T' num2str(twr_num)];
    %print(fig1name,'-dpng','-r300')
    %print([savefiledirarchive 'WindSpeedDir_T' num2str(twr_num) '_' tm_text],'-dpng','-r300')
    
    % Wind speed & pressure
    figure(3)
    [hhAx,hhLine1,hhLine2] = plotyy(wind_time,wind_speed/kmh_to_mps,wind_time,press);
    hold
    hhLine1(1).LineStyle = '-';
    hhLine1(1).Color = 'k';
    hhLine1(1).LineWidth = 1.0;
    hhLine2.Color = 'b';
    hhLine2.LineStyle = '-';
    hhLine2.LineWidth = 1.0;
    set(hhAx(1),'ycolor','k')
    set(hhAx(2),'ycolor','k')
    ylim(hhAx(1),[0 150])
    set(hhAx(1),'YTick',0:25:150)
    ylim(hhAx(2),[960 1020])
    set(hhAx(2),'YTick',960:10:1020)
    grid on
    grid minor
    xlabel('Time')
    ylabel(hhAx(1),'Wind speed [km/h]')
    ylabel(hhAx(2),'Pressure [hPa]')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim(hhAx(1),[time_min time_max]);
    xlim(hhAx(2),[time_min time_max]);
    legend('10-min mean wind','1-min mean pressure')
    title(['TC ' tc_name ', - SWIRLnet T' num2str(twr_num)])
    text(time_max-28/24,-13,'\it{Source: CTS(JCU), WiRL(UQ)}');
    text(time_min+1/24,137,['Min pressure = ' num2str(min(press)) ' hPa'])
    hold off
    fig = gcf;
    fig.PaperUnits = 'centimeters';
    fig.PaperPosition = [0 0 16 12];
    fig2name = [savefiledirpublic 'WindSpeedPress_T' num2str(twr_num)];
    %print(fig2name,'-dpng','-r300')
    %print([savefiledirarchive 'WindSpeedPress_T' num2str(twr_num) '_' tm_text],'-dpng','-r300')
    
    % Wind speed & direction
    figure(4)
    [nAx,nLine1,nLine2] = plotyy([wind_time wind_time wind_time wind_time wind_time],[wind_speed wind_speed_max ubar2 uhat2_3Mod uhat2_02Mod],wind_time,wind_dir);
    hold
    nLine1(1).LineStyle = '--';
    nLine1(1).Color = 'k';
    nLine1(1).LineWidth = 1.0;
    nLine1(2).LineStyle = '--';
    nLine1(2).Color = 'r';
    nLine1(2).LineWidth = 1.0;
    nLine1(3).LineStyle = '-';
    nLine1(3).Color = 'k';
    nLine1(3).LineWidth = 1.0;
    nLine1(4).LineStyle = '-';
    nLine1(4).Color = 'r';
    nLine1(4).LineWidth = 1.0;
    nLine1(5).LineStyle = '-';
    nLine1(5).Color = 'b';
    nLine1(5).LineWidth = 1.0;
    nLine2.Color = 'k';
    nLine2.LineStyle = 'none';
    nLine2.Marker = '.';
    set(nAx(1),'ycolor','k')
    set(nAx(2),'ycolor','k')
    ylim(nAx(1),[0 78])
    set(nAx(1),'YTick',0:13:78)
    ylim(nAx(2),[0 360])
    set(nAx(2),'YTick',0:60:360)
    grid on
    grid minor
    xlabel('Time')
    ylabel(nAx(1),'Wind speed [m/s]')
    ylabel(nAx(2),'Direction')
    set(gca,'XTick',time_min:tm_step:time_max);
    datetick('x','dd/mm HH:MM','keeplimits','keepticks');
    xlim(nAx(1),[time_min time_max]);
    xlim(nAx(2),[time_min time_max]);
    legend('U_{M,600}','U_{M,3,600}','U_{600}','U_{3,600}',...
        'U_{0.2,600}','Direction','location','northwest')
    title(['TC ' tc_name ', - SWIRLnet T' num2str(twr_num)])
    %text(time_max-29/24,-5,'\it{Source: CTS(JCU), WiRL(UQ)}');  %-3
    %text(time_min+1/24,40,['Max gust = ' num2str(round(max(wind_speed_max),1)) ' m/s'])  %28
    hold off
    fig = gcf;
    fig.PaperUnits = 'centimeters';
    fig.PaperPosition = [0 0 16 12];
    fig1name = [savefiledirpublic 'WindSpeedDir_T' num2str(twr_num)];
    %print(['WindSpeedAdjust2_T' num2str(twr_num)],'-dpng','-r300')
    
    max_table(i,:) = [max(wind_speed) max(wind_speed_max) max(ubar2) max(uhat2_3) max(uhat2_02) max(uhat2_02)/69.3 max(uhat2_3Mod) max(uhat2_02Mod) max(uhat2_02Mod)/69.3];
    
    % Text data
    output_data(i) = {[wind_speed wind_speed_max ubar2 uhat2_3Mod wind_dir ti press]};
%     output_data_header = {'Local Time' , '10-min Mean Wind [m/s]' , '3-sec Gust Wind [m/s]' ,...
%        'Standardised 10-min Mean Wind [m/s]' , 'Standardised 3-sec Gust Wind [m/s]' ,...
%        'Mean Wind Direction' , 'Turbulence Intensity' , 'Pressure [hPa]'};
%     dataoutname = [savefiledirpublic 'RiskFrontiers_SummaryData_T' num2str(twr_num) '.xlsx'];
%     output_data_cellarray = [output_data_header ; [cellstr(datestr(wind_time)) num2cell(output_data{i})]];
%     xlswrite(dataoutname,output_data_cellarray);
%     xlswrite([savefiledirarchive 'SummaryData_T' num2str(twr_num) '_' tm_text '.xlsx'],output_data_cellarray);

end

% Max data
% rw = find(wind_speed_max==max(wind_speed_max));
% max_wind = max(wind_speed_max);
% max_wind_time = wind_speed_max_time(rw);
% max_wind_dir = wind_dir_max(rw);
% min_press = min(press);
% disp('V3,600 max     Direction   Press')
% disp([max_wind max_wind_dir min_press])






