type CountdownUnitProps = {
  value: number;
  label: string;
};

// Sizes use `cqw` (1% of the section width) so the numbers scale with the framed label.
export const CountdownUnit = ({ value, label }: CountdownUnitProps) => {
  return (
    <div className="box-border text-center text-[#7b8aa0]">
      <div
        className="font-cormorant_garamond font-medium"
        style={{ fontSize: "6.4cqw", lineHeight: 1 }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className="font-jost font-light uppercase text-[#94a1b5]"
        style={{ fontSize: "2cqw", letterSpacing: "0.2em", marginTop: "1cqw" }}
      >
        {label}
      </div>
    </div>
  );
};
