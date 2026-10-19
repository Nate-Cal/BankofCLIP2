type Toast = {
  id: number;
  msg: string;
  bad: boolean;
};

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div id="toasts">
      {toasts.map(t => (
        <div
          key={t.id}
          className={"toast" + (t.bad ? " bad" : "")}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
