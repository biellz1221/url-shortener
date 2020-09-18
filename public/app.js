const app = new Vue({
	el: '#app',
	data() {
		return {
			url: '',
			slug: '',
			error: '',
			created: '',
			formVisible: true,
			slugCheck: '',
			urlData: {
				url: '',
				slug: '',
				clicks: '',
			},
		};
	},
	methods: {
		async shorten() {
			this.error = '';
			const response = await fetch('/url', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					url: this.url,
					slug: this.slug || undefined,
				}),
			});
			if (response.ok) {
				const result = await response.json();
				//				console.log();
				this.formVisible = false;
				this.created = window.location.href + result.slug;
			} else {
				const result = await response.json();
				console.log(result);
				this.error = result.message;
				alert(this.error);
			}
		},
		async getUrlData() {
			this.error = '';
			const response = await fetch(`/url/${this.slugCheck}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
				},
			});
			if (response.ok) {
				const result = await response.json();
				//this.formVisible = false;
				console.log(result);
				this.urlData.url = result.ogUrl;
				this.urlData.slug = result.slug;
				this.urlData.clicks = result.clicks;
			} else {
				const result = await response.json();
				console.log(result);
				this.error = result.message;
				alert(this.error);
			}
		},
	},
});

//admin
//CavaloFesteiro2020,
