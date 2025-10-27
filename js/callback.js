const parametro = new URLSearchParams(window.location.search);
    const code = parametro.get("code");

    if (code) {
      fetch("https://apiserver-infoestado.onrender.com/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(data => {
        if(data.token) {
           window.opener.postMessage({
            token: data.token,
            uid: data.uid,
            email: data.email
        }, "https://luizagsoaress.github.io");

        window.close();
        } else {
          alert("Não foi possivel entrar com o Github nesse momento.");
        }
      })
      .catch(console.error);
} 