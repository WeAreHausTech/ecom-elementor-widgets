<template>
  <div>Kategori: Elektronik</div>
  <div>
    <p>Sortera</p>
    <button @click="sortBy('name', 'ASC')">Namn asc</button>

    <button @click="sortBy('name', 'DESC')">Namn desc</button>

    <button @click="sortBy('createdAt', 'ASC')">Nyast skapad</button>

    <p>Filtrera</p>
    <button @click="filterFacetBy(3)">Toggle apple</button>

    <button @click="filterFacetBy(15)">Toggle sony</button>

    <button @click="filterFacetBy(9)">Toggle Photo</button>

    <button @click="clearFilters">Rensa filter</button>
  </div>

  <div v-if="this.pagination.totalItems !== null">
    Totalt: {{ this.pagination.totalItems }} produkter
    <div class="pagination">
      <button
        class="pagination-button"
        :disabled="pagination.activePage === 1"
        @click.prevent="goToPage(pagination.activePage - 1)"
      >
        Föregående
      </button>
      <button
        v-for="pageNumber in pagination.totalPages"
        :key="pageNumber"
        class="pagination-button"
        :class="{ active: pageNumber === pagination.activePage }"
        @click.prevent="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
      <button
        class="pagination-button"
        :disabled="pagination.activePage === pagination.totalPages"
        @click.prevent="goToPage(pagination.activePage + 1)"
      >
        Nästa
      </button>
    </div>
  </div>

  <div v-if="this.initialProducts">
    <div
      v-for="value in this.initialProducts.facets.keys"
      v-bind:key="value.id"
    >
      <h4>{{ value.name }}</h4>
      <div
        v-for="facet in this.initialProducts.facets.values"
        v-bind:key="facet.id"
      >
        <div v-if="facet.facet.id == value.id" :id="facet.id">
          <p>{{ facet.name }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="product-wrapper" v-if="activeProducts">
    <div
      class="product-card"
      v-for="product in activeProducts"
      :key="product.id"
    >
      <div>
        <h2>{{ product.name }}</h2>
      </div>
      <div>{{ product.description }}</div>
      <div>
        <h4>Från {{ getMinPrice(product.variants) }}</h4>
      </div>
      <div></div>
      <div class="tags" v-for="facet in product.facetValues" :key="facet.id">
        - {{ facet.name }}
      </div>
      <div class="img-wrapper">
        <img :src="product.featuredAsset.source" :alt="product.name" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeProducts: [],
      initialData: [],
      data: [{}],
      sort: "name: ASC",
      categoryId: 6,
      pagination: {
        totalItems: null,
        totalPages: null,
        activePage: 1,
        limit: 9,
        skip: 0,
      },
      initialProducts: {
        ids: [],
        facets: {
          keys: [],
          values: [],
        },
        collections: [],
      },
      filters: {
        facets: [],
        collections: null,
      },
      currentProuctIds: [],
    };
  },
  mounted() {
    // Settings from tex Elementor widget settings
    const settings = {
      categoryId: 2, //int | null = all
      facetIds: [], // int array
      limitPerPage: 9, // int
      sort: "name: ASC", // sting
    };

    this.filters.collections = settings.categoryId;
    this.filters.facets = settings.facetIds;
    this.pagination.limit = settings.limitPerPage;
    this.sort = settings.sort;

    this.fetchInitialProducts();
  },
  methods: {
    getMinPrice(variants) {
      const minPrice = variants.reduce((minPrice, variant) => {
        return variant.price < minPrice ? variant.price : minPrice;
      });

      return minPrice.price + " " + minPrice.currencyCode;
    },
    goToPage(pageNumber) {
      this.pagination.activePage = pageNumber;
      this.pagination.skip = (pageNumber - 1) * this.pagination.limit;

      this.fetchFilteredProducts();
    },
    resetPagination() {
      this.pagination.activePage = 1;
      this.pagination.skip = 0;
    },
    clearFilters() {
      this.filters.facets = [];
      this.resetPagination();
      this.fetchFilteredProducts();
    },
    sortBy(type, value) {
      this.sort = `${type}: ${value}`;
      this.resetPagination();
      this.getProducts(this.currentProuctIds);
    },
    filterFacetBy(value) {
      const index = this.filters.facets.indexOf(value);
      if (index !== -1) {
        this.filters.facets.splice(index, 1);
      } else {
        this.filters.facets.push(value);
      }
      this.resetPagination();
      this.fetchFilteredProducts();
    },
    changeCategory(value) {
      this.filters.collections = value;
      this.filters.facets = [];
      this.resetPagination();
      this.fetchFilteredProducts();
    },
    async fetch(query) {
      try {
        const response = await axios.post("http://localhost:3000/shop-api", {
          query: query,
        });

        return response;
      } catch (error) {
        console.error("Error fetching products:", error);
        return error;
      }
    },
    async fetchInitialProducts() {
      const response = await this.getProductData();
      const initialFacets = response.data.data.search.facetValues;
      const initalProducts = response.data.data.search.items;
      this.initialData = initalProducts;

      const productIds = initalProducts.map((product) => {
        return product.productId.toString();
      });

      this.getPaginationData(response);
      this.getInitialFasetValues(initialFacets);
      this.initialProducts.ids = productIds;
      this.getProducts(productIds);
    },
    getPaginationData(response) {
      this.pagination.totalItems = response.data.data.search.totalItems;
      this.pagination.totalPages = Math.ceil(
        this.pagination.totalItems / this.pagination.limit
      );
    },
    async fetchFilteredProducts() {
      const response = await this.getProductData();
      const products = response.data.data.search.items;

      const productIds = products.map((product) => {
        return product.productId.toString();
      });
      this.getPaginationData(response);
      this.getProducts(productIds);
    },
    async getProductData() {
      const SearchQuery = `
        query SearchProducts {search(input: {
          collectionId: ${JSON.stringify(this.filters.collections)}
          groupByProduct: true
          take: ${this.pagination.limit}
          skip: ${this.pagination.skip}
          facetValueFilters:  [{ or: ${JSON.stringify(this.filters.facets)} }] 
        }) {
          totalItems
          items {
            productId
          }
          facetValues {
            facetValue {
              id
              name
              facet {
                id, 
                name
              }
            }
          }
        }
        }`;

      const response = await this.fetch(SearchQuery);
      return response;
    },
    async getProducts(productIds) {
      this.currentProuctIds = productIds;

      const ProductQuery = `
        query {
          products (options: {
            filter: {
              id: {
                in: ${JSON.stringify(productIds)}
              } 
            }
            sort: {
              ${this.sort}
            }
          }) {
            items {
              id
              name
              slug
              description
              createdAt
              variants {
                id
                price
                currencyCode
              }
              facetValues{
                id,
                name,
              }
              featuredAsset {
                source
              }
            }
          }
        }`;

      const response = await this.fetch(ProductQuery);
      this.activeProducts = response.data.data.products.items;
    },
    getInitialFasetValues(initialFacets) {
      const facetKeys = [];
      const facetValues = [];

      initialFacets.forEach((value) => {
        if (facetValues.some((e) => e.id === value.facetValue.id)) {
          return;
        } else {
          facetValues.push(value.facetValue);
        }
      });

      initialFacets.forEach((value) => {
        if (facetKeys.some((e) => e.id === value.facetValue.facet.id)) {
          return;
        } else {
          facetKeys.push(value.facetValue.facet);
        }
      });

      this.initialProducts.facets.values = facetValues;
      this.initialProducts.facets.keys = facetKeys;
    },
  },
};
</script>

<style scoped>
.product-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.product-card {
  background: #f5f5f5;
  max-width: 30%;
  padding: 5p;
}
.img-wrapper {
  position: relative;
  width: 100%;
  height: 150px;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.active {
  background-color: white;
}
.tags {
  padding: 5px;
}
</style>
