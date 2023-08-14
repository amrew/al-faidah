import { useState } from "react";

const timerOptions = [
  {
    title: "10 Menit",
    value: `${10 * 60}`,
  },
  {
    title: "20 Menit",
    value: `${20 * 60}`,
  },
  {
    title: "30 Menit",
    value: `${30 * 60}`,
  },
];

export function TimerModal(props: {
  onSubmit: (v: string) => void;
  onDisable: () => void;
  hasTimer: boolean;
}) {
  const { hasTimer, onDisable, onSubmit } = props;
  const [time, setTime] = useState<string>();
  return (
    <>
      <input type="checkbox" id="timer-modal" className="modal-toggle" />
      <div className="modal z-50">
        <div className="modal-box max-w-xs">
          <h3 className="font-bold text-xl">Timer</h3>
          <div className="py-4">
            {hasTimer ? (
              <>
                <p>Matikan timer?</p>
              </>
            ) : (
              <>
                <p>Lagi dengerin taklim terus ketiduran?</p>
                <p>Atur waktu kapan radio akan dimatikan.</p>
              </>
            )}
          </div>
          {!hasTimer &&
            timerOptions.map((item) => (
              <div className="form-control" key={item.value}>
                <label className="label cursor-pointer">
                  <span className="label-text">{item.title}</span>
                  <input
                    type="radio"
                    name="timer-value"
                    className="radio checked:bg-primary"
                    checked={time === item.value}
                    onChange={() => {
                      setTime(item.value);
                    }}
                    value={item.value}
                  />
                </label>
              </div>
            ))}
          <div className="modal-action">
            <label htmlFor={"timer-modal"} className="btn btn-outline btn-sm">
              Batal
            </label>
            <label
              htmlFor={time ? "timer-modal" : ""}
              className={`btn btn-primary btn-sm ${
                !time ? "btn-disabled" : ""
              }`}
              onClick={() =>
                hasTimer ? onDisable() : time ? onSubmit(time) : undefined
              }
            >
              {hasTimer ? "Matikan" : "Aktifkan"}
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="timer-modal">
          Close
        </label>
      </div>
    </>
  );
}
