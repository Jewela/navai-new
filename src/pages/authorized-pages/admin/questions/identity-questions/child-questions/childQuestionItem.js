import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';
import AvatarQuestionModal from '../../../../../../components/UI/Modal/AvatarQustions';
import { ADMIN_ROUTE_SLUGS } from '../../../../../../app/constants';
import { ADMIN } from '../../../../../../app/config/endpoints';
import DeleteQuestion from '../../delete-qustion';

function ChildQuestionItem(props) {
    const { parentQuestion, questionList, getFamilyQuestions } = props;

    const [modalShow, setModalShow] = useState(false);
    const [questionDetail, setQuestionDetail] = useState({ id: 0, question: '' });

    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [hoveredQuestion, setHoveredQuestion] = useState(null);

    const handleEditQuestion = (question) => {
        setQuestionDetail(question)
        setModalShow(true);
    }

    const handleDeleteQuestion = (id, question) => {
        setHoveredQuestion({ id: id, question: question, isParent: false });
        setDeleteModalShow(true);
    }

    if (questionList.length === 0) {
        return <>
            <TableLayout>
                <tr>
                    <td className="text-center" colSpan={2}>
                        <span className="text-error fs-1">Questions not found.</span>
                    </td>
                </tr>
            </TableLayout>
        </>
    }
    return <>
        <p>{parentQuestion}</p>
        <TableLayout>
            {questionList.map((item, index) => {
                const { question, id } = item;
                return (
                    <tr key={index}>
                        <td>{question}</td>
                        <td className="text-end">
                            <span className="csr-pointer me-3" onClick={() => handleEditQuestion(item)}>
                                <FontAwesomeIcon icon={faPencil} style={{ color: "#3f3f3f", fontSize: "1em" }} /> Edit
                            </span>
                            <span className="csr-pointer del-icon" onClick={() => handleDeleteQuestion(id, question)}>
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: "#3f3f3f", fontSize: "1em" }} /> Delete
                            </span>
                        </td>
                    </tr>
                );
            })}
        </TableLayout>
        {
            modalShow &&
            <AvatarQuestionModal
                show={modalShow}
                questionDetail={questionDetail}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                getFamilyQuestions={getFamilyQuestions}
                questionEndpoint={ADMIN.IDENTITY_QUESTION.UPDATE}
                questionType="IDENTITY_QUESTION"
            />
        }

        {hoveredQuestion !== null &&
            <DeleteQuestion
                // setIsDeleted={setIsDeleted}
                hoveredQuestion={hoveredQuestion}
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                setDeleteModalShow={setDeleteModalShow}
                getQuestions={getFamilyQuestions}
                questionEndpoint={ADMIN.IDENTITY_QUESTION.DELETE}

            />
        }
    </>
}

export default ChildQuestionItem;
const TableLayout = (props) => {
    return <table className="table">
        <thead>
            <tr>
                <th>Question</th>
                <th className="text-end pe-5">Action</th>
            </tr>
        </thead>
        <tbody>
            {props.children}
        </tbody>
    </table>
}
