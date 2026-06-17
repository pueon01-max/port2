const REWARDS = [
  { icon: "🧋", name: "Free Upgrade", sub: "Any drink, any size", valid: "Valid for 7 days" },
  { icon: "☕", name: "Buy 1 Get 1", sub: "Any latte or cappuccino", valid: "Valid for 3 days" },
  { icon: "🍵", name: "Free Matcha Latte", sub: "Regular · hot or iced", valid: "Valid for 5 days" },
  { icon: "🥤", name: "50% Off Any Drink", sub: "One use · all sizes", valid: "Valid today only" },
  { icon: "🍫", name: "Free Add-On", sub: "Extra shot or syrup", valid: "Valid for 14 days" },
  { icon: "🎁", name: "Mystery Reward", sub: "Surprise on next order", valid: "Valid for 2 days" }
];

let brewRaf = null;
let revealRaf = null;
let revealTimer = null;

const tapBtn = document.getElementById("tapBtn");
const claimBtn = document.getElementById("claimBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");

tapBtn.addEventListener("click", brew);
tapBtn.addEventListener("touchend", event => {
  event.preventDefault();
  brew();
});

claimBtn.addEventListener("click", goShare);
tryAgainBtn.addEventListener("click", tryAgain);

function go(id) {
  document.querySelectorAll(".scr").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  const dark = id === "s2";
  const color = dark ? "rgba(255,255,255,.9)" : "#0b1680";

  document.getElementById("nd1").setAttribute("fill", color);
  document.getElementById("nd2").setAttribute("fill", color);
  document.getElementById("navTxt").style.color = color;
  document.getElementById("navLang").style.color = dark ? "rgba(255,255,255,.5)" : "#7080b8";
  document.getElementById("navRing").style.borderColor = color;
}

function brew() {
  clearTimeout(revealTimer);
  cancelAnimationFrame(brewRaf);
  cancelAnimationFrame(revealRaf);

  go("s2");
  runBrewCanvas();

  revealTimer = setTimeout(reveal, 3000);
}

function runBrewCanvas() {
  const canvas = document.getElementById("brewCvs");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2 + 35;
  let t = 0;

  const rings = [
    { rx: 60, ry: 24, spd: .016, br: .75 },
    { rx: 115, ry: 46, spd: .016, br: .62 },
    { rx: 178, ry: 71, spd: .016, br: .48 },
    { rx: 250, ry: 100, spd: .016, br: .35 },
    { rx: 332, ry: 133, spd: .016, br: .24 },
    { rx: 424, ry: 170, spd: .016, br: .15 },
    { rx: 526, ry: 210, spd: .016, br: .09 }
  ];

  function frame() {
    ctx.fillStyle = "rgb(12,28,176)";
    ctx.fillRect(0, 0, W, H);

    const pool = ctx.createRadialGradient(cx, cy, 0, cx, cy, 155);
    pool.addColorStop(0, "rgba(55,95,255,.26)");
    pool.addColorStop(.5, "rgba(38,68,210,.1)");
    pool.addColorStop(1, "rgba(12,28,176,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, W, H);

    rings.forEach((ring, index) => {
      const phase = ((t * ring.spd - index * .52) % 4 + 4) % 4;
      const scale = .28 + phase * .185;
      let alpha = ring.br * (1 - phase / 4) * Math.sin(phase / 4 * Math.PI) * 1.9;
      alpha = Math.max(0, Math.min(1, alpha));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const gradient = ctx.createLinearGradient(0, -ring.ry, 0, ring.ry);
      gradient.addColorStop(0, `rgba(160,210,255,${alpha})`);
      gradient.addColorStop(.35, `rgba(110,170,255,${alpha * .7})`);
      gradient.addColorStop(.5, `rgba(80,140,235,${alpha * .5})`);
      gradient.addColorStop(.65, `rgba(110,170,255,${alpha * .7})`);
      gradient.addColorStop(1, `rgba(160,210,255,${alpha})`);

      ctx.beginPath();
      ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2 / scale;
      ctx.stroke();
      ctx.restore();
    });

    const fast = ((t * .026) % 4 + 4) % 4;
    const fScale = .28 + fast * .185;
    let fAlpha = .95 * (1 - fast / 4) * Math.sin(fast / 4 * Math.PI) * 1.9;
    fAlpha = Math.max(0, Math.min(1, fAlpha));

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(fScale, fScale);
    ctx.beginPath();
    ctx.ellipse(0, 0, 54, 21, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(220,240,255,${fAlpha})`;
    ctx.lineWidth = 3 / fScale;
    ctx.stroke();
    ctx.restore();

    for (let j = 0; j < 24; j++) {
      const angle = (j / 24) * Math.PI * 2 + t * .025;
      const d1 = 44 + Math.sin(t * .18 + j * 1.1) * 14;
      const d2 = 108 + Math.sin(t * .14 + j * .9) * 24;
      const x1 = cx + Math.cos(angle) * d1 * 2.55;
      const y1 = cy + Math.sin(angle) * d1 * .58;
      const x2 = cx + Math.cos(angle) * d2 * 2.55;
      const y2 = cy + Math.sin(angle) * d2 * .58;
      const lineAlpha = .042 + Math.abs(Math.sin(t * .28 + j * .85)) * .06;

      const lineGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      lineGradient.addColorStop(0, "rgba(140,195,255,0)");
      lineGradient.addColorStop(.45, `rgba(160,210,255,${lineAlpha})`);
      lineGradient.addColorStop(1, "rgba(140,195,255,0)");

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    t += .9;
    brewRaf = requestAnimationFrame(frame);
  }

  frame();
}

function reveal() {
  cancelAnimationFrame(brewRaf);

  const reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];

  document.getElementById("gIcon").textContent = reward.icon;
  document.getElementById("gName").textContent = reward.name;
  document.getElementById("gSub").textContent = reward.sub;
  document.getElementById("gValid").textContent = reward.valid;

  createSparks();

  const card = document.getElementById("gCard");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";

  go("s3");
  runRevealCanvas();
}

function createSparks() {
  const sparksEl = document.getElementById("sparksEl");
  sparksEl.innerHTML = "";

  const sparks = [
    { t: "9%", l: "3%", dx: "-16px", dy: "-22px", w: 7, dur: "2.1s", del: "0s", col: "255,255,255" },
    { t: "6%", l: "84%", dx: "14px", dy: "-18px", w: 5, dur: "2.4s", del: ".28s", col: "200,220,255" },
    { t: "78%", l: "5%", dx: "-12px", dy: "18px", w: 6, dur: "2s", del: ".62s", col: "255,255,255" },
    { t: "74%", l: "88%", dx: "16px", dy: "14px", w: 4, dur: "2.3s", del: "1s", col: "200,220,255" },
    { t: "42%", l: "95%", dx: "18px", dy: "-8px", w: 5, dur: "2.1s", del: ".46s", col: "255,255,255" },
    { t: "22%", l: "1%", dx: "-14px", dy: "-10px", w: 4, dur: "1.9s", del: ".9s", col: "200,220,255" },
    { t: "92%", l: "50%", dx: "0px", dy: "20px", w: 5, dur: "2.2s", del: "1.25s", col: "255,255,255" },
    { t: "12%", l: "54%", dx: "6px", dy: "-22px", w: 6, dur: "1.8s", del: ".18s", col: "200,220,255" },
    { t: "56%", l: "52%", dx: "-9px", dy: "-16px", w: 3, dur: "2.5s", del: ".7s", col: "255,255,255" }
  ];

  sparks.forEach(spark => {
    const el = document.createElement("div");
    el.className = "spk";
    el.style.cssText = `
      top:${spark.t};
      left:${spark.l};
      width:${spark.w}px;
      height:${spark.w}px;
      background:rgba(${spark.col},.92);
      --dx:${spark.dx};
      --dy:${spark.dy};
      --dur:${spark.dur};
      --del:${spark.del};
      animation-duration:${spark.dur};
      animation-delay:${spark.del};
    `;
    sparksEl.appendChild(el);
  });
}

function runRevealCanvas() {
  const canvas = document.getElementById("revealCvs");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H * .62;
  let t = 0;

  const motes = [];
  for (let i = 0; i < 45; i++) {
    motes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + .4,
      vx: (Math.random() - .5) * .22,
      vy: -Math.random() * .3 - .05,
      a: Math.random() * .3 + .06,
      life: Math.random()
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < 6; i++) {
      const phase = ((t * .01 - i * .52) % 4 + 4) % 4;
      const scale = .32 + phase * .17;
      let alpha = .38 * (1 - phase / 4) * Math.sin(phase / 4 * Math.PI) * 1.9;
      alpha = Math.max(0, Math.min(.5, alpha));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.ellipse(0, 0, 90 + i * 24, 36 + i * 10, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(37,80,216,${alpha})`;
      ctx.lineWidth = 1.6 / scale;
      ctx.stroke();
      ctx.restore();
    }

    motes.forEach(mote => {
      mote.life += .0028;

      if (mote.life > 1) {
        mote.life = 0;
        mote.x = Math.random() * W;
        mote.y = H + 4;
      }

      mote.x += mote.vx;
      mote.y += mote.vy;

      const fade = Math.sin(mote.life * Math.PI) * mote.a;

      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80,130,230,${Math.max(0, fade)})`;
      ctx.fill();
    });

    t++;
    revealRaf = requestAnimationFrame(frame);
  }

  frame();
}

function tryAgain() {
  cancelAnimationFrame(revealRaf);
  brew();
}

function goShare() {
  cancelAnimationFrame(revealRaf);
  go("s4");
}

window.addEventListener("resize", () => {
  ["brewCvs", "revealCvs"].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});

document.addEventListener("touchmove", event => {
  event.preventDefault();
}, { passive: false });
