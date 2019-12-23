var LOAD_NUM = 4;
var watcher;
new Vue({
	el: "#app",
	data: {
		total: 0,
		products: [],
		cart: [],
		search: "",
		lastSearch: "",
		loading: false,
		results: []
	},
	methods: {
		addToCart: function(product) {
			this.total += product.price;
			var found = false;
			for (var i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					found = true;
				}
			}
			if (!found) {
				this.cart.push({
					id: product.id,
					price: product.price,
					title: product.title,
					qty: 1
				});
			}
		},
		inc: function(item) {
			item.qty++;
			this.total += item.price;
		},
		dec: function(item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				var i = this.cart.indexOf(item);
				this.cart.splice(i, 1);
			}
		},
		onSubmit: function() {
			this.products = [];
			this.loading = true;
			var path = "/search?q=".concat(this.search);
			this.$http.get(path).then(function(response) {
				//	setTimeout(function(){
				this.results = response.body;
				// this.products = response.body.slice(0, LOAD_NUM);
				this.lastSearch = this.search;
				this.appendResults();
				this.loading = false;
				//}.bind(this),3000);
			});
		},
		appendResults: function() {
			if (this.products.length < this.results.length) {
				var toAppend = this.results.slice(
					this.products.length,
					LOAD_NUM + this.products.length
				);
				this.products = this.products.concat(toAppend);
			}
		}
	},
	filters: {
		currency: function(price) {
			return "$".concat(price.toFixed(2));
		}
	},
	// created:function(){
	// 	this.onSubmit();
	// },
	updated: function() {
		var sensor = document.querySelector("#product-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResults);
	},
	beforeUpdate: function() {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	}
});
