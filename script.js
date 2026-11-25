// =======================
// BARRA DE PESQUISA
// =======================

function inicializarBusca() {
    const input = document.getElementById("pesquisa");
    const resultado = document.getElementById("resultado");
    if (!input) return;

    // Remove listener antigo clonando o elemento
    const novoInput = input.cloneNode(true);
    input.parentNode.replaceChild(novoInput, input);

    novoInput.addEventListener("input", () => {

        const valor = novoInput.value.toLowerCase();
        const produtos = document.querySelectorAll(".produto"); // lê o DOM atualizado
        let encontrados = 0;

        produtos.forEach(produto => {

            const nome = produto.querySelector("h2").innerText.toLowerCase();

            if (nome.includes(valor)) {
                produto.style.display = "block";
                encontrados++;
            } else {
                produto.style.display = "none";
            }

        });

        resultado.textContent = encontrados + " produto(s) encontrado(s)";
    });
}

// Inicializa a busca para o HTML estático (sem admin)
inicializarBusca();


// =======================
// SELETOR DE GRAMAGEM (Farinhas Energéticas)
// =======================

document.querySelectorAll(".seletor-gramas").forEach(seletor => {

    const botoes = seletor.querySelectorAll(".btn-grama");
    const produto = seletor.closest(".produto");
    const precoEl = produto.querySelector(".preco");
    const gramasEl = produto.querySelector(".gramas");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            // Remove classe ativo de todos os botões do seletor
            botoes.forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");

            const grama = parseInt(botao.dataset.grama);
            const preco100 = parseFloat(botao.dataset.preco);

            // Calcula preço proporcional
            const novoPreco = grama === 100 ? preco100 : (preco100 / 2);

            // Atualiza exibição
            gramasEl.textContent = grama + "g";
            precoEl.textContent = "R$ " + novoPreco.toFixed(2).replace(".", ",");

            // Ao trocar gramagem, atualiza o contador do produto
            // para refletir a quantidade já no carrinho dessa gramagem
            const nomeBase = produto.querySelector("h2").innerText;
            const nomeSelecionado = `${nomeBase} (${grama}g)`;
            const itemExistente = carrinho.find(i => i.nome === nomeSelecionado);
            produto.querySelector(".qtd").innerText = itemExistente ? itemExistente.quantidade : 0;

            atualizarCarrinho();
        });

    });

});


// =======================
// CARRINHO (COM PERSISTÊNCIA)
// =======================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const listaCarrinho = document.getElementById("listaCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const contador = document.getElementById("contador");


// =======================
// ATUALIZAR CARRINHO
// =======================

function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {

        const div = document.createElement("div");

        div.innerHTML = `
        ${item.nome} <br>
        R$ ${item.preco.toFixed(2).replace(".", ",")} <br>
        <button class="menos" data-index="${index}">-</button>
        ${item.quantidade}
        <button class="mais" data-index="${index}">+</button>
        `;

        listaCarrinho.appendChild(div);

        total += item.preco * item.quantidade;

    });

    totalCarrinho.innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");

    contador.innerText = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

    ativarBotoesCarrinho();

    // SALVAR NO LOCALSTORAGE
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


// =======================
// BOTÕES + E - DO CARRINHO
// =======================

function ativarBotoesCarrinho() {

    document.querySelectorAll(".mais").forEach(botao => {

        botao.addEventListener("click", () => {

            const index = botao.dataset.index;

            carrinho[index].quantidade++;

            mostrarMensagem("Quantidade aumentada");

            atualizarCarrinho();

        });

    });

    document.querySelectorAll(".menos").forEach(botao => {

        botao.addEventListener("click", () => {

            const index = botao.dataset.index;

            carrinho[index].quantidade--;

            if (carrinho[index].quantidade <= 0) {

                mostrarMensagem("Produto removido do carrinho");

                carrinho.splice(index, 1);

            } else {

                mostrarMensagem("Quantidade diminuída");

            }

            atualizarCarrinho();

        });

    });

}


// =======================
// HELPER: obter nome do produto com gramagem (se tiver seletor)
// =======================

function obterNomeProduto(produto) {
    const nomeBase = produto.querySelector("h2").innerText;
    const seletor = produto.querySelector(".seletor-gramas");

    if (seletor) {
        const botaoAtivo = seletor.querySelector(".btn-grama.ativo");
        const grama = botaoAtivo ? botaoAtivo.dataset.grama : "100";
        return `${nomeBase} (${grama}g)`;
    }

    return nomeBase;
}


// =======================
// + E - NOS PRODUTOS
// =======================

const maisProdutos = document.querySelectorAll(".mais-produto");
const menosProdutos = document.querySelectorAll(".menos-produto");

maisProdutos.forEach(botao => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");

        const nome = obterNomeProduto(produto);
        const precoTexto = produto.querySelector(".preco").innerText;
        const qtdSpan = produto.querySelector(".qtd");

        const preco = parseFloat(precoTexto.replace("R$", "").trim().replace(",", "."));

        let item = carrinho.find(i => i.nome === nome);

        if (item) {

            item.quantidade++;
            qtdSpan.innerText = item.quantidade;

            mostrarMensagem("Quantidade aumentada");

        } else {

            carrinho.push({
                nome,
                preco,
                quantidade: 1
            });

            qtdSpan.innerText = 1;

            mostrarMensagem("Produto adicionado ao carrinho");
        }

        atualizarCarrinho();
    });

});


menosProdutos.forEach(botao => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");

        const nome = obterNomeProduto(produto);
        const qtdSpan = produto.querySelector(".qtd");

        let item = carrinho.find(i => i.nome === nome);

        if (!item) return;

        item.quantidade--;

        if (item.quantidade <= 0) {

            carrinho = carrinho.filter(i => i.nome !== nome);

            qtdSpan.innerText = 0;

            mostrarMensagem("Produto removido do carrinho");

        } else {

            qtdSpan.innerText = item.quantidade;

            mostrarMensagem("Quantidade diminuída");
        }

        atualizarCarrinho();
    });

});


// =======================
// CARREGAR AO INICIAR
// =======================

if (carrinho.length > 0) {

    atualizarCarrinho();

    carrinho.forEach(item => {

        document.querySelectorAll(".produto").forEach(produto => {

            const nome = obterNomeProduto(produto);

            if (nome === item.nome) {
                produto.querySelector(".qtd").innerText = item.quantidade;
            }

        });

    });

}


// =======================
// WHATSAPP FINALIZAR
// =======================

const finalizar = document.getElementById("finalizar");

finalizar.addEventListener("click", () => {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio");
        return;
    }

    let mensagem = "Olá, gostaria de fazer o pedido:%0A%0A";

    let total = 0;

    carrinho.forEach(item => {

        mensagem += `- ${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}%0A`;

        total += item.preco * item.quantidade;

    });

    mensagem += `%0A Total: R$ ${total.toFixed(2).replace(".", ",")}`;

    const telefone = "5527998177162";

    const url = `https://wa.me/${telefone}?text=${mensagem}`;

    window.open(url, "_blank");

    // LIMPAR CARRINHO APÓS FINALIZAR
    carrinho = [];
    localStorage.removeItem("carrinho");
    atualizarCarrinho();
});


// =======================
// ABRIR / FECHAR CARRINHO
// =======================

const abrirCarrinho = document.getElementById("abrirCarrinho");
const carrinhoBox = document.getElementById("carrinhoBox");

abrirCarrinho.addEventListener("click", () => {
    carrinhoBox.classList.toggle("ativo");
});


// FECHAR CLICANDO FORA

document.addEventListener("click", (evento) => {

    const clicouFora = !carrinhoBox.contains(evento.target);
    const clicouIcone = abrirCarrinho.contains(evento.target);

    if (clicouFora && !clicouIcone) {
        carrinhoBox.classList.remove("ativo");
    }

});


// IMPEDIR FECHAR AO CLICAR DENTRO

carrinhoBox.addEventListener("click", (e) => {
    e.stopPropagation();
});


// =======================
// TOAST MENSAGEM
// =======================

const toast = document.getElementById("toast");

function mostrarMensagem(texto) {

    toast.textContent = texto;

    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2000);
}


// =======================
// SINCRONIZAÇÃO COM PAINEL ADMIN (JSONBin)
// =======================

const JSONBIN_ID = (window.APP_CONFIG || {}).JSONBIN_ID;
const JSONBIN_KEY = (window.APP_CONFIG || {}).JSONBIN_KEY;

async function sincronizarAdmin() {
    const loading = document.getElementById("loading-produtos");
    if (loading) loading.style.display = "flex";

    let produtosAdmin;
    try {
        const res = await fetch("https://api.jsonbin.io/v3/b/" + JSONBIN_ID + "/latest?t=" + Date.now(), {
            headers: { "X-Master-Key": JSONBIN_KEY, "Cache-Control": "no-cache" }
        });
        const data = await res.json();
        produtosAdmin = data.record;
    } catch (e) {
        console.error("Erro ao buscar produtos:", e);
        if (loading) loading.style.display = "none";
        return;
    }

    if (!Array.isArray(produtosAdmin) || produtosAdmin.length === 0 || !produtosAdmin[0].id) return;

    const CATEGORIAS = [
        { key: "temperos", titulo: "Temperos", anchorId: "temperos" },
        { key: "snacks", titulo: "Snacks", anchorId: "snacks" },
        { key: "farinhas", titulo: "Farinhas Energéticas", anchorId: "farinhas energeticas" },
        { key: "graos", titulo: "Grãos e Sementes", anchorId: "graos e sementes" },
    ];

    document.querySelectorAll("h1[id], main.catalogo").forEach(function (el) { el.remove(); });

    const grupos = {};
    produtosAdmin.forEach(function (p) {
        if (!grupos[p.categoria]) grupos[p.categoria] = [];
        grupos[p.categoria].push(p);
    });

    const footer = document.querySelector("footer");
    if (!footer) return;

    CATEGORIAS.forEach(function (cat) {
        const itens = grupos[cat.key];
        if (!itens || itens.length === 0) return;

        const h1 = document.createElement("h1");
        h1.id = cat.anchorId;
        h1.textContent = cat.titulo;
        footer.before(h1);

        const main = document.createElement("main");
        main.className = "catalogo";

        itens.forEach(function (p) {
            const div = document.createElement("div");
            const indisponivel = p.disponivel === false;
            div.className = "produto" + (indisponivel ? " indisponivel" : "");

            const fotoSrc = (p.foto && p.foto.trim() !== "") ? p.foto : "";
            const imgAttr = fotoSrc
                ? 'src="' + fotoSrc + '"'
                : 'src="" style="background:#e8ede8;min-height:100px;"';

            let seletorHTML = "";
            let gramasText = "";
            let precoText = "";

            if (p.temSeletor) {
                const v100 = parseFloat(p.preco100 || 0);
                const v50 = (v100 / 2);
                const padrao = String(p.gramaPadrao || "100");
                const a50 = padrao === "50" ? " ativo" : "";
                const a100 = padrao === "100" ? " ativo" : "";
                const precoEx = (padrao === "50" ? v50 : v100).toFixed(2).replace(".", ",");
                const gramaEx = padrao === "50" ? "50g" : "100g";
                seletorHTML = '<div class="seletor-gramas">'
                    + '<button class="btn-grama' + a50 + '" data-grama="50"  data-preco="' + v100.toFixed(2) + '">50g</button>'
                    + '<button class="btn-grama' + a100 + '" data-grama="100" data-preco="' + v100.toFixed(2) + '">100g</button>'
                    + '</div>';
                gramasText = gramaEx;
                precoText = "R$ " + precoEx;
            } else {
                gramasText = (p.gramas || 0) + "g";
                precoText = "R$ " + parseFloat(p.preco || 0).toFixed(2).replace(".", ",");
            }

            div.innerHTML =
                '<details class="menu-produto">'
                + '<summary>⋮</summary>'
                + '<div class="info-produto"><p><strong>' + (p.info || p.descricao || "") + '</strong></p></div>'
                + '</details>'
                + '<img ' + imgAttr + ' alt="' + p.nome + '">'
                + '<h2>' + p.nome + '</h2>'
                + '<p class="descricao">' + (p.descricao || "") + '</p>'
                + '<div class="estrelas">★★★★★</div>'
                + seletorHTML
                + '<p class="gramas">' + gramasText + '</p>'
                + '<p class="preco">' + precoText + '</p>'
                + '<div class="controle-produto">'
                + '<button class="menos-produto"' + (indisponivel ? ' disabled' : '') + '>-</button>'
                + '<span class="qtd">0</span>'
                + '<button class="mais-produto"' + (indisponivel ? ' disabled' : '') + '>+</button>'
                + '</div>';

            main.appendChild(div);
        });

        footer.before(main);
    });

    footer.before(document.createElement("br"));

    document.querySelectorAll(".seletor-gramas").forEach(function (seletor) {
        const botoes = seletor.querySelectorAll(".btn-grama");
        const produto = seletor.closest(".produto");
        const precoEl = produto.querySelector(".preco");
        const gramasEl = produto.querySelector(".gramas");
        botoes.forEach(function (botao) {
            botao.addEventListener("click", function () {
                if (produto.classList.contains("indisponivel")) return;
                botoes.forEach(function (b) { b.classList.remove("ativo"); });
                botao.classList.add("ativo");
                const grama = parseInt(botao.dataset.grama);
                const preco100 = parseFloat(botao.dataset.preco);
                const novo = grama === 100 ? preco100 : (preco100 / 2);
                gramasEl.textContent = grama + "g";
                precoEl.textContent = "R$ " + novo.toFixed(2).replace(".", ",");
                const nomeBase = produto.querySelector("h2").innerText;
                const nomeSel = nomeBase + " (" + grama + "g)";
                const existe = carrinho.find(function (i) { return i.nome === nomeSel; });
                produto.querySelector(".qtd").innerText = existe ? existe.quantidade : 0;
                atualizarCarrinho();
            });
        });
    });

    document.querySelectorAll(".mais-produto").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const produto = botao.closest(".produto");
            if (produto.classList.contains("indisponivel")) {
                mostrarMensagem("Produto indisponível no momento");
                return;
            }
            const nome = obterNomeProduto(produto);
            const precoTxt = produto.querySelector(".preco").innerText;
            const qtdSpan = produto.querySelector(".qtd");
            const preco = parseFloat(precoTxt.replace("R$", "").trim().replace(",", "."));
            let item = carrinho.find(function (i) { return i.nome === nome; });
            if (item) {
                item.quantidade++;
                qtdSpan.innerText = item.quantidade;
                mostrarMensagem("Quantidade aumentada");
            } else {
                carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
                qtdSpan.innerText = 1;
                mostrarMensagem("Produto adicionado ao carrinho");
            }
            atualizarCarrinho();
        });
    });

    document.querySelectorAll(".menos-produto").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const produto = botao.closest(".produto");
            if (produto.classList.contains("indisponivel")) return;
            const nome = obterNomeProduto(produto);
            const qtdSpan = produto.querySelector(".qtd");
            let item = carrinho.find(function (i) { return i.nome === nome; });
            if (!item) return;
            item.quantidade--;
            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(function (i) { return i.nome !== nome; });
                qtdSpan.innerText = 0;
                mostrarMensagem("Produto removido do carrinho");
            } else {
                qtdSpan.innerText = item.quantidade;
                mostrarMensagem("Quantidade diminuída");
            }
            atualizarCarrinho();
        });
    });

    carrinho.forEach(function (item) {
        document.querySelectorAll(".produto").forEach(function (produto) {
            if (obterNomeProduto(produto) === item.nome) {
                produto.querySelector(".qtd").innerText = item.quantidade;
            }
        });
    });

    inicializarBusca();

    if (loading) loading.style.display = "none";
}

sincronizarAdmin();
