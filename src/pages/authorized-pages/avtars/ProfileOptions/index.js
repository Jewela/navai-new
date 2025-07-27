import React, { useState, useEffect } from "react";

function ProfileOptions(props) {
  const [component, setComponent] = useState(null);
  useEffect(() => {
    async function loadComponent() {
      const { default: DynamicChildComponent } = await import(
        `./${props.option}/`
      );
      setComponent(<DynamicChildComponent {...props} />);
    }

    loadComponent();
  }, [props.option, props]);

  return component;
}

export default ProfileOptions;
