import { memo } from "react";
import { Badge } from "react-bootstrap";

function YearItem(props) {
  const { selectedYear, year, FnCallback } = props;
  return (
    <span
      role="button"
      className={`filter-items ${selectedYear === year && "checked"}`}
      onClick={() => FnCallback(year)}
    >
      {year}
    </span>
  );
}
export default memo(YearItem);
