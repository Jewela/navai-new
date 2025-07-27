import { memo } from "react";
import { Badge } from "react-bootstrap";
import { FILTER_MONTHS } from "../../../../../../../app/constants";

function MonthItem(props) {
    const { selectedMonth, month, FnCallback } = props;
    return (
        <span
            role="button"
            className={`filter-items ${selectedMonth === month && 'checked'}`}
            onClick={() => FnCallback(month)}
            
        >
            {FILTER_MONTHS[month]}
        </span>
    )
}
export default memo(MonthItem);