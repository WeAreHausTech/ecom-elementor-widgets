import "./index.css";
import {jsx as $2OUt5$jsx} from "react/jsx-runtime";
import $2OUt5$react, {Suspense as $2OUt5$Suspense} from "react";
import $2OUt5$reactdomclient from "react-dom/client";
import {VendureApolloProvider as $2OUt5$VendureApolloProvider, ProductList as $2OUt5$ProductList, Checkout as $2OUt5$Checkout, ProductDetail as $2OUt5$ProductDetail, Cart as $2OUt5$Cart, SearchField as $2OUt5$SearchField, CurrencyChooser as $2OUt5$CurrencyChooser, OrderConfirmation as $2OUt5$OrderConfirmation, DropdownCart as $2OUt5$DropdownCart} from "@haus-tech/ecom-components";
import {get as $2OUt5$get} from "lodash";
import $2OUt5$haustechecomcomponentsdistecommaincss from "@haus-tech/ecom-components/dist/ecom-main.css";

/* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable react-refresh/only-export-components */ /* eslint-disable no-case-declarations */ 






async function $6855cbb759c772d2$var$fetchCSSContent() {
    const response = await fetch((0, $2OUt5$haustechecomcomponentsdistecommaincss));
    return await response.text();
}
const $6855cbb759c772d2$var$renderElement = async (element, children)=>{
    const css = await $6855cbb759c772d2$var$fetchCSSContent();
    const shadowRoot = element.attachShadow({
        mode: "open"
    });
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    shadowRoot.appendChild(styleEl);
    const vendureToken = element.attributes.getNamedItem("data-vendure-token")?.value;
    return (0, $2OUt5$reactdomclient).createRoot(shadowRoot).render(/*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$react).StrictMode, {
        children: /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$VendureApolloProvider), {
            apiUrl: "https://livv-ecom-test.azurewebsites.net/shop-api",
            vendureToken: vendureToken,
            children: /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$Suspense), {
                children: children
            })
        })
    }));
};
document.addEventListener("DOMContentLoaded", async function() {
    const elements = Array.from(document.getElementsByClassName("ecom-components-root"));
    elements.forEach((element)=>{
        const dataAttributes = element.attributes;
        const widgetType = dataAttributes.getNamedItem("data-widget-type")?.value;
        switch(widgetType){
            case "product-list":
                const facetsAttributes = dataAttributes.getNamedItem("data-facet")?.value;
                let facetValues = [
                    {
                        or: []
                    }
                ];
                if (facetsAttributes) {
                    const facetArray = facetsAttributes.split(",").map(Number);
                    if (facetArray?.length > 0) facetValues = facetArray.map((facet)=>{
                        return {
                            and: String(facet)
                        };
                    });
                }
                const collectionId = dataAttributes.getNamedItem("data-collection")?.value;
                const enablePagination = +(0, $2OUt5$get)(dataAttributes.getNamedItem("data-pagination-enabled"), "value", 0);
                const enableSort = +(0, $2OUt5$get)(dataAttributes.getNamedItem("data-sort-enabled"), "value", 0);
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$ProductList), {
                    searchInputProps: {
                        facetValueFilters: facetValues,
                        take: +(0, $2OUt5$get)(dataAttributes.getNamedItem("data-take"), "value", 12),
                        collectionId: collectionId
                    },
                    enablePagination: Boolean(enablePagination),
                    enableSorting: Boolean(enableSort)
                }));
                break;
            case "checkout":
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$Checkout), {}));
                break;
            case "product-detail":
                const id = dataAttributes.getNamedItem("data-product")?.value;
                $6855cbb759c772d2$var$renderElement(element, id && /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$ProductDetail), {
                    id: id
                }));
                break;
            case "cart":
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$Cart), {}));
                break;
            case "search-field":
                const redirect = dataAttributes.getNamedItem("data-redirect-to")?.value;
                const placeholder = dataAttributes.getNamedItem("data-placeholder")?.value;
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$SearchField), {
                    openOnButton: true,
                    autofocus: true,
                    searchUrl: redirect,
                    placeholder: placeholder
                }));
                break;
            case "currency-chooser":
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$CurrencyChooser), {}));
                break;
            case "order-confirmation":
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$OrderConfirmation), {}));
                break;
            case "dropdown-cart":
                const cartUrl = dataAttributes.getNamedItem("data-redirect-to")?.value;
                $6855cbb759c772d2$var$renderElement(element, /*#__PURE__*/ (0, $2OUt5$jsx)((0, $2OUt5$DropdownCart), {
                    dropdownEnabled: false,
                    cartUrl: cartUrl
                }));
                break;
        }
    });
}, false);


//# sourceMappingURL=index.js.map
