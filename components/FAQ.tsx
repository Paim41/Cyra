"use client";
import { useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { questions } from "@/data/faq";
export function FAQ() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  function choose(i: number, button: HTMLButtonElement) {
    setSelected(i);
    trigger.current = button;
    if (matchMedia("(max-width: 700px)").matches) dialog.current?.showModal();
  }
  return (
    <section className="faq wrap section" id="faq">
      <div className="faq-heading">
        <p className="eyebrow">A FEW GOOD QUESTIONS</p>
        <h2>
          Little details.
          <br />
          Clear answers.
        </h2>
      </div>
      <div className="faq-explorer">
        <div className="faq-questions" aria-label="Frequently asked questions">
          {questions.map(([q], i) => (
            <button
              key={q}
              className={selected === i ? "selected" : ""}
              aria-pressed={selected === i}
              aria-controls="faq-answer"
              onClick={(e) => choose(i, e.currentTarget)}
            >
              {q}
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div
          className="faq-answer"
          id="faq-answer"
          role="region"
          aria-label="Selected answer"
          tabIndex={0}
        >
          <div key={selected} className="answer-copy" aria-live="polite">
            <span className="eyebrow">A LITTLE CLARITY</span>
            <h3>{questions[selected][0]}</h3>
            <p>{questions[selected][1]}</p>
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="faq-dialog"
        aria-labelledby="faq-dialog-title"
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close answer"
          onClick={() => dialog.current?.close()}
          autoFocus
        >
          <X size={20} />
        </button>
        <h3 id="faq-dialog-title">{questions[selected][0]}</h3>
        <p>{questions[selected][1]}</p>
      </dialog>
    </section>
  );
}
