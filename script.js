const menu = document.getElementById("menu")
const btnCart = document.getElementById("cart-btn")
const addCart = document.getElementById("add-cart")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const alertAddress = document.getElementById("address-warn")
const btnCloseModal = document.getElementById("close-modal-btn")
const btnCheckout = document.getElementById("checkout-btn")

let cart = [];

// MODAL ---------------------------
// abrir modal do carrinho
btnCart.addEventListener("click", function () {
    updateToCart()
    cartModal.style.display = "flex"
})

// Fechar modal clicando fora dele
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar modal clicando no botão 
cartModal.addEventListener("click", function (event) {
    if (event.target === btnCloseModal) {
        cartModal.style.display = "none"
    }
})

//CARRINHO --------------------------
//add item no carrinho
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-cart") //Comando verifica se tem algum item com aquela classe 

    if (parentButton) {
        const name = parentButton.getAttribute("data-name") //Armazena o atributo daquela classe
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price) {
    const existeItem = cart.find(item => item.name === name)

    if (existeItem) {
        existeItem.qtd += 1;
    } else {
        cart.push({
            name,
            price,
            qtd: 1,
        })
    }

    updateToCart()
}

//Função para atualizar o carrinho "modal"
function updateToCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div> 
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.qtd}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.qtd;

        cartItems.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;
}

// função para remover item do carrinho
cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.qtd > 1) {
            item.qtd -= 1;
            updateToCart();
            return;
        }

        cart.splice(index, 1);
        updateToCart();
    }
}

//Pegando valor do input de endereço
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        alertAddress.classList.add("hidden")
        return;
    }
})

//finalizar pedido
btnCheckout.addEventListener("click", function () {
    const isOpen = checkOpen();
    if (!isOpen) {
        Toastify({
            text: "Estamos fechados no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        alertAddress.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviando pedido para o whatsapp
    const cartItems = cart.map((item) => {
        return `
        ${item.name} 
        Quantidade: ${item.qtd}
        Preço: R$${item.price},00
    `;
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "14999999999";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateToCart();
})

//Verificando horário
function checkOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 17;
}

const spanItem = document.getElementById("data-span");
const isOpen = checkOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}