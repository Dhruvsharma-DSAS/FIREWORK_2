import math
import numpy as np
import pymannkendall as mk
import ruptures as rpt
import statsmodels.api as sm
from accuracy_tools import (clear_sky_rate, empirical_bayes_log_ratio, fit_power_law, aic_gaussian,
                            detection_curve, quantile_map, pettitt, benjamini_hochberg, kalman_fuse,
                            diurnal_fraction_seen, bland_altman, split_conformal_sets, block_bootstrap_years)

rng = np.random.default_rng(2026)
report = {}

assert clear_sky_rate(30, 600) == 0.05
assert clear_sky_rate(5, 0) is None
report["rate_cloudy_vs_clear"] = (round(30 / 600, 3), round(30 / 300, 3))

true_log_k = [0.92, 0.85, 1.10, 0.70, 0.95]
data = []
for i, lk in enumerate(true_log_k):
    n = 2 if i == 2 else 12
    data.append(list(lk + rng.normal(0, 0.35, n)))
grand, tau2, shrunk, weights = empirical_bayes_log_ratio(data)
raw_means = [sum(d) / len(d) for d in data]
assert weights[2] < min(weights[0], weights[1], weights[3], weights[4])
err_raw = sum(abs(r - t) for r, t in zip(raw_means, true_log_k))
err_eb = sum(abs(s - t) for s, t in zip(shrunk, true_log_k))
report["eb_error_raw_vs_shrunk"] = (round(err_raw, 3), round(err_eb, 3))
report["eb_weights"] = [round(w, 2) for w in weights]

modis = rng.uniform(20, 400, 40)
viirs = 4.0 * modis ** 0.85 * np.exp(rng.normal(0, 0.08, 40))
a, b = fit_power_law(modis, viirs)
assert abs(b - 0.85) < 0.08
ratio = float(np.median(viirs / modis))
res_ratio = np.log(viirs) - np.log(ratio * modis)
res_power = np.log(viirs) - np.log(a * modis ** b)
aic_r = aic_gaussian(res_ratio, 1)
aic_p = aic_gaussian(res_power, 2)
assert aic_p < aic_r
report["power_law"] = (round(a, 2), round(b, 3), round(aic_r, 1), round(aic_p, 1))

years = 14
exposure = rng.integers(2000, 6000, size=2 * years)
sensor = np.array([0] * years + [1] * years)
true_rate = 0.03
lam = exposure * true_rate * np.exp(math.log(2.5) * sensor)
counts = rng.poisson(lam)
X = sm.add_constant(sensor.astype(float))
glm = sm.GLM(counts, X, family=sm.families.Poisson(), offset=np.log(exposure)).fit()
k_glm = math.exp(glm.params[1])
ci = np.exp(glm.conf_int()[1])
assert abs(math.log(k_glm) - math.log(2.5)) < 0.1
report["glm_k"] = (round(k_glm, 3), round(float(ci[0]), 3), round(float(ci[1]), 3))

frp = np.exp(rng.uniform(math.log(0.5), math.log(200), 3000))
p_detect = 1 / (1 + np.exp(-(2.2 * (np.log(frp) - math.log(9.0)))))
detected = rng.random(3000) < p_detect
model, frp50 = detection_curve(frp, detected)
assert abs(frp50 - 9.0) < 1.5
report["frp50"] = round(frp50, 2)

viirs_frp = np.exp(rng.normal(1.5, 1.0, 5000))
modis_frp = np.exp(rng.normal(2.3, 0.9, 5000))
mapped = quantile_map([10.0], modis_frp, viirs_frp)
assert 1.0 < mapped[0] < 10.0
report["qmap_10MW_modis_to_viirs"] = round(mapped[0], 2)

series = list(100 + rng.normal(0, 5, 10)) + list(260 + rng.normal(0, 8, 10))
k_cp, u, p_cp = pettitt(series)
assert k_cp == 10 and p_cp < 0.01
harm = list(100 + rng.normal(0, 5, 20))
k2, u2, p2 = pettitt(harm)
assert p2 > 0.05
algo = rpt.Pelt(model="l2").fit(np.array(series))
bkps = algo.predict(pen=3 * np.var(series[:10]) * 2)
assert 10 in bkps
report["pettitt_raw_vs_harm_p"] = (round(p_cp, 5), round(p2, 3))

pvals = list(rng.uniform(0, 1, 950)) + list(rng.uniform(0, 0.0005, 50))
keep = benjamini_hochberg(pvals, 0.05)
naive = sum(1 for p in pvals if p < 0.05)
bh = sum(keep)
assert bh < naive and bh >= 45
report["fdr_naive_vs_bh"] = (naive, bh)

trend_series = list(300 - 6 * np.arange(20) + rng.normal(0, 15, 20))
res_hr = mk.hamed_rao_modification_test(trend_series)
assert res_hr.trend == "decreasing"
monthly = []
for y in range(15):
    for m in range(12):
        monthly.append(50 + 40 * math.sin(m / 12 * 2 * math.pi) - 1.5 * y + rng.normal(0, 4))
res_s = mk.seasonal_test(monthly, period=12)
assert res_s.trend == "decreasing"
report["mk_hamed_rao_p"] = round(res_hr.p, 6)

truth = 200 + np.cumsum(rng.normal(0, 4, 30))
obs_a = list(truth + rng.normal(0, 20, 30))
obs_b = list(truth + rng.normal(0, 8, 30))
for i in [5, 6, 17]:
    obs_b[i] = None
fused = kalman_fuse(obs_a, obs_b, 400.0, 64.0, 16.0)
levels = np.array([f[0] for f in fused])
rmse_a = float(np.sqrt(np.mean((np.array(obs_a) - truth) ** 2)))
rmse_f = float(np.sqrt(np.mean((levels - truth) ** 2)))
assert rmse_f < rmse_a
report["kalman_rmse_a_vs_fused"] = (round(rmse_a, 2), round(rmse_f, 2))

f2021 = diurnal_fraction_seen(13.0, 1.5, [10.5, 13.5])
f2024 = diurnal_fraction_seen(16.3, 1.3, [10.5, 13.5])
assert f2024 < f2021 / 5
report["diurnal_seen_2021_vs_2024"] = (round(f2021, 3), round(f2024, 4))

bias, lo, hi = bland_altman([100, 120, 90, 150], [250, 300, 230, 370])
report["bland_altman"] = (round(bias, 1), round(lo, 1), round(hi, 1))

cal_probs = []
cal_labels = []
for _ in range(500):
    label = int(rng.integers(0, 3))
    logits = rng.normal(0, 1, 3)
    logits[label] += 2.0
    p = np.exp(logits) / np.exp(logits).sum()
    cal_probs.append(p)
    cal_labels.append(label)
test_probs = [np.array([0.85, 0.1, 0.05]), np.array([0.45, 0.4, 0.15])]
qhat, sets = split_conformal_sets(cal_probs, cal_labels, test_probs, alpha=0.1)
assert sets[0] == [0] and len(sets[1]) >= 2
report["conformal_sets"] = (round(qhat, 3), sets)

by_year = {}
for y in range(2012, 2026):
    by_year[y] = list(2.5 * np.exp(rng.normal(0, 0.1, 6)))
lo_b, hi_b = block_bootstrap_years(by_year, lambda s: float(np.median(s)), 1000, 1)
assert lo_b < 2.5 < hi_b
report["block_boot_k"] = (round(lo_b, 3), round(hi_b, 3))

for k, v in report.items():
    print(k, v)
print("all accuracy tests passed")
