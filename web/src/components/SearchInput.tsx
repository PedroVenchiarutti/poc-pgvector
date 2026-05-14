type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Digite um assunto..."}
        className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
