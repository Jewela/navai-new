import { memo } from "react";
import { Badge } from "react-bootstrap";

function SubjectItem(props) {
    const { subject: { name, subjectId }, FnCallback, selectedSubjectId } = props;
    return (
        <span
            role="button"
            className={`filter-items ${selectedSubjectId === subjectId && 'checked'}`}
            onClick={() => FnCallback(subjectId)}
           
        >
            {name}
        </span>
    )
}
export default memo(SubjectItem);