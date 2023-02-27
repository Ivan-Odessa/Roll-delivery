(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const cardBasket = document.querySelector(".card-basket");
    window.addEventListener("click", (function(e) {
        let counter;
        if ("minus" === e.target.dataset.action || "plus" === e.target.dataset.action) {
            const counterWrapper = e.target.closest(".content-card__counter");
            const counterBasketWrapper = e.target.closest(".card-basket__counter");
            counter = counterWrapper ? counterWrapper.querySelector("[data-counter]") : counter = counterBasketWrapper.querySelector("[data-counter]");
        }
        if ("plus" === e.target.dataset.action) counter.innerText = ++counter.innerText;
        if ("minus" === e.target.dataset.action) if (parseInt(counter.innerText) > 1) counter.innerText = --counter.innerText; else if (e.target.closest(".card-basket") && 1 === parseInt(counter.innerText)) {
            e.target.closest(".card-basket__item").remove();
            toggleBasketStatus();
            calcCardPriceAndDelivery();
        }
        if (e.target.hasAttribute("data-action") && e.target.closest(".card-basket")) calcCardPriceAndDelivery();
        if (e.target.hasAttribute("data-cart-btn")) {
            const card = e.target.closest(".card");
            const cardInfo = {
                id: card.dataset.id,
                img: card.querySelector(".card__img").getAttribute("src"),
                alt: card.querySelector(".card__img").getAttribute("alt"),
                title: card.querySelector(".card__title").innerText,
                itemsInBox: card.querySelector("[data-items-in-box]").innerText,
                counter: card.querySelector("[data-counter]").innerText,
                weight: card.querySelector(".price-content__weight").innerText,
                price: card.querySelector(".price-content__currency").innerText
            };
            const itemInCard = cardBasket.querySelector(`[data-id ="${cardInfo.id}"]`);
            if (itemInCard) {
                const counterEl = itemInCard.querySelector("[data-counter]");
                counterEl.innerText = parseInt(counterEl.innerText) + parseInt(cardInfo.counter);
            } else {
                const basketItem = `\n         <div class="card-basket__item" data-id="${cardInfo.id}">\n            <div class="card-basket__top">\n               <div class="card-basket__img">\n                   <img src="${cardInfo.img}" alt="${cardInfo.alt}">\n               </div>\n               <div class="card-basket__desc">\n\n                  <div class="card-basket__title">${cardInfo.title}</div>\n                  <div class="card-basket__weight">${cardInfo.itemsInBox} / ${cardInfo.weight}</div>\n         \n                  <div class="card-basket__content">\n         \n                     <div class="card-basket__counter">\n                        <div class="card-basket__control" data-action="minus">-</div>\n                        <div class="card-basket__current" data-counter="">${cardInfo.counter}</div>\n                        <div class="card-basket__control" data-action="plus">+</div>\n                     </div>\n                     \n                     <div class="card-basket__price">\n                        <div class="card-basket__currency">${cardInfo.price}</div>\n                     </div>\n                     \n                  </div>\n                     \n               </div>\n            </div>\n                     </div>`;
                cardBasket.insertAdjacentHTML("afterbegin", basketItem);
            }
            card.querySelector("[data-counter]").innerText = "1";
            toggleBasketStatus();
            calcCardPriceAndDelivery();
        }
    }));
    function toggleBasketStatus() {
        const cartEmpty = document.querySelector("[data-cart-empty]");
        const orderForm = document.querySelector("#order-form");
        if (cardBasket.children.length > 0) {
            cartEmpty.classList.add("hidden");
            orderForm.classList.remove("hidden");
        } else {
            cartEmpty.classList.remove("hidden");
            orderForm.classList.add("hidden");
        }
    }
    function calcCardPriceAndDelivery() {
        const basketItems = document.querySelectorAll(".card-basket__item");
        const totalPriceEl = document.querySelector(".basket__total-cost");
        const deliveryFree = document.querySelector(".basket__delivery-free");
        const deliveryBox = document.querySelector(".basket__delivery-box");
        const dolar = document.querySelector(".dolar");
        let totalPrice = 0;
        basketItems.forEach((item => {
            const amounEl = item.querySelector("[data-counter]");
            const priceEl = item.querySelector(".card-basket__currency");
            const currentPrice = parseInt(amounEl.innerText) * parseInt(priceEl.innerText);
            totalPrice += currentPrice;
        }));
        totalPriceEl.innerText = totalPrice;
        if (totalPrice >= 1e3) {
            dolar.classList.add("hidden");
            deliveryFree.innerText = "free";
        } else {
            dolar.classList.remove("hidden");
            deliveryFree.innerText = "100";
            totalPriceEl.innerText = totalPrice + +deliveryFree.innerText;
        }
        if (totalPrice > 0) deliveryBox.classList.remove("hidden"); else {
            deliveryBox.classList.add("hidden");
            dolar.classList.add("hidden");
            totalPriceEl.innerText = "0";
        }
    }
    window["FLS"] = true;
    isWebp();
})();