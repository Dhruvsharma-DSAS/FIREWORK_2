import math
import numpy as np


def clear_sky_rate(fire_cell_days, clear_cell_days):
    if clear_cell_days == 0:
        return None
    return fire_cell_days / clear_cell_days


def empirical_bayes_log_ratio(log_ratios_by_region):
    region_means = []
    region_vars = []
    for values in log_ratios_by_region:
        n = len(values)
        mean = sum(values) / n
        if n > 1:
            var = sum((v - mean) ** 2 for v in values) / (n - 1)
        else:
            var = 0.25
        region_means.append(mean)
        region_vars.append(var / n)
    grand = sum(region_means) / len(region_means)
    spread = sum((m - grand) ** 2 for m in region_means) / (len(region_means) - 1)
    avg_noise = sum(region_vars) / len(region_vars)
    tau2 = spread - avg_noise
    if tau2 < 1e-6:
        tau2 = 1e-6
    shrunk = []
    weights = []
    for m, v in zip(region_means, region_vars):
        w = tau2 / (tau2 + v)
        shrunk.append(grand + w * (m - grand))
        weights.append(w)
    return grand, tau2, shrunk, weights


def fit_power_law(modis, viirs):
    x = np.log(np.array(modis, dtype=float))
    y = np.log(np.array(viirs, dtype=float))
    b, log_a = np.polyfit(x, y, 1)
    return math.exp(log_a), b


def aic_gaussian(residuals, n_params):
    r = np.array(residuals, dtype=float)
    n = len(r)
    rss = float(np.sum(r ** 2))
    return n * math.log(rss / n) + 2 * n_params


def detection_curve(frp_values, detected_flags):
    from sklearn.linear_model import LogisticRegression
    x = np.log(np.array(frp_values, dtype=float)).reshape(-1, 1)
    y = np.array(detected_flags, dtype=int)
    model = LogisticRegression()
    model.fit(x, y)
    slope = float(model.coef_[0][0])
    intercept = float(model.intercept_[0])
    frp50 = math.exp(-intercept / slope)
    return model, frp50


def quantile_map(values, source_sample, target_sample):
    source_sorted = np.sort(np.array(source_sample, dtype=float))
    target_sorted = np.sort(np.array(target_sample, dtype=float))
    out = []
    for v in values:
        rank = np.searchsorted(source_sorted, v, side="right") / len(source_sorted)
        if rank > 1:
            rank = 1.0
        out.append(float(np.quantile(target_sorted, rank)))
    return out


def pettitt(series):
    x = list(series)
    n = len(x)
    best_k = 0
    best_u = 0
    for k in range(1, n):
        u = 0
        for i in range(k):
            for j in range(k, n):
                diff = x[j] - x[i]
                if diff > 0:
                    u = u + 1
                elif diff < 0:
                    u = u - 1
        if abs(u) > abs(best_u):
            best_u = u
            best_k = k
    p = 2 * math.exp(-6 * best_u ** 2 / (n ** 3 + n ** 2))
    if p > 1:
        p = 1.0
    return best_k, best_u, p


def benjamini_hochberg(p_values, alpha=0.05):
    m = len(p_values)
    order = sorted(range(m), key=lambda i: p_values[i])
    cutoff_rank = 0
    for rank, idx in enumerate(order, start=1):
        if p_values[idx] <= alpha * rank / m:
            cutoff_rank = rank
    keep = [False] * m
    for rank, idx in enumerate(order, start=1):
        if rank <= cutoff_rank:
            keep[idx] = True
    return keep


def kalman_fuse(obs_a, obs_b, var_a, var_b, var_process):
    level = None
    p = 1e6
    out = []
    for a, b in zip(obs_a, obs_b):
        if level is None:
            if a is not None:
                level = a
            else:
                level = b
        p = p + var_process
        for value, var in [(a, var_a), (b, var_b)]:
            if value is not None:
                gain = p / (p + var)
                level = level + gain * (value - level)
                p = (1 - gain) * p
        out.append((level, p))
    return out


def diurnal_fraction_seen(peak_hour, width_hours, overpass_hours, window_hours=0.5):
    hours = np.linspace(0, 24, 24 * 60 + 1)
    curve = np.exp(-((hours - peak_hour) ** 2) / (2 * width_hours ** 2))
    total = float(np.trapezoid(curve, hours))
    seen = 0.0
    for h in overpass_hours:
        mask = (hours >= h - window_hours) & (hours <= h + window_hours)
        seen = seen + float(np.trapezoid(curve[mask], hours[mask]))
    return seen / total


def bland_altman(a, b):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    diff = b - a
    bias = float(np.mean(diff))
    sd = float(np.std(diff, ddof=1))
    return bias, bias - 1.96 * sd, bias + 1.96 * sd


def split_conformal_sets(cal_probs, cal_labels, test_probs, alpha=0.1):
    scores = []
    for probs, label in zip(cal_probs, cal_labels):
        scores.append(1 - probs[label])
    n = len(scores)
    level = math.ceil((n + 1) * (1 - alpha)) / n
    if level > 1:
        level = 1.0
    qhat = float(np.quantile(scores, level, method="higher"))
    sets = []
    for probs in test_probs:
        chosen = []
        for k, pk in enumerate(probs):
            if 1 - pk <= qhat:
                chosen.append(k)
        sets.append(chosen)
    return qhat, sets


def block_bootstrap_years(values_by_year, statistic, n_boot=2000, seed=0):
    rng = np.random.default_rng(seed)
    years = list(values_by_year.keys())
    results = []
    for _ in range(n_boot):
        picked = rng.choice(years, size=len(years), replace=True)
        sample = []
        for y in picked:
            sample.extend(values_by_year[y])
        results.append(statistic(sample))
    return float(np.percentile(results, 5)), float(np.percentile(results, 95))
