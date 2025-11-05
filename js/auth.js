  "use strict";

  function desenharAlertaV(mensagem) {
    Swal.fire({
      title: "Sucesso!",
      text: mensagem,
      customClass: {
        confirmButton: "confirm-custom"
      },
      icon: "success",
    });
  }

  function desenharAlertaX(mensagem) {
    Swal.fire({
      icon: "error",
      title: "Tivemos um problema por aqui...",
      text: mensagem,
      customClass: {
        confirmButton: "confirm-custom"
      },
      footer: '<a href="#" id="erro-mensagem">Por que tenho esse problema? </a>' 
    });
  } 

  let firebaseError;
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "erro-mensagem") {
      e.preventDefault();
      Swal.update({
        footer: `<span style="color:#b2341d; font-weight:bold;">Código de erro: ${firebaseError}</span>`
      });
    }
  });

  function desenharAlertaA(mensagem){
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      customClass: {
        confirmButton: "confirm-custom"
      },
      text: mensagem
    });
  }

  function googleID() {
    google.accounts.id.initialize({
      client_id: "639151273124-71p2uri5p1dvq20bq8q4oj451nqkei7q.apps.googleusercontent.com",
      callback: loginGoogle
    });

    google.accounts.id.prompt(); 
  }

  async function loginGoogle(response){
    const id_token = response.credential;
    const res = await fetch("https://apiserver-infoestado.onrender.com/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
    });

    const data = await res.json();

    if(data.token || data.idToken){
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel entrar com o Google nesse momento.");
    }
  }

  document.querySelector(".google").addEventListener("click", function(event) {
  event.preventDefault();
  googleID();
  });

  function githubAcess(){
    const clientId = "Ov23litSgGWD80KWCFW7"; 
    const redirectUri = "https://luizagsoaress.github.io/infoEstados/callback.html"; 
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.open(authUrl, "_blank", "width=500,height=600"); 

    window.addEventListener("message", (event) => {
      if (event.origin !== "https://luizagsoaress.github.io") return; 
      const data = event.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("uid", data.uid);
        window.location.href = "main.html"; 
      }
    });
  }

  document.querySelector(".github").addEventListener("click", function(event) {
  event.preventDefault();
  githubAcess();
  });

  async function loginEmailSenha(email, password) {
    const res = await fetch("https://apiserver-infoestado.onrender.com/loginUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) { 
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel fazer login nesse momento.");
    }
  }

  async function criarEmailSenha(email, password){
    const res = await fetch("https://apiserver-infoestado.onrender.com/createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) { 
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("situacao", "sucess");
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel criar sua conta nesse momento.");
    }
  }


  async function resetarSenha(email){
    const res = await fetch("https://apiserver-infoestado.onrender.com/recuperar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) { 
      desenharAlertaV("Email de recuperação enviado!")
    } else {
      firebaseError = data.error;
      desenharAlertaX("O email informado está incorreto. Verifique e tente novamente.");
    }
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const formRecuperar = document.getElementById("formRecuperar");

    if(formRecuperar){
    formRecuperar.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("input-email").value;
      resetarSenha(email);
    });
    }
    
    if(formLogin){
    formLogin.addEventListener("submit", function(event) {
      event.preventDefault();
      const email = document.getElementById("input-email").value.trim();
      const password = document.getElementById("password-field").value.trim();
      loginEmailSenha(email, password);
    });
    }
    
    if(formCadastro){
    formCadastro.addEventListener("submit", function(event) {
      event.preventDefault();
      const email = document.getElementById("input-email").value.trim();
      const password = document.getElementById("password-field").value.trim();
      criarEmailSenha(email, password);
    });
    }
    
  });

  window.googleID = googleID;
  window.githubAcess = githubAcess;
  window.loginGoogle = loginGoogle;
  window.loginEmailSenha = loginEmailSenha;

