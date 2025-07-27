import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import chevronDown from '../../../assets/images/arrow-down-s-line.svg'
import styles from "./accordion-style.module.css";
import { FAQ_SEED } from "../../../utils/seeds/FAQ";
const AccordionItem = ({ header, ...rest }) => (
    <Item
        {...rest}
        header={
            <>
                {header}
                <span className="faq__btn secondary-btn"><img className={styles.chevron} src={chevronDown} alt="Chevron Down" /></span>
            </>
        }
        className={styles.item}
        buttonProps={{
            className: ({ isEnter }) =>
                `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`
        }}
        contentProps={{ className: styles.itemContent }}
        panelProps={{ className: styles.itemPanel }}
    />
);

function FAQ() {
    return <>
        <section className="faq spacer-lg bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 mx-auto text-center">

                        <div className="section__heading">
                            <h2>FAQ</h2>
                        </div>

                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-9 mx-auto">
                        <div className="accordion" id="myAccordion">
                            <div className="row">
                                <div className={styles.app}>
                                    <Accordion transition transitionTimeout={200}>
                                        {
                                            // FAQ_SEED.map(( {question, answer} ) => {
                                            //     return <>
                                            //         <AccordionItem 
                                            //             key={question}
                                            //             header={question} initialEntered
                                            //         >
                                            //             {answer}
                                            //         </AccordionItem>
                                            //     </>
                                            // })
                                            FAQ_SEED.map((item) => (
                                                <AccordionItem key={`item-${item.question}`} header={item.question}>
                                                    {item.answer}
                                                </AccordionItem>
                                            ))
                                        }
                                    </Accordion>
                                </div>
                                {/* <div className="col-md-6 mb-4">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne">What’s an AI avatar?</span>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <span className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">Will my generated avatars look like me?</span>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse show" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                            <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">How can I create my own avatar?</span>
                                        </h2>
                                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFour">
                                            <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour">What file formats can I upload?</span>
                                        </h2>
                                        <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFive">
                                            <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive">How many photos can I upload to create an avatar?</span>
                                        </h2>
                                        <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">


                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingSix">
                                            <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseSix">How many avatar images can I receive?</span>
                                        </h2>
                                        <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#myAccordion">
                                            <div className="card-body">
                                                <p>AI avatars are portraits created by artificial intelligence. Our machine learning algorithms generate digital portraits based on the pictures you upload.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}
export default FAQ;