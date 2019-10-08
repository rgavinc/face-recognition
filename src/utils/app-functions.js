export const signin = (email, password, onUserRetrevial) =>
  fetch("http://localhost:3000/signin", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.userId && data.success === "true") {
        window.sessionStorage.setItem("token", data.token);
        //TODO: make this into a function since it is being useed in App.js also
        fetch(`http://localhost:3000/profile/${data.userId}`, {
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
