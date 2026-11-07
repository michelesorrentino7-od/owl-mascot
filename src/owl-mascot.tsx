/**
 * OwlMascot — pose-based page companion with cursor tracking and reactions.
 *
 * Drop <OwlMascot /> once, near the end of the page.
 * Mark seats with data-seat (and optional data-seat-edge="top|right|bottom").
 * The owl starts on [data-seat="mast"] if present, otherwise the first seat.
 *
 * Uses 3x3 directions sheet for gaze tracking while sitting.
 * Reactions sheet for click feedback. Individual poses for flight cycle.
 * Canvas is 700×800, feet at y=740. The component anchors there so size stays constant.
 */

import { useEffect, useRef, useState } from "react";

const POSES = ["perch", "look-left", "look-right", "alert", "takeoff", "flight", "landing"] as const;
type Pose = (typeof POSES)[number];

const SRC_W = 700;
const SRC_H = 800;
const FEET = 740;

function seatPoint(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const edge = el.dataset.seatEdge || "top";
  if (edge === "right") return { x: r.right - 8, y: r.top + r.height * 0.4 };
  if (edge === "bottom") return { x: r.right - 56, y: r.bottom - 2 };
  return { x: r.left + Math.min(r.width * 0.62, r.width - 36), y: r.top + 1 };
}

function seatVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.top >= -20 && r.top < window.innerHeight - 140 && r.right > 40 && r.left < window.innerWidth - 40;
}

function cornerSeat() {
  return { x: window.innerWidth - 72, y: window.innerHeight - 24 };
}

export function OwlMascot() {
  const rigRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hop = useRef(() => {});
  const [pose, setPose] = useState<Pose>("perch");
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let running = true;
    let frame = 0;

    const first =
      document.querySelector<HTMLElement>('[data-seat="mast"]') ||
      document.querySelector<HTMLElement>("[data-seat]");
    const start = first ? seatPoint(first) : { x: 120, y: 48 };
    let x = start.x;
    let y = start.y;
    let vx = 0;
    let vy = 0;
    let tx = x;
    let ty = y;
    let seat: HTMLElement | null = first;
    let flying = false;
    let mode: "sit" | "takeoff" | "fly" | "land" = "sit";
    let modeT = 0;
    let boredAt = performance.now() + 16000;
    let hopT = -1;
    let reactionUntil = 0;
    let idleLookAt = performance.now() + 4000 + Math.random() * 4000;
    let flip = false;
    let last = performance.now();
    let sayUntil = 0;
    let current: Pose = "perch";
    const pointer = { x: 0, y: 0, on: false };

    const say = (text: string) => {
      setLine(text);
      sayUntil = performance.now() + 1600;
    };

    const show = (next: Pose) => {
      if (next === current) return;
      current = next;
      setPose(next);
    };

    const setSheet = (image: string, col: number, row: number) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      sheet.style.backgroundImage = `url(${image})`;
      sheet.style.backgroundPosition = `${col * 33.33}% ${row * 33.33}%`;
      sheet.style.opacity = "1";
    };

    const pickSeat = () => {
      const all = [...document.querySelectorAll<HTMLElement>("[data-seat]")].filter(
        (el) => el !== seat && seatVisible(el),
      );
      if (!all.length) return null;
      const mid = window.innerHeight * 0.42;
      all.sort(
        (a, b) =>
          Math.abs(a.getBoundingClientRect().top - mid) - Math.abs(b.getBoundingClientRect().top - mid),
      );
      return all[0]!;
    };

    const takeoff = () => {
      if (flying || mode !== "sit" || reduced) return;
      const next = pickSeat();
      if (next) {
        seat = next;
        const p = seatPoint(next);
        tx = p.x;
        ty = p.y;
      } else {
        seat = null;
        const c = cornerSeat();
        tx = c.x;
        ty = c.y;
      }
      flying = true;
      mode = "takeoff";
      modeT = 0;
      flip = tx < x - 12;
      show("takeoff");
      if (sheetRef.current) sheetRef.current.style.opacity = "0";
    };

    hop.current = () => {
      if (flying || mode !== "sit") return;
      hopT = 0;
      reactionUntil = performance.now() + 650;
      // Random reaction cell (assuming 3x3 reactions)
      const rCol = Math.floor(Math.random() * 3);
      const rRow = Math.floor(Math.random() * 3);
      setSheet("/owl/mascots/owl-reactions.webp", rCol, rRow);
      show("alert");
      say("Night owl.");
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.on = true;
    };
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) pointer.on = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (sayUntil && now > sayUntil) {
        sayUntil = 0;
        setLine(null);
      }

      const near = pointer.on && Math.hypot(pointer.x - x, pointer.y - y) < 220;

      if (!flying && seat && !seatVisible(seat) && !near && !reduced) takeoff();
      if (!flying && !seat && !near && !reduced) takeoff();
      if (!flying && !near && !reduced && now > boredAt) takeoff();

      if (flying && seat && !seatVisible(seat)) {
        const next = pickSeat();
        seat = next;
        if (!next) {
          const c = cornerSeat();
          tx = c.x;
          ty = c.y;
        }
      }
      if (flying && seat) {
        const p = seatPoint(seat);
        tx = p.x;
        ty = p.y;
      } else if (!flying && seat && seatVisible(seat)) {
        const p = seatPoint(seat);
        tx = p.x;
        ty = p.y;
      } else if (!flying && !seat) {
        const c = cornerSeat();
        tx = c.x;
        ty = c.y;
      }

      const dist = Math.hypot(tx - x, ty - y);
      if ((mode === "takeoff" || mode === "fly") && !reduced) {
        const d = Math.max(1, dist);
        const accel = Math.min(1, 2.2 * dt);
        vx += ((tx - x) / d * 480 - vx) * accel;
        vy += ((ty - y) / d * 480 - vy) * accel;
        x += vx * dt;
        y += vy * dt;
      } else {
        const follow = Math.min(1, dt * 7);
        x += (tx - x) * follow;
        y += (ty - y) * follow;
        vx *= 0.6;
        vy *= 0.6;
      }

      if (mode === "takeoff") {
        modeT += dt;
        if (modeT > 0.42) {
          mode = dist < 50 ? "land" : "fly";
          modeT = 0;
          show(mode === "fly" ? "flight" : "landing");
        }
      } else if (mode === "fly") {
        if (dist < 40) {
          mode = "land";
          modeT = 0;
          show("landing");
        } else if (vx < -24) flip = true;
        else if (vx > 24) flip = false;
      } else if (mode === "land") {
        modeT += dt;
        if (modeT > 0.46) {
          mode = "sit";
          flying = false;
          vx = 0;
          vy = 0;
          x = tx;
          y = ty;
          boredAt = now + 10000 + Math.random() * 6000;
          modeT = 0;
          show("perch");
          setSheet("/owl/mascots/owl-directions.webp", 1, 1);
        }
      }

      if (mode === "sit") {
        if (reactionUntil > now) {
          // keep reaction sheet
        } else if (hopT >= 0) {
          hopT += dt;
          if (hopT > 0.5) {
            hopT = -1;
            show("perch");
            setSheet("/owl/mascots/owl-directions.webp", 1, 1);
          }
        } else if (near) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const angle = Math.atan2(dy, dx);
          const deg = (angle * 180 / Math.PI + 360) % 360;
          let col = 1, row = 1;
          if (deg > 45 && deg < 135) col = 2;
          else if (deg > 225 && deg < 315) col = 0;
          if (deg > 135 && deg < 225) row = 2;
          else if (deg < 45 || deg > 315) row = 0;
          setSheet("/owl/mascots/owl-directions.webp", col, row);
          show("perch");
          boredAt = Math.max(boredAt, now + 7000);
          idleLookAt = now + 5000;
        } else {
          // Idle behavior
          if (now > idleLookAt) {
            const idleCol = Math.floor(Math.random() * 3);
            const idleRow = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 1;
            setSheet("/owl/mascots/owl-directions.webp", idleCol, idleRow);
            idleLookAt = now + 3000 + Math.random() * 5000;
          }
          if (current !== "perch") show("perch");
        }
      }

      const width = window.innerWidth < 700 ? 132 : 158;
      const height = width * (SRC_H / SRC_W);
      const left = x - width / 2;
      const top = y - (FEET / SRC_H) * height;
      const hopY = hopT >= 0 ? -Math.sin((hopT / 0.5) * Math.PI) * 14 : 0;

      const rig = rigRef.current;
      if (rig) {
        rig.style.width = `${width}px`;
        rig.style.height = `${height}px`;
        rig.style.transform = `translate3d(${left}px, ${top + hopY}px, 0) scaleX(${flip ? -1 : 1})`;
      }
      const shadow = shadowRef.current;
      if (shadow) {
        shadow.style.transform = `translate3d(${x}px, ${y + 2}px, 0)`;
        shadow.style.opacity = mode === "sit" ? "0.22" : "0.12";
      }
      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.transform = `translate3d(${x}px, ${top - 4}px, 0) translate(-50%, -100%)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden={false}>
      <div
        ref={shadowRef}
        className="absolute top-0 left-0 size-12 -translate-x-1/2 rounded-full bg-black/30 blur-md"
      />
      <div ref={rigRef} className="absolute top-0 left-0">
        {/* Sprite-sheet (directions or reactions) used while sitting */}
        <div
          ref={sheetRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/owl/mascots/owl-directions.webp)",
            backgroundSize: "300% 300%",
            backgroundRepeat: "no-repeat",
            opacity: 1,
            backgroundPosition: "33.33% 33.33%",
          }}
        />
        {/* Flight / other poses still use individual images */}
        {["alert", "takeoff", "flight", "landing"].map((name) => (
          <img
            key={name}
            src={`/owl/poses/${name}.png`}
            alt=""
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200"
            style={{ opacity: pose === name ? 1 : 0 }}
            draggable={false}
          />
        ))}
        <button
          type="button"
          className="pointer-events-auto absolute inset-x-8 top-6 bottom-10 cursor-pointer bg-transparent"
          aria-label="The owl. Click for a small hello."
          onClick={(event) => {
            event.stopPropagation();
            hop.current();
          }}
        />
      </div>
      <div
        ref={bubbleRef}
        className={
          line
            ? "absolute top-0 left-0 rounded-2xl bg-neutral-900 px-3 py-2 text-sm text-neutral-50 shadow-lg"
            : "hidden"
        }
        role="status"
        aria-live="polite"
      >
        {line}
      </div>
    </div>
  );
}
