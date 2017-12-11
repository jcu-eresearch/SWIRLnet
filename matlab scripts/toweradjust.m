function [ubar2,uhat2_3,uhat2_02,uhat2_3Mod,uhat2_02Mod] = toweradjust(ubar,sigmau,upeak)

T = 600; % mean averaging time [s]
t1 = 3; % gust averaging time for instrument[s]
z1 = 3.2; % [m] tower height
t2 = 0.2; % [s] reference gust averaging time
z2 = 10; % [m] reference height
z02 = 0.02; % [m] reference roughness
zdelta = 1500; %[m] boundary layer depth
Iu2 = 1/log(z2/z02); % reference turbulence intensity
dist = 2.7; % [m] RM Young distance constant 

Lu1 = 85*(z1/10)^0.25; % [m] Length scale at tower. Based on Eqn 6.2(3) in AS/NZS1170.2
Lu2 = 85*(z2/10)^0.25; % [m] Length scale at reference

% Calculate peak factors (including filter time and instrument response)
for i = 1:length(ubar)
    U = ubar(i);
    [g3600(i,1),g_nomech1,g_ratio1,sig_ratio1(i)] = InstrumentResponseFilt(dist,T,t1,U,Lu1);
    g02600(i,1) = InstrumentResponseFilt(0,T,t2,U,Lu2);
    [g01600(i,1),g_nomech3,g_ratio3,sig_ratio_01(i)] = InstrumentResponseFilt(dist,T,0.1,U,Lu1); % this is reqd because SWIRLnet outputs stdev of raw 10Hz signal
end

% Calculations at the tower
Iu = (sigmau.*sig_ratio_01')./ubar; %%%% need to change sig_ratio if recorded stdev is of gust wind speed time history (ie at intervals of t)
z0eff = z1./exp(1./Iu);

% Calculations of statistical peaks at the reference location
ustar_ratio = log(zdelta./z0eff)./log(zdelta/z02);
ubar_ratio = ustar_ratio.*(log(z2/z02)./log(z1./z0eff));
ubar2 = ubar.*ubar_ratio;
uhat2_3 = ubar2.*(1 + g3600*Iu2);
uhat2_02 = ubar2.*(1 + g02600*Iu2);

% Observation modified statistical peaks at reference location
G = upeak./ubar;
g3600Obs = (G - 1)./Iu;
gRatio = g3600Obs./g3600;
uhat2_3Mod = ubar2.*(1 + g3600.*gRatio*Iu2);
uhat2_02Mod = ubar2.*(1 + g02600.*gRatio*Iu2);