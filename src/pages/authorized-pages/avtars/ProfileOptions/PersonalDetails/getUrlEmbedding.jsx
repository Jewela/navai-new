import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function GetUrlEmbedding({ shareAvatarUrl, avatarEmbeddedText }) {
  return (
    <>
      <div className="col-md-12 mb-3">
        <label htmlFor="">Get Chatbot URL</label>
        <input
          readOnly={true}
          type="text"
          disabled
          style={{ backgroundColor: "#1d2021" }}
          className="form-control"
          value={shareAvatarUrl ? shareAvatarUrl : ""}
        />
      </div>

      <div className="col-md-12 mb-3">
        <label htmlFor="">Get Chatbot Embedding</label>
        <div
          style={{
            borderRadius: "0.375rem",
            border: "#fff 1px solid",
          }}
        >
          <SyntaxHighlighter language="html" style={gruvboxDark}>
            {avatarEmbeddedText ? avatarEmbeddedText : ""}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
}

export default GetUrlEmbedding;
