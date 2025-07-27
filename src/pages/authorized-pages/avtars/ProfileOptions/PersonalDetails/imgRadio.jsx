const ImageRadio = ({ id, name, value, checked, onChange, imgSrc, imgAlt }) => {
  return (
    <label style={{ cursor: "pointer" }}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <img
        src={imgSrc}
        alt={imgAlt}
        style={{
          border: checked ? "2px solid blue" : "2px solid transparent",
          borderRadius: "4px",
          padding: "4px",
        }}
      />
    </label>
  );
};

export default ImageRadio;
