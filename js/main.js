  "use strict"

  let firebaseError;

  function desenharAlertaV(mensagem) {
    Swal.fire({
      title: "Sucesso!",
      text: mensagem,
      icon: "success"
    });
  }

  function desenharAlertaX(mensagem, titulo) {
    Swal.fire({
      icon: "error",
      title: titulo,
      text: mensagem,
      footer: '<a href="#" id="erro-mensagem">Por que tenho esse problema? </a>' 
    });
  }

  function desenharAlertaA(mensagem){
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: mensagem,
      footer: '<a href="#" id="erro-mensagem">Por que tenho esse problema? </a>' 
    });
  }

  let timerInterval;
  function desenharAlertaC(){
    Swal.fire({
    icon: "success",
    title: "Seja bem-vindo...",
    html: '<p class="swal2-text-custom">Sua conta foi criada com sucesso.</p>',
    customClass: {
    title: "swal2-title-custom",
    text: "swal2-text-custom",
    },
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `
    }
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "erro-mensagem") {
      e.preventDefault();
      Swal.update({
        footer: `<span style="color:#b2341d; font-weight:bold;">Código de erro: ${firebaseError}</span>`
      });
    }
  });

  async function addDocUsuario(estado, id){
    const user = localStorage.getItem("token"); 
    if (!user) return;
    try {
      const res = await fetch("https://apiserver-infoestado.onrender.com/adicionarEstados", {
      method: "POST",
       headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user}`
      },
      body: JSON.stringify({ estado, id })
      });
    } catch (e) {
      console.error("Erro ao adicionar: ", e);
    }
  }

  async function carregarEstados(){
    const user = localStorage.getItem("token");  
    if (!user) return;
    try {

    const res = await fetch("https://apiserver-infoestado.onrender.com/carregarEstados", {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user}` }
    });
    
    const estados = await res.json();
    const divDesenho = document.getElementById("div-desenho");
    divDesenho.innerHTML = '';

    estados.forEach((e) => {
    desenharEstadoDiv(e.estado, e.id);
    });
    
    chamadaApiOrdenar();
    } catch (e) {
      console.error("Erro:", e);
    }
  }

  carregarEstados();
  
  async function deletarConta(uid){
    const res = await fetch("https://apiserver-infoestado.onrender.com/deletar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
    });

    const data = await res.json();

    if (data.success) { 
      localStorage.clear();
      window.location.href = "index.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Para sua segurança, faça login novamente antes de deletar a conta.", "Oops...");
    }
  }

  async function deslogar(){
   localStorage.clear(); 
    window.location.href = "index.html";
  }

  const estadoSelect = document.getElementById("estados");
 
  function chamadaApiOrdenar(){
    const container = document.getElementById("div-desenho");
    const nomes = Array.from(container.children).map(div => div.id);
    fetch("https://apiserver-infoestado.onrender.com/api/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ itens: nomes })
    })
    .then(res => res.json())
    .then(resposta => {
      const container = document.getElementById("div-desenho");
      resposta.forEach(nome => {
      const div = document.getElementById(nome.trim());
    if (div) {
      container.appendChild(div);
    }   
    });
    })
    .catch(erro => console.error("Erro ao ordenar."));
  }

  function desenharEstadoDiv(estado, idPersonalizado = null){
    const btn = document.createElement("button");
    btn.id = idPersonalizado || estado;
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.margin = "20px auto";
    btn.style.width = "90vw";
    btn.style.height = "13vh";
    btn.style.border = "2px solid black";
    btn.style.backgroundColor = "white";
    btn.style.boxShadow = "0 2px 8px rgba(255, 85, 0, 0.4)";
    btn.textContent = estado;
    btn.style.fontWeight = "bold";
    const divDesenho = document.getElementById("div-desenho");
    divDesenho.appendChild(btn); 
    addDocUsuario(estado, btn.id);

    btn.addEventListener("click", function(event) {
      event.preventDefault();
      fetch("info.json")
      .then(response => response.json()) 
      .then(data => {
      const info = data.categorias[estado];

      document.getElementById("subtitleModal").textContent = info.subtitulo; 
      document.getElementById("textCapitalModal").textContent = info.descricao.capital;
      document.getElementById("textGovernadorModal").textContent = info.descricao.governador;
        
      document.getElementById("textPopulacaoUltimoCensoModal").textContent = info.descricao.populacao.populacao_ultimo_censo;
      document.getElementById("textPopulacaoEstimadaModal").textContent = info.descricao.populacao.populacao_estimada;
      document.getElementById("textDensidadeDemograficaModal").textContent = info.descricao.populacao.densidade_demografica;
      document.getElementById("textTotalDeVeiculosModal").textContent = info.descricao.populacao.total_de_veiculos;

      document.getElementById("textIdebAnosIniciaisModal").textContent = info.descricao.educacao.ideb_anos_iniciais;
      document.getElementById("textIdebAnosFinaisModal").textContent = info.descricao.educacao.ideb_anos_finais;
      document.getElementById("textMatriculasFudamentalModal").textContent = info.descricao.educacao.matriculas_fundamental;
      document.getElementById("textMatriculasEnsinoMedioModal").textContent = info.descricao.educacao.matriculas_ensino_medio;
      document.getElementById("textDocentesEnsinoFundamentalModal").textContent = info.descricao.educacao.docentes_ensino_fundamental;
      document.getElementById("textDocentesEnsinoMedioModal").textContent = info.descricao.educacao.docentes_ensino_medio;
      document.getElementById("textNumeroEstabelecimentoFundamentalModal").textContent = info.descricao.educacao.numero_estabelecimento_fundamental;
      document.getElementById("textNumeroEstabelecimentoMedioModal").textContent = info.descricao.educacao.numero_estabelecimento_medio;

      document.getElementById("textRendimentoNominalModal").textContent = info.descricao.rendimento_nominal;
      document.getElementById("textPessoas16oumaisOcupadasSemanaReferenciaModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_16oumais_ocupadas_semana_referencia;
      document.getElementById("textPessoas16oumaisTrabalhoFormalModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_16oumais_trabalho_formal;
      document.getElementById("textPessoas14oumaisOcupadasSemanaReferenciaModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_14oumais_ocupadas_semana_referencia;
      document.getElementById("textRendimentoRealMedioModal").textContent = info.descricao.trabalho_e_rendimento.rendimento_real_medio;
      document.getElementById("textPessoalOcupadoAdministracaoModal").textContent = info.descricao.trabalho_e_rendimento.pessoal_ocupado_administracao;

      document.getElementById("textIndiceDesenvolvimentoHumanoModal").textContent = info.descricao.economia.indice_desenvolvimento_humano;
      document.getElementById("textTotalReceitaBrutaModal").textContent = info.descricao.economia.total_receita_bruta;
      document.getElementById("textTotalReceitaEmpenhadasModal").textContent = info.descricao.economia.total_receita_empenhadas;
      document.getElementById("textNumeroAgenciaModal").textContent = info.descricao.economia.numero_agencia;
      document.getElementById("textDepositosPrazoModal").textContent = info.descricao.economia.depositos_prazo;
      document.getElementById("textDepositosVistaModal").textContent = info.descricao.economia.depositos_vista;

      document.getElementById("textNumeroMunicipiosModal").textContent = info.descricao.territorio.numero_municipios;
      document.getElementById("textAreaUnidadeTerritorialModal").textContent = info.descricao.territorio.area_unidade_territorial;
      document.getElementById("textAreaUrbanizadaModal").textContent = info.descricao.territorio.area_urbanizada;
        
      const modal = new bootstrap.Modal(document.getElementById("infoModal"));
      modal.show();
      })
      .catch(error => {
        desenharAlertaX("Erro ao acessar as informações.", "Oops...");
      });
    });
  }

  const btnPlus = document.getElementById("btn-plus");
  const btnInverse = document.getElementById("btn-inverse");

  document.getElementById("btn-adicionar").addEventListener("click", function(){
    const divId = document.getElementById("estados").options[document.getElementById("estados").selectedIndex].text;
    if(document.getElementById(divId)){
      desenharAlertaX("Você já adicionou este estado.", "Oops...");
      return;
    }
    let estadoSelect = document.getElementById("estados").value;
    if(!estadoSelect){
      document.getElementById("alert-danger").style.display = "block";
      setTimeout(() => {
      document.getElementById("alert-danger").style.display = "none";
      }, 3000);
    }else{
      form2.style.display = "none";
      form1.style.display = "block";
      divDesenho.style.display = "block";
      btnPlus.style.display = "block";
      btnInverse.style.display = "block";
      estadoSelect = document.getElementById("estados").options[document.getElementById("estados").selectedIndex].text;
      desenharEstadoDiv(estadoSelect);
      setTimeout(() => chamadaApiOrdenar(), 100);
  }
  }); 

  document.getElementById("searchBox").addEventListener("keyup", function(event) {
    const termo = event.target.value.toLowerCase().trim();
    const botoes = document.querySelectorAll("#div-desenho button");
    if (termo === "") {
      botoes.forEach(btn => {
      btn.style.backgroundColor = "white";
      });
      return;
    }

    botoes.forEach(btn => btn.style.backgroundColor = "white");
      for (let btn of botoes) {
        if (btn.id.toLowerCase().includes(termo)) {
          btn.scrollIntoView({ behavior: "smooth", block: "center" });
          btn.style.transition = "background-color 0.5s";
          btn.style.backgroundColor = "rgba(255, 170, 0, 1)";
          break;
        }
      }
  });

  document.getElementById("sair").addEventListener("click", function(event) {
    event.preventDefault();
    deslogar();
  });
  

  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  const divDesenho = document.getElementById("div-desenho");

  document.addEventListener('DOMContentLoaded', function() {
  if(localStorage.getItem("situacao") === "sucess"){
    desenharAlertaC();
    localStorage.removeItem("situacao");
  }
  document.getElementById("deletar").addEventListener("click", function() {
    const uid = localStorage.getItem("uid");
    deletarConta(uid);
  });

  if (btnPlus && form1 && form2) {
    btnPlus.addEventListener("click", function(event) {
      event.preventDefault();
      form1.style.display = "none";
      form2.style.display = "block";
      divDesenho.style.display = "none";
      btnPlus.style.display = "none";
      btnInverse.style.display = "none";
    });
  }

  document.getElementById("btn-mapa").addEventListener("click", function(event) {
    event.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById("mapaModal"));
    modal.show();
  });

  btnInverse.addEventListener("click", function(){
    const container = document.getElementById("div-desenho");
    const divs = Array.from(container.children);
    divs.reverse().forEach(div => container.appendChild(div));
  }); 

  });

  (function($) {
    var fullHeight = function() {
      $('.js-fullheight').css('height', $(window).height());
      $(window).resize(function(){
        $('.js-fullheight').css('height', $(window).height());
      });

    };
    fullHeight();
    $(".toggle-password").click(function() {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
  })(jQuery);
