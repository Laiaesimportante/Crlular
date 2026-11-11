#!/usr/bin/env python3
"""Música + diseño sonoro PROVISIONAL generado por código (sin APIs ni bancos de sonido externos).
La voz NO se genera aquí: se produce aparte y se añade (public/audio/voz.mp3 + VOICE_FILE en src/assets.ts).
Lee src/cues.json (sincronizado con las palabras)."""
import json, wave, numpy as np
SR = 44100
cues = json.load(open('src/cues.json'))
T = cues['total']; N = int(T * SR)
rng = np.random.default_rng(7)
mus = np.zeros((2, N)); sfx = np.zeros((2, N))
tt = np.arange(N) / SR

def add(buf, sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    l = gain * (1 - max(0, pan)); r = gain * (1 + min(0, pan))
    buf[0, i:i + len(sig)] += sig * l; buf[1, i:i + len(sig)] += sig * r

def filt(x, kind, f, order=2):
    # filtro por FFT (respuesta tipo Butterworth), sin scipy
    n = len(x); X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR) + 1e-9
    lp = lambda fc: 1 / np.sqrt(1 + (fr / fc) ** (2 * order))
    hp = lambda fc: 1 / np.sqrt(1 + (fc / fr) ** (2 * order))
    H = lp(f) if kind == 'low' else hp(f) if kind == 'high' else hp(f[0]) * lp(f[1])
    return np.fft.irfft(X * H, n)

def noise(d): return rng.standard_normal(int(d * SR))
def env(n, a, rel):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nr = max(1, min(n, int(rel * SR))); e[-nr:] *= np.linspace(1, 0, nr); return e
def saw(f, d, det=0.0):
    t = np.arange(int(d * SR)) / SR
    return sum(2 * ((t * f * (1 + k * det)) % 1) - 1 for k in (-1, 0, 1)) / 3
def sine(f, d, ph=0): return np.sin(2 * np.pi * f * np.arange(int(d * SR)) / SR + ph)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)

def kick(gain=1.0):
    d = 0.32; t = np.arange(int(d * SR)) / SR
    f = 48 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * gain
def hat(open_=False):
    d = 0.18 if open_ else 0.05
    x = filt(noise(d), 'high', 7000); return x * np.exp(-np.arange(len(x)) / SR * (14 if open_ else 70)) * 0.35
def clap():
    x = filt(noise(0.22), 'band', [1200, 3800]); t = np.arange(len(x)) / SR
    e = np.exp(-t * 22) + 0.7 * np.exp(-np.clip(t - 0.012, 0, None) * 30) * (t > 0.012)
    return x * e * 0.5
def pluck(m, d=0.35):
    f = mtof(m); t = np.arange(int(d * SR)) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t * 12)) * np.exp(-t * 9)
    return x * 0.5
def pad(ms, d):
    x = sum(saw(mtof(m), d, 0.0035) for m in ms) / len(ms)
    x = filt(x, 'low', 1800); return x * env(len(x), 0.6, 0.8)

BPM = 120; beat = 60 / BPM; split = cues['tensionEnd']

# ---------- A: tensión (0 → split) ----------
drone = saw(55, split + 0.2, 0.004) * 0.5 + saw(82.4, split + 0.2, 0.006) * 0.25
cuts = [200, 500, 1100, 2400]
vers = [filt(drone, 'low', c, 1) for c in cuts]
u = np.linspace(0, len(cuts) - 1, len(drone))
out = sum(v * np.clip(1 - np.abs(u - i), 0, 1) for i, v in enumerate(vers))
out *= np.linspace(0.35, 0.8, len(out)) * env(len(out), 0.4, 0.15)
add(mus, out, 0, 0, 0.55)
t = 0.0
while t < split - 0.1:
    if t >= 0.5:  # latido de tensión
        add(mus, kick(0.8), t, 0, 0.8 if t > 5 else 0.55)
    if t >= 5.2:  # S2: hats 16avos aceleran
        for k in range(4): add(mus, hat(), t + k * beat / 4, 0.15 * (-1) ** k, 0.5)
    elif t >= 2.0:
        add(mus, hat(), t + beat / 2, 0.2, 0.4)
    t += beat
# riser antes del cambio
ri = filt(noise(split - 9.5 + 0.1), 'band', [400, 9000]) * np.linspace(0, 1, int((split - 9.5 + 0.1) * SR)) ** 2 * 0.5
add(mus, ri, 9.5, 0, 0.6)
# ---------- B: positiva (split → fin) ----------
chords = [[48, 55, 64, 67], [43, 50, 62, 67], [45, 52, 60, 64], [41, 48, 60, 65]]  # C  G  Am  F
bar = 4 * beat; nb = int(np.ceil((T - split) / bar)) + 1
for b in range(nb):
    t0 = split + b * bar; ch = chords[b % 4]
    if t0 >= T: break
    add(mus, pad(ch + [ch[0] + 12], min(bar * 1.05, T - t0 + 0.5)), t0, 0, 0.30)
    add(mus, filt(saw(mtof(ch[0] - 12), bar * 0.95), 'low', 300) * env(int(bar * 0.95 * SR), 0.02, 0.2), t0, 0, 0.55)
    for k in range(8):  # arpegio en 8vos
        add(mus, pluck(ch[(k % 4)] + 24 if k % 4 else ch[1] + 12), t0 + k * beat / 2, 0.3 * (-1) ** k, 0.28)
    for k in range(4):
        add(mus, kick(0.9), t0 + k * beat, 0, 0.55 if t0 < split + 3.5 else 0.8)
        add(mus, hat(True), t0 + k * beat + beat / 2, 0.2, 0.32)
        if k in (1, 3) and t0 > split + 3: add(mus, clap(), t0 + k * beat, 0, 0.5)
# cola: resolución suave al final
mus *= np.interp(tt, [0, 0.01, T - 1.4, T], [0.0, 1, 1, 0.0])[None]

# ---------- SFX sincronizados ----------
for h in cues['hits']:
    d = 0.7; t = np.arange(int(d * SR)) / SR
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t * 14)) * t) * np.exp(-t * 5)
    add(sfx, boom * 0.95 + filt(noise(d), 'low', 2500) * np.exp(-t * 18) * 0.5, h, 0, 1.0)
for w in cues['whooshes']:
    d = 0.7; n = int(d * SR); x = noise(d); u = np.linspace(0, 1, n)
    bands = [([150, 700], 0.25), ([600, 2500], 0.5), ([2200, 9000], 0.75)]
    y = sum(filt(x, 'band', fb, 1) * np.exp(-((u - c) / 0.17) ** 2) for fb, c in bands)
    add(sfx, y * 1.6, w - 0.15, rng.uniform(-0.6, 0.6), 0.9)
for p in cues['paper']:
    n = int(rng.uniform(0.09, 0.2) * SR); x = filt(noise(n / SR), 'band', [1800, 7000]) * env(n, 0.004, 0.12) * (0.5 + 0.5 * rng.random(n))
    add(sfx, x * 0.9, p, rng.uniform(-0.7, 0.7), 0.8)
for c in cues['clicks'] + cues['typing']:
    n = int(0.03 * SR); tt2 = np.arange(n) / SR
    add(sfx, (np.sin(2 * np.pi * 2400 * tt2) * 0.5 + filt(noise(0.03), 'high', 3000) * 0.5) * np.exp(-tt2 * 160), c, 0, 0.8)
for d_ in cues['dings']:
    t = np.arange(int(1.0 * SR)) / SR
    add(sfx, (np.sin(2 * np.pi * 1568 * t) + 0.6 * np.sin(2 * np.pi * 2093 * t)) * np.exp(-t * 5) * 0.4, d_, 0, 0.9)

# ---------- mezcla: la música queda BAJA para que la voz (aparte) siempre la supere ----------
mus = np.tanh(mus * 0.9); mus *= 0.30 / max(1e-6, np.abs(mus).max()) * 1.0   # pico ≈ -10 dBFS
sfx *= 0.55 / max(1e-6, np.abs(sfx).max())
mix = mus + sfx; mix *= 0.89 / max(1.0, np.abs(mix).max())
pcm = (np.clip(mix, -1, 1).T * 32767).astype('<i2')
with wave.open('public/audio/musica_sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', T, 's, pico', float(np.abs(mix).max()))
