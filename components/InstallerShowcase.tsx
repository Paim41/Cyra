"use client";
import { useRef, useState } from "react";
import Image from "next/image";
const steps = [
  ["01-welcome.png", "Welcome to Cyra Setup"],
  ["02-license.png", "License Agreement"],
  ["03-location.png", "Choose Install Location"],
  ["04-tasks.png", "Select Additional Tasks"],
  ["05-ready.png", "Ready to Install"],
  ["06-installing.png", "Installing Cyra"],
  ["07-complete.png", "Completing Cyra Setup"],
];
export function InstallerShowcase() {
  const [step, setStep] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const zoom = useRef<HTMLButtonElement>(null);
  const picture = (
    <Image
      key={step}
      src={`/assets/installer/${steps[step][0]}?v=window-crop-1`}
      unoptimized
      alt={`Cyra Setup: ${steps[step][1]}. Authentic Windows installer screenshot; illustrated settings only.`}
      width={598}
      height={464}
      sizes="(max-width: 700px) 90vw, 598px"
    />
  );
  function keys(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setStep((s) =>
        Math.max(0, Math.min(6, s + (e.key === "ArrowRight" ? 1 : -1))),
      );
    }
  }
  return (
    <section
      className="installer wrap section"
      aria-label="Cyra installer walkthrough"
      onKeyDown={keys}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">A SIMPLE START</p>
          <h2>
            Simple to install.
            <br />
            Easy to use.
          </h2>
        </div>
        <p>
          A familiar Windows installer.
          <br />
          You choose where Cyra belongs.
        </p>
      </div>
      <div className="setup-showcase">
        <ol className="setup-steps">
          {steps.map((s, i) => (
            <li key={s[0]}>
              <button
                aria-current={step === i ? "step" : undefined}
                onClick={() => setStep(i)}
              >
                <span>0{i + 1}</span>
                {s[1]}
              </button>
            </li>
          ))}
        </ol>
        <div className="setup-preview">
          <button
            ref={zoom}
            className="setup-image"
            aria-label="Enlarge installer screenshot"
            onClick={() => dialog.current?.showModal()}
          >
            {picture}
          </button>
          <div className="setup-controls">
            <button
              className="button small"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Previous
            </button>
            <span aria-live="polite">{step + 1} / 7</span>
            <button
              className="button small"
              disabled={step === 6}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Actual Cyra v1.0.0 setup captures. Account paths are obscured. This
        walkthrough does not install software; options and file sizes vary by
        computer. Original Gili MIT attribution is preserved.
      </p>
      <dialog
        ref={dialog}
        className="setup-lightbox"
        aria-label="Enlarged installer screenshot"
        onClose={() => zoom.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="button small"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          Close enlarged screenshot
        </button>
        {picture}
        <p>
          {step + 1} / 7 · {steps[step][1]}
        </p>
      </dialog>
    </section>
  );
}
