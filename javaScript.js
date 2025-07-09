const listaProdutos = document.getElementById("lista-produtos");
const listaCarrinho = document.getElementById("lista-carrinho");
const botaoLimpar = document.getElementById("limpar");
const totalSpan = document.getElementById("total");
const botaoAdicionarProduto = document.getElementById("adicionar-produto");
// Inicializa os contadores com valores salvos ou zero
let contadorAdicionar = parseInt(localStorage.getItem("contadorAdicionar")) || 0;
let contadorLimpar = parseInt(localStorage.getItem("contadorLimpar")) || 0;

// Atualiza o HTML com os valores salvos
document.getElementById("contador-adicionar").textContent = contadorAdicionar;
document.getElementById("contador-limpar").textContent = contadorLimpar;


// (1) Lê os produtos salvos no localStorage
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || []; // ← localStorage (1)
    listaProdutos.innerHTML = "";

    produtos.forEach((produto, index) => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
          ${produto.nome} - R$ ${produto.preco.toFixed(2)}
          <div>
            <button class="adicionar" data-produto="${produto.nome}" data-preco="${produto.preco}">Adicionar</button>
            <button class="remover" data-index="${index}">Remover</button>
          </div>
        `;
        listaProdutos.appendChild(div);

        // (2) Clique em "Adicionar" um produto ao carrinho
        const botaoAdd = div.querySelector(".adicionar");
        botaoAdd.addEventListener("click", () => // ← EventListener (1)
            adicionarAoCarrinho(produto.nome, produto.preco)
        );

        // (3) Clique em "Remover" um produto da lista
        const botaoRemove = div.querySelector(".remover");
        botaoRemove.addEventListener("click", () => { // ← EventListener (2)
            removerProduto(index);
        });
    });
}

// (4) Adiciona produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}; // ← localStorage (2)

    if (carrinho[nome]) {
        carrinho[nome].quantidade += 1;
    } else {
        carrinho[nome] = { preco, quantidade: 1 };
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho)); // ← localStorage (3)
    carregarCarrinho();
}

// (5) Remove item do carrinho
function removerDoCarrinho(nome) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}; // ← localStorage (4)

    if (carrinho[nome]) {
        carrinho[nome].quantidade -= 1;
        if (carrinho[nome].quantidade <= 0) {
            delete carrinho[nome];
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho)); // ← localStorage (5)
        carregarCarrinho();
    }
}

// (6) Remove produto da lista de produtos
function removerProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || []; // ← localStorage (6)
    produtos.splice(index, 1);
    localStorage.setItem("produtos", JSON.stringify(produtos)); // ← localStorage (7)
    carregarProdutos();
}

// (7) Carrega e exibe carrinho
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}; // ← localStorage (8)
    listaCarrinho.innerHTML = "";
    let total = 0;

    for (const nome in carrinho) {
        const item = carrinho[nome];
        const li = document.createElement("li");
        li.innerHTML = `
          ${nome} x${item.quantidade} - R$ ${(item.quantidade * item.preco).toFixed(2)}
          <button class="remover" data-nome="${nome}">Remover</button>
        `;
        listaCarrinho.appendChild(li);

        // (8) Clique em "Remover" do carrinho
        li.querySelector(".remover").addEventListener("click", () => // ← EventListener (3)
            removerDoCarrinho(nome)
        );

        total += item.quantidade * item.preco;
    }

    totalSpan.textContent = total.toFixed(2);
}

// (9) Clique em "Adicionar Produto"
botaoAdicionarProduto.addEventListener("click", () => { // ← EventListener (4)
    const nomeInput = document.getElementById("nome-produto");
    const precoInput = document.getElementById("preco-produto");

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);

    if (!nome || isNaN(preco) || preco <= 0) {
        alert("Digite um nome válido e um preço maior que zero.");
        return;
    }

    const produtos = JSON.parse(localStorage.getItem("produtos")) || []; // ← localStorage (9)
    produtos.push({ nome, preco });
    localStorage.setItem("produtos", JSON.stringify(produtos)); // ← localStorage (10)

    nomeInput.value = "";
    precoInput.value = "";

    carregarProdutos();
    contadorAdicionar++;
  localStorage.setItem("contadorAdicionar", contadorAdicionar);
  document.getElementById("contador-adicionar").textContent = contadorAdicionar;
});

// (10) Clique em "Limpar Carrinho"
botaoLimpar.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
  
    // Só conta se tiver itens no carrinho
    if (Object.keys(carrinho).length > 0) {
      contadorLimpar++;
      localStorage.setItem("contadorLimpar", contadorLimpar);
      document.getElementById("contador-limpar").textContent = contadorLimpar;
      
      localStorage.removeItem("carrinho");
      carregarCarrinho();
    } else {
      alert("O carrinho já está vazio!");
    }
  });
  

// Inicialização
carregarProdutos();
carregarCarrinho();