% Function to modify measured variance and peak factors for anemometer
% response and sampling filters (i.e. smoothing due to gust averaging)

function [g_mech,g_nomech,g_ratio,sig_ratio] = InstrumentResponseFilt(dist,T,t,U,Lu)

% Constants
% dist        - Distance constant [m]
% T           - Mean average block time [s]
% t           - gust duration, 1/sample frequency (= 0.1s when dealing with raw SWIRLnet data)
% U           - Mean along wind velocity [m/s]
% z           - Elevation of anemometer [m] - used only when Tu is assumed dependent on z
% Lu          - Integral length scale [m] - 85 m is used in 1170.2 for 10m open terrain 

f = 1e-4:1e-4:10; % frequency vector

% Filter components
H1 = @(f) (1 - (sin(T*pi()*f)./(T*pi()*f)).^2); % Mean averaging filter
H2 = @(f) (sin(t*pi()*f)./(t*pi()*f)).^2; % gust averaging filter
H3 = @(f) (1./(1+(2*pi()*f*dist/U).^2)); % Mechanical filtering
chisq = @(f) H1(f).*H2(f).*H3(f);
%chisq(1) = 1;
chisq_nomech = @(f) H1(f).*H2(f); % filter function without mechanical filtering
%chisq_nomech(1) = 1;

% Determine influence on peak factor

% von Karmen spectra (from Balderrama et al 2012 - based on ESDU)
%Tu = 3.13*z^0.2; % This is used in Balderrama and ESDU (I think)
Tu = Lu/U; % This requires input of the length scale
suu = @(f) (4*Tu)./(1+70.8.*(f*Tu).^2).^(5/6); % this is the unit variance PSD

% Peak factor with mechanical filtering
nu_t = @(f) f.^2.*suu(f).*chisq(f); % numerator
nu_b = @(f) suu(f).*chisq(f); % denominator
nu2 = integral(nu_t,0,max(f))/integral(nu_b,0,max(f));
nu = sqrt(nu2); % mean cycling rate
sigmaratio = sqrt(integral(nu_b,0,max(f))/integral(suu,0,max(f))); % stdev ratio
g_mech = (sqrt(2*log(nu*T)) + 0.5772/sqrt(2*log(nu*T))).*sigmaratio;

% Peak factor without mechanical filtering
nu_t_nomech = @(f) f.^2.*suu(f).*chisq_nomech(f); % numerator
nu_b_nomech = @(f) suu(f).*chisq_nomech(f); % denominator
nu2_nomech = integral(nu_t_nomech,0,max(f))/integral(nu_b_nomech,0,max(f));
nu_nomech = sqrt(nu2_nomech); % mean cycling rate
sigmaratio_nomech = sqrt(integral(nu_b_nomech,0,max(f))/integral(suu,0,max(f))); % stdev ratio
g_nomech = (sqrt(2*log(nu_nomech*T)) +...
    0.5772/sqrt(2*log(nu_nomech*T))).*sigmaratio_nomech;

% Peak factor and st dev ratios
g_ratio = g_nomech/g_mech; % Ratio of g with no mechanical filtering to what will have been recorded by an anemometer with mechanical filtering
sig_ratio = 1./sigmaratio; % Standard deviation ratio - This is influenced by both mechanical filtering and gust duration