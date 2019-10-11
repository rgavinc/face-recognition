const { REACT_APP_SIGNIN_URL, REACT_APP_PROFILE_URL } = process.env;
export const signin = (email, password, onUserRetrevial) =>
  fetch(REACT_APP_SIGNIN_URL, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.userId && data.success === "true") {
        window.sessionStorage.setItem("token", data.token);
        //TODO: make this into a function since it is being useed in App.js also
        fetch(`${REACT_APP_PROFILE_URL}/${data.userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: data.token
          }
        })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.email) onUserRetrevial(user);
          });
      }
    })
    .catch(console.log);
